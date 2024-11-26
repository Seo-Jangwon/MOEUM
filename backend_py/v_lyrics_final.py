import os
import re
import nltk
import torch
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
from PIL import Image
from diffusers import DiffusionPipeline

# NLTK 데이터 다운로드 (최초 1회 실행)
nltk.download('punkt')

nltk.download('stopwords')
nltk.download('vader_lexicon')
nltk.download('averaged_perceptron_tagger')

# GPU 설정
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "3"

# Genius API 설정
GENIUS_API_KEY = "Bearer GPObAJ6sPP1YTqY2TkAOVRL0RZ6Tc5jUCps7BN0MqgiwTQQt_7LHc8NDvaqTudR9"
GENIUS_API_URL = "https://api.genius.com/search?q="
HEADERS = {"Authorization": GENIUS_API_KEY}

# AI 모델 설정
pipe_text_to_image = DiffusionPipeline.from_pretrained(
    'SG161222/RealVisXL_V4.0', torch_dtype=torch.float16
)
pipe_text_to_image = pipe_text_to_image.to("cuda")

# -----------------------------
# 1. 크롤링 및 시각화 함수
# -----------------------------
def search_lyrics(title):
    """Genius에서 노래 제목(title)으로 가사를 검색하고 첫 번째 결과의 경로를 반환"""
    response = requests.get(GENIUS_API_URL + title, headers=HEADERS)
    if response.status_code != 200:
        print(f"Error fetching from Genius API: {response.status_code}")
        return None

    data = response.json()
    hits = data.get("response", {}).get("hits", [])
    if not hits:
        print("No results found for title.")
        return None

    endpoint = hits[0]['result']['path']
    print(f"Found song: {hits[0]['result']['full_title']}")
    return endpoint

def scrape_lyrics(endpoint):
    """Genius 웹페이지에서 가사를 크롤링하여 리스트로 반환"""
    lyrics_url = "https://genius.com" + endpoint
    response = requests.get(lyrics_url)
    if response.status_code != 200:
        print(f"Error fetching lyrics page: {response.status_code}")
        return None

    soup = BeautifulSoup(response.text, 'html.parser')
    divs = soup.find_all('div', attrs={'data-lyrics-container': 'true'})
    return [div.get_text(separator="\n").strip() for div in divs if div.get_text(separator="\n").strip()]

def preprocess_lyrics(lyric):
    """특수문자를 제거하고 소문자로 변환"""
    return re.sub(r'[^a-zA-Z\s]', '', lyric).lower().strip()

def extract_keywords(lyric):
    """가사에서 명사와 형용사를 추출하여 키워드 반환"""
    words = nltk.word_tokenize(preprocess_lyrics(lyric))
    words = [word for word in words if word not in stopwords.words('english')]
    tagged_words = nltk.pos_tag(words)
    return list(set(word for word, pos in tagged_words if pos.startswith('NN') or pos.startswith('JJ')))

def determine_mood(lyric):
    """감정 분석을 통해 분위기를 결정"""
    sentiment = SentimentIntensityAnalyzer().polarity_scores(lyric)
    compound = sentiment['compound']
    if compound >= 0.05:
        return 'bright and hopeful'
    elif compound <= -0.05:
        return 'dark and emotional'
    else:
        return 'neutral and calm'

def generate_prompt(lyric):
    """프롬프트 생성"""
    keywords = ', '.join(extract_keywords(lyric)) or lyric.strip()
    mood = determine_mood(lyric)
    return f"{keywords}, a scene with a {mood} atmosphere, extremely detailed, high resolution, ultra-realistic, 8K resolution, professional photography, cinematic lighting"

def create_visualization(song_id, lyrics):
    """각 가사를 시각화하여 이미지로 저장하고 경로를 반환"""
    output_dir = f"./lyrics_images/{song_id}"
    os.makedirs(output_dir, exist_ok=True)

    negative_prompt = (
        "text, typography, letters, words, captions, writing, "
        "cartoon, illustration, painting, drawing, sketch, "
        "blurry, low quality, deformed, distorted, unrealistic"
    )

    image_paths = []  # 생성된 이미지 경로를 저장할 리스트

    for i, lyric in enumerate(lyrics):
        print(f"Processing lyric segment {i + 1}: {lyric}")
        prompt = generate_prompt(lyric)
        print(f"Generated prompt: {prompt}")

        image = pipe_text_to_image(
            prompt,
            num_inference_steps=50,
            negative_prompt=negative_prompt,
            guidance_scale=7.5
        ).images[0]

        image_path = os.path.join(output_dir, f"{i + 1}_visualization.png")
        image.save(image_path)
        image_paths.append(image_path)  # 저장된 이미지 경로 추가
        print(f"Saved image {i + 1}: {image_path}")

    return image_paths

# -----------------------------
# 2. 메인 호출 함수
# -----------------------------
def generate_song_visuals(song_id, song_title):
    """
    곡 ID와 제목을 받아 가사를 크롤링하고 시각화 이미지를 생성.
    호출한 파일로 결과값을 반환.
    """
    endpoint = search_lyrics(song_title)
    if not endpoint:
        return {"status": "error", "message": "No song found for the provided title."}

    lyrics = scrape_lyrics(endpoint)
    if not lyrics:
        return {"status": "error", "message": "No lyrics found for the provided title."}

    # 시각화 이미지 생성
    print(f"Generating visualizations for song ID: {song_id}")
    image_paths = create_visualization(song_id, lyrics)

    # 결과값 반환
    return {
        "status": "success",
        "song_id": song_id,
        "song_title": song_title,
        "lyrics": lyrics,
        "image_paths": image_paths
    }
