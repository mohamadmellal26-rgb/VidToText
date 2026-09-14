FROM python:3.10-slim

# تثبيت ffmpeg والأدوات الأساسية للنظام
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /lib/apt/lists/*

WORKDIR /app

# نسخ وتثبيت المكتبات
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ باقي أكواد المشروع
COPY . .

# تشغيل التطبيق عبر Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]