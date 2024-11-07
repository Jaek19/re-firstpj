from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import httpx
from pathlib import Path
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# 정적 파일 설정
BASE_DIR = Path(__file__).resolve().parent
static_dir = BASE_DIR / "static"
static_dir.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

api_key = os.getenv("API_KEY")

@app.get("/")
async def read_root():
    return FileResponse(str(static_dir / "index.html"))

def extract_text_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    return soup.get_text(separator=' ', strip=True)

@app.get("/animals")
async def get_waiting_animals():
    url = f"http://openapi.seoul.go.kr:8088/{api_key}/json/TbAdpWaitAnimalView/1/10/"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            data = response.json()
            
            animals = []
            for row in data['TbAdpWaitAnimalView']['row']:
                thumbnail_url = f"https://animal.seoul.go.kr/comm/getImage?srvcId=MEDIA&upperNo={row['ANIMAL_NO']}&fileTy=ADOPTTHUMB&fileNo=1&thumbTy=L"
                detail_urls = [
                    f"https://animal.seoul.go.kr/comm/getImage?srvcId=MEDIA&upperNo={row['ANIMAL_NO']}&fileTy=ADOPTIMG&fileNo={i}&thumbTy=L"
                    for i in range(1, 6)
                ]
                
              
                video_url = None
                if 'INTRCN_MVP_URL' in row and row['INTRCN_MVP_URL']:
                    video_url = row['INTRCN_MVP_URL']
          
                introduction_text = extract_text_from_html(row.get('INTRCN_CN', ''))
                
                animal = {
                    'ANIMAL_NO': row['ANIMAL_NO'],
                    'NM': row['NM'],
                    'BREEDS': row['BREEDS'],
                    'SEXDSTN': row['SEXDSTN'],
                    'AGE': row['AGE'],
                    'BDWGH': row['BDWGH'],
                    'THUMBNAIL_URL': thumbnail_url,
                    'IMAGE_URLS': detail_urls,
                    'VIDEO_URL': video_url,
                    'INTRCN_CN': introduction_text 
                }
                animals.append(animal)
            
            return animals
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
""" 
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.1", port=8000) """