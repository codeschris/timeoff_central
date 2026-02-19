FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && exec \"$@\"", "sh"]

CMD ["python", "manage.py", "runserver"]