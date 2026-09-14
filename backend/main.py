from datetime import datetime, timedelta
import os
import shutil
import subprocess
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

print("Loading Whisper AI Model...")
model = whisper.load_model("tiny")
print("Model loaded successfully!")

# جدول لتخزين عدد الطلبات لكل IP وتاريخ اخر طلب
# الشكل: { "127.0.0.1": {"count": 1, "reset_time": datetime} }
user_limits = {}

MAX_REQUESTS = 3
WINDOW_HOURS = 24
MAX_DURATION_SECONDS = 300  # 5 دقائق


def check_user_limit(client_ip: str):
  now = datetime.now()
  if client_ip not in user_limits:
    user_limits[client_ip] = {"count": 0, "reset_time": now + timedelta(hours=WINDOW_HOURS)}

  data = user_limits[client_ip]

  # إذا انتهت فترة الـ 24 ساعة، نعيد تعيين العدار
  if now > data["reset_time"]:
    data["count"] = 0
    data["reset_time"] = now + timedelta(hours=WINDOW_HOURS)

  if data["count"] >= MAX_REQUESTS:
    return False

  data["count"] += 1
  return True


def get_video_duration(file_path: str) -> float:
  """استخراج مدة الفيديو بالثواني باستخدام ffprobe"""
  try:
    cmd = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
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
  return {"message": "VidToText API with Limits is running, Mohamad!"}


@app.post("/api/convert")
async def convert_video(request: Request, file: UploadFile = File(...)):
  # جلب بروتوكول الجهاز (IP) للزائر
  client_ip = request.client.host if request.client else "unknown"

  # التحقق من الحد المسموح (3 طلبات كل 24 ساعة)
  if not check_user_limit(client_ip):
    raise HTTPException(
        status_code=429,
        detail=(
            "لقد تجاوزت الحد المسموح به (3 فيديوهات كل 24 ساعة). يرجى المحاولة"
            " لاحقاً."
        ),
    )

  temp_file_path = f"temp_{file.filename}"

  try:
    with open(temp_file_path, "wb") as buffer:
      shutil.copyfileobj(file.file, buffer)

    # التحقق من مدة الفيديو ألا تتجاوز 5 دقائق
    duration = get_video_duration(temp_file_path)
    if duration > MAX_DURATION_SECONDS:
      raise HTTPException(
          status_code=400,
          detail=(
              f"مدة الفيديو ({int(duration)} ثانية) تتجاوز الحد الأقصى المسموح به"
              " وهو 5 دقائق."
          ),
      )

    # تفريغ الصوت عبر نموذج الذكاء الاصطناعي
    result = model.transcribe(temp_file_path)

    return {"status": "success", "text": result.get("text", "").strip()}

  except HTTPException as he:
    raise he
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

  finally:
    if os.path.exists(temp_file_path):
      os.remove(temp_file_path)


if __name__ == "__main__":
  import uvicorn

  uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)