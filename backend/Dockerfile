FROM python:3.12
WORKDIR /code
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
COPY requirements.txt /code/
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY app /code/app
EXPOSE 8000
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "8000"]