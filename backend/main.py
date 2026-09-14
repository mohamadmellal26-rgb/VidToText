from datetime import datetime, timedelta
import os
import shutil
import subprocess
import gc
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import whisper

app = FastAPI(title="VidToText API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# عدم تحميل النموذج فور الإقلاع لتفادي خطأ الذاكرة (Out of Memory) على الخطة المجانية
model = None

def get_whisper_model():
    global model
    if model is None:
        print("Loading Whisper AI Model (Lazy Loading)...")
        model = whisper.load_model("tiny")
        print("Model loaded successfully!")
    return model

# جدول تخزين الطلبات
user_limits = {}

MAX_REQUESTS = 3
WINDOW_HOURS = 24
MAX_DURATION_SECONDS = 300  # 5 دقائق


def check_user_limit(client_ip: str) -> bool:
    now = datetime.now()
    if client_ip not in user_limits:
        user_limits[client_ip] = {"count": 0, "reset_time": now + timedelta(hours=WINDOW_HOURS)}

    data = user_limits[client_ip]

    # إعادة تعيين العدّاد بعد انتهاء الـ 24 ساعة
    if now > data["reset_time"]:
        data["count"] = 0
        data["reset_time"] = now + timedelta(hours=WINDOW_HOURS)

    if data["count"] >= MAX_REQUESTS:
        return False

    return True


def increment_user_limit(client_ip: str):
    if client_ip in user_limits:
        user_limits[client_ip]["count"] += 1


def get_video_duration(file_path: str) -> float:
    """استخراج مدة الفيديو بالثواني باستخدام ffprobe"""
    try:
        cmd = [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            file_path,
        ]
        result = subprocess.run(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True
        )
        return float(result.stdout.strip())
    except Exception:
        return 0.0


@app.get("/")
def read_root():
    return {"status": "online", "message": "VidToText API is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/convert")
async def convert_video(request: Request, file: UploadFile = File(...)):
    # جلب IP العميل (مع دعم البروكسي مثل Render/Cloudflare)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "unknown"

    # التحقق من الحد المسموح
    if not check_user_limit(client_ip):
        raise HTTPException(
            status_code=429,
            detail="لقد تجاوزت الحد المسموح به (3 فيديوهات كل 24 ساعة). يرجى المحاولة لاحقاً.",
        )

    # إنشاء اسم ملف مؤقت آمن لضمان عدم تضارب الطلبات المتزامنة
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".tmp"
    temp_file_path = f"temp_{os.urandom(8).hex()}{file_ext}"

    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # التحقق من مدة الفيديو
        duration = get_video_duration(temp_file_path)
        if duration > MAX_DURATION_SECONDS:
            raise HTTPException(
                status_code=400,
                detail=f"مدة الفيديو ({int(duration)} ثانية) تتجاوز الحد الأقصى المسموح به وهو 5 دقائق.",
            )

        # استدعاء النموذج عند الحاجة فقط
        ai_model = get_whisper_model()
        result = ai_model.transcribe(temp_file_path)

        # زيادة العدّاد فقط بعد نجاح العملية
        increment_user_limit(client_ip)

        return {"status": "success", "text": result.get("text", "").strip()}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"حدث خطأ أثناء المعالجة: {str(e)}")

    finally:
        # إزالة الملف المؤقت
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        # تفريغ الذاكرة المؤقتة (Garbage Collection)
        gc.collect()


if __name__ == "__main__":
    import uvicorn
    # ربط السيرفر بـ 0.0.0.0 ليقبل الاتصالات الخارجية في بيئة Docker
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)