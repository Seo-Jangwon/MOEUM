from diffusers import DiffusionPipeline, StableDiffusionImg2ImgPipeline
import os
import torch
from PIL import Image
import re
import nltk
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer

# NLTK 데이터 다운로드 (최초 1회 실행)
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')
nltk.download('vader_lexicon')

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "3"  # 사용하시는 GPU 번호에 맞게 수정하세요

# 첫 번째 모델 설정 (텍스트 -> 기본 이미지 생성)
pipe_text_to_image = DiffusionPipeline.from_pretrained(
    'SG161222/RealVisXL_V4.0',
    torch_dtype=torch.float16
)
pipe_text_to_image = pipe_text_to_image.to("cuda")

def parse_lyrics_file():
    print("==============================")
    print("parse_lyrics_file")
    print("==============================")
    
    with open("./lyrics.txt", "r", encoding='utf-8') as f:
        lyrics = f.read()
    
    print(lyrics)
    return list(filter(None, lyrics.strip().split('★')))

def preprocess_lyrics(lyric):
    # 특수문자 제거 및 소문자 변환
    lyric_clean = re.sub(r'[^a-zA-Z\s]', '', lyric)
    lyric_clean = lyric_clean.lower()
    lyric_clean = lyric_clean.strip()
    return lyric_clean

def extract_keywords(lyric):
    lyric_clean = preprocess_lyrics(lyric)
    words = nltk.word_tokenize(lyric_clean)
    # 불용어 제거
    words = [word for word in words if word not in stopwords.words('english')]
    # 품사 태깅
    tagged_words = nltk.pos_tag(words)
    # 명사와 형용사 추출
    keywords = [word for word, pos in tagged_words if pos.startswith('NN') or pos.startswith('JJ')]
    # 중복 제거
    keywords = list(set(keywords))
    return keywords

def determine_mood(lyric):
    sia = SentimentIntensityAnalyzer()
    sentiment = sia.polarity_scores(lyric)
    compound = sentiment['compound']
    if compound >= 0.05:
        mood = 'bright and hopeful'
    elif compound <= -0.05:
        mood = 'dark and emotional'
    else:
        mood = 'neutral and calm'
    return mood

def generate_prompt(lyric):
    keywords = extract_keywords(lyric)
    if keywords:
        keywords_str = ', '.join(keywords)
    else:
        keywords_str = lyric.strip()
    mood = determine_mood(lyric)
    
    prompt = (
        f"{keywords_str}, a scene with a {mood} atmosphere, "
        "extremely detailed, high resolution, "
        "ultra-realistic, 8K resolution, professional photography, cinematic lighting"
    )
    return prompt

def generate_images_from_lyrics(music_name, lyrics):
    print("==============================")
    print("generate_images_from_lyrics")
    print("==============================")
    
    """각 파트를 시각화하고 저장 경로에 이미지를 저장합니다."""
    path = "./lyrics_images/" + music_name
    os.makedirs(path, exist_ok=True)
    negative_prompt = (
        "text, typography, letters, words, captions, writing, "
        "cartoon, illustration, painting, drawing, sketch, "
        "blurry, low quality, deformed, distorted, unrealistic"
    )
    generator = torch.manual_seed(0)
    
    # Step 1: 텍스트에서 기본 이미지 생성
    intermediate_images = []  # 중간 이미지와 경로를 저장할 리스트
    for i, lyric in enumerate(lyrics):
        print(f"Lyric segment {i + 1}: {lyric}")
        
        prompt = generate_prompt(lyric)
        print(f"Generated prompt: {prompt}")
        
        image = pipe_text_to_image(
            prompt,
            num_inference_steps=50,
            negative_prompt=negative_prompt,
            guidance_scale=7.5
        ).images[0]
        intermediate_image_path = os.path.join(path, f"{i + 1}_intermediate.png")
        image.save(intermediate_image_path)
        print(f"Intermediate image {i + 1} generated: {intermediate_image_path}")

# 가사를 파싱하고 이미지 생성 및 개선 작업 수행
lyrics = parse_lyrics_file()
generate_images_from_lyrics("AllIWantfor", lyrics)
