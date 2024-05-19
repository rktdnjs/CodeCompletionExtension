import openai
import json

# OpenAI API 키 설정
openai.api_key = 'your-api-key'

# JSON 파일 경로 설정
file_path = './fine_tuning_init.jsonl'

# 파일 업로드 및 파일 ID 반환
def upload_file(file_path):
    with open(file_path, 'rb') as file:
        response = openai.File.create(
            file=file,
            purpose='fine-tune'
        )
    print(f"Uploaded file ID: {response['id']}")
    return response['id']

# 파인튜닝 작업 생성 및 작업 ID 반환
def create_fine_tuning_job(file_id):
    fine_tune_response = openai.FineTune.create(
        training_file=file_id,
        model="gpt-3.5-turbo"
    )
    print(f"Created fine-tuning job ID: {fine_tune_response['id']}")
    return fine_tune_response['id']

# 파인튜닝 작업 상태 모니터링
def monitor_fine_tuning(job_id):
    import time
    while True:
        job_status = openai.FineTune.retrieve(id=job_id)
        status = job_status["status"]
        print(f"Job {job_id} status: {status}")
        if status in ["succeeded", "failed"]:
            break
        time.sleep(60)  # 1분마다 상태 확인

# 메인 함수
if __name__ == "__main__":
    try:
        file_id = upload_file(file_path)
        job_id = create_fine_tuning_job(file_id)
        monitor_fine_tuning(job_id)
        print('Fine-tuning job completed.')
    except Exception as error:
        print(f'Error: {error}')
