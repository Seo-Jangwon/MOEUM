# ----- 필요한 라이브러리 임포트 -----
import os
import torch
import logging
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import librosa
from diffusers import DiffusionPipeline
from PIL import Image
import threading
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

# ----- GPU 설정 -----
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "3"  # 기존 GPU 설정 유지

print(os.environ["CUDA_VISIBLE_DEVICES"])
print(torch.cuda.is_available())

client_credentials_manager = SpotifyClientCredentials(client_id='372d841a811545ffb7354cea56cdb9e8', client_secret='76220c93e48443ca927e1b469af1e968')
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

track_id = '0bYg9bo50gSsH3LtXe2SQn' # All I Want for Christmas Is You
track_id = '2t8UoPFVXCRZulscbwv0QL' # We Will Rock You
density_weight = 0.07
valence_weight, energy_weight, danceability_weight = 0.5, 0.5, 0.2

def init(track_id):
  audio_features = sp.audio_features(track_id)[0]
  audio_analysis = sp.audio_analysis(track_id)

  return audio_features, audio_analysis

def get_sections_beats(audio_analysis):
  return audio_analysis['sections'], audio_analysis['segments'], audio_analysis['beats']

def analyze_overall(audio_features):
  overall_meter = audio_features['time_signature']
  overall_tempo = audio_features['tempo']
  mode = 'Major' if audio_features['mode'] == 1 else 'Minor'
  keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  key = keys[audio_features['key']]

  danceability = audio_features['danceability']
  energy = audio_features['energy']
  valence = audio_features['valence']
  acousticness = audio_features['acousticness']
  instrumentalness = audio_features['instrumentalness']
  liveness = audio_features['liveness']
  speechiness = audio_features['speechiness']
  loudness = audio_features['loudness']

  print(f"Overall Meter: {overall_meter}/4")
  print(f"Overall Tempo: {overall_tempo} BPM")
  print(f"OVerall Mode: {mode}")
  print(f"Overall Key: {key}")
  print()

  print(f"Danceability: {danceability:.2f}")
  print(f"Energy: {energy:.2f}")
  print(f"Valence (Mood): {valence:.2f}")
  print(f"Acousticness: {acousticness:.2f}")
  print(f"Instrumentalness: {instrumentalness:.2f}")
  print(f"Liveness: {liveness:.2f}")
  print(f"Speechiness: {speechiness:.2f}")
  print(f"Loudness: {loudness:.2f} dB")

  return overall_meter, overall_tempo, mode, key

def analyze_overall_beats(beats):
  beat_start_times = list(map(lambda beat: beat['start'], beats))
  beat_durations = list(map(lambda beat: beat['duration'], beats))

  return beat_start_times, beat_durations

def get_section_tempos(sections):
  tempo_start_times = list(map(lambda section: section['start'], sections))
  tempo_values = list(map(lambda section: section['tempo'], sections))
  meter_start_times = tempo_start_times
  meter_values = list(map(lambda section: section['time_signature'], sections))

  return tempo_start_times, tempo_values, meter_start_times, meter_values

def get_section_beats(sections, beats):
  section_start_times = []
  section_beats = []
  section_beat_densities = []

  for section in sections:
    section_start = section['start']
    section_duration = section['duration']
    section_beat = [beat for beat in beats if section_start <= beat['start'] < section_start + section_duration]

    section_beats.append(section_beat)

    if section_beat:
      average_beat_duration = np.mean([beat['duration'] for beat in section_beat])
      beat_density = 1 / average_beat_duration

      section_beat_densities.append(beat_density)
    else:
      section_beat_densities.append(0)

    section_start_times.append(section_start)

  if section_beat_densities:
    average_beat_density = np.mean(section_beat_densities)
  else:
    average_beat_density = 0

  return section_start_times, section_beats, section_beat_densities, average_beat_density

def draw_section_beat_density_threshold(section_start_times, section_beat_densities, average_beat_density, high_threshold, low_threshold):
  plt.figure(figsize=(10, 5))

  plt.plot(section_start_times, section_beat_densities, marker='o', linestyle='-', color='b')
  plt.axhline(y=average_beat_density, color='r', linestyle='--', label='Average Beat Density')  # Plot average line for reference
  plt.axhline(y=high_threshold, color='g', linestyle='--', label=f'High Threshold ({density_weight*100:.0f}% above average)')  # Plot high threshold line
  plt.axhline(y=low_threshold, color='orange', linestyle='--', label=f'Low Threshold ({density_weight*100:.0f}% below average)')  # Plot low threshold line

  plt.xlabel('Time (s)')
  plt.ylabel('Beat Density (beats per second)')
  plt.title('Beat Density per Section')
  plt.legend()

  plt.show()

def analyze_section_beat_density_threshold(section_start_times, section_beat_densities, density_weight):
  high_threshold = average_beat_density * (1 + density_weight)
  low_threshold = average_beat_density * (1 - density_weight)

  section_beat_density_threshold = []

  # -1: low, 0: avg, 1: high
  for idx, section_start in enumerate(section_start_times):
    beat_density = section_beat_densities[idx]
    print(f"Section at {section_start:.2f}s\t|\tBeat Density: {beat_density:.2f} beats per second", end = "\t|\t")

    if beat_density > high_threshold:
      section_beat_density_threshold.append(1)
      print("High")
    elif beat_density < low_threshold:
      section_beat_density_threshold.append(-1)
      print("Low")
    else:
      section_beat_density_threshold.append(0)
      print("-")

  draw_section_beat_density_threshold(section_start_times, section_beat_densities, average_beat_density, high_threshold, low_threshold)

  return section_beat_density_threshold

def get_section_loudness_timbre(sections, audio_analysis):
  section_loudnesses = [section['loudness'] for section in sections]
  section_timbres = []

  for section in sections:
    section_start = section['start']
    section_end = section_start + section['duration']

    section_segments = [
      segment for segment in segments
      if section_start <= segment['start'] < section_end
    ]

    if section_segments:
      timbre_values = [segment['timbre'] for segment in section_segments]
      avg_timbre = np.mean(timbre_values, axis=0).tolist()
    else:
      avg_timbre = [0.0] * 12

    section_timbres.append(avg_timbre)

  return section_loudnesses, section_timbres

def analyze_mood(audio_features, section_tempo, valence_weight, energy_weight, danceability_weight, valence, energy, danceability):
  if section_tempo <= 60:
    tempo_mood_weight = 0.3
  elif section_tempo <= 76:
    tempo_mood_weight = 0.6
  elif section_tempo <= 108:
    tempo_mood_weight = 0.9
  elif section_tempo <= 120:
    tempo_mood_weight = 1
  elif section_tempo <= 156:
    tempo_mood_weight = 1.3
  elif section_tempo <= 200:
    tempo_mood_weight = 1.5
  else:
    tempo_mood_weight = 1.8

  return (valence * valence_weight + energy * energy_weight + danceability * danceability_weight) * tempo_mood_weight

def analyze_mood_over_sections(audio_features, sections, tempo_values):
  valence = audio_features['valence']
  energy = audio_features['energy']
  danceability = audio_features['danceability']

  section_moods = []

  for i, section in enumerate(sections):
    start = section['start']
    duration = section['duration']

    mood_score = analyze_mood(audio_features, tempo_values[i], valence_weight, energy_weight, danceability_weight, valence, energy, danceability)

    if mood_score >= 0.7:
      mood = 'Happy'
    elif mood_score >= 0.5:
      mood = 'Content'
    elif mood_score >= 0.3:
      mood = 'Melancholic'
    else:
      mood = 'Sad'

    section_moods.append({'start': start, 'duration': duration, 'mood': mood})

  section_moods = pd.DataFrame(section_moods)
  draw_mood_changes(section_moods)

  return section_moods

def draw_mood_changes(section_moods):
  time_points = []
  mood_values = []
  mood_mapping = {'Sad': 0, 'Melancholic': 1, 'Content': 2, 'Happy': 3}

  for _, row in section_moods.iterrows():
    time_points.append(row['start'])
    mood_values.append(mood_mapping[row['mood']])

  plt.figure(figsize=(10, 5))

  plt.plot(time_points, mood_values, marker='o', linestyle='-')
  plt.xlabel('Time (seconds)')
  plt.ylabel('Mood')
  plt.yticks(list(mood_mapping.values()), list(mood_mapping.keys()))
  plt.title('Mood Changes Over Time')

  plt.show()

def analyze_timbre(timbre_vector):
  characteristics = []

  if timbre_vector[2] < 0:
    characteristics.append('flat')
  elif timbre_vector[3] > 0.5:
    characteristics.append('strong attack')
  if timbre_vector[1] > 0:
    characteristics.append('bright')
  if timbre_vector[4] > 0:
    characteristics.append('resonant')

  if len(characteristics) == 0:
    return 'neutral'
  else:
    return ', '.join(characteristics)


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

logging.getLogger("spotipy").setLevel(logging.ERROR)

audio_features, audio_analysis = init(track_id)
sections, segments, beats = get_sections_beats(audio_analysis)

overall_meter, overall_tempo, mode, key = analyze_overall(audio_features)
beat_start_times, beat_durations = analyze_overall_beats(beats)
tempo_start_times, tempo_values, meter_start_times, meter_values = get_section_tempos(sections)

section_start_times, section_beats, section_beat_densities, average_beat_density = get_section_beats(sections, beats)
section_beat_density_threshold = analyze_section_beat_density_threshold(section_start_times, section_beat_densities, density_weight)
section_loudnesses, section_timbres = get_section_loudness_timbre(sections, audio_analysis)

df = analyze_mood_over_sections(audio_features, sections, tempo_values)

audio_file = 'musics/We Will Rock You (Movie Mix)-11-Que....mp3'
y, sr = librosa.load(audio_file)


section_pitch_values = []

for i in range(len(section_start_times) - 1):
  start = section_start_times[i]
  end = section_start_times[i + 1]
  beat_interval = 1 / section_beat_densities[i]

  start_sample = int(start * sr)
  end_sample = int(end * sr)
  y_section = y[start_sample:end_sample]

  pitches, magnitudes = librosa.piptrack(y=y_section, sr=sr)
  section_pitches = []

  current_time = 0

  while current_time < (end - start):
    beat_frame = librosa.time_to_frames(current_time, sr=sr)

    if beat_frame < pitches.shape[1]:
      index = magnitudes[:, beat_frame].argmax()
      pitch = pitches[index, beat_frame]
      volume = magnitudes[index, beat_frame]

      if pitch > 0:
        note = librosa.hz_to_note(pitch)
        section_pitches.append((current_time + start, note, volume))

    current_time += beat_interval

  volumes = [volume for _, _, volume in section_pitches]

  if len(volumes) > 0:
    mean_volume = np.mean(volumes)
    std_volume = np.std(volumes)
    z_scores = (volumes - mean_volume) / std_volume
    threshold = -3 # for vibration
    threshold = 0 # for shapes
  else:
    threshold = 0
    z_scores = []

  filtered_pitches = [
    (time, note, volume) for (time, note, volume), z in zip(section_pitches, z_scores) if z >= threshold
  ]
  section_pitch_values.append((start, end, filtered_pitches))

timbre_data_per_pitch = []

for start, end, pitches in section_pitch_values:
  for time, note, volume in pitches:
    matching_segment = next((segment for segment in segments if segment['start'] <= time < (segment['start'] + segment['duration'])), None)

    if matching_segment:
      timbre_data_per_pitch.append((time, note, volume, matching_segment['timbre']))

pitch_characteristics = []

for time, note, volume, timbre_vector in timbre_data_per_pitch:
  timbre_characteristic = analyze_timbre(timbre_vector)
  pitch_characteristics.append((time, note, volume, timbre_characteristic))


merged_pitch_characteristics = []
i = 0

while i < len(pitch_characteristics):
  current_time, current_note, current_volume, current_characteristic = pitch_characteristics[i]
  # Merge "strong attack" pitches
  if 'strong attack' in current_characteristic:
    j = i + 1
    while j < len(pitch_characteristics):
      next_time, next_note, next_volume, next_characteristic = pitch_characteristics[j]
      if next_note == current_note and 'strong attack' not in next_characteristic:
        j += 1
      else:
        break
    if j > i + 1:
      current_characteristic = current_characteristic.replace('strong attack', 'flat')
    merged_pitch_characteristics.append((current_time, current_note, current_volume, current_characteristic))
    i = j
  else:
    merged_pitch_characteristics.append((current_time, current_note, current_volume, current_characteristic))
    i += 1

i = 0
final_pitch_characteristics = []

while i < len(merged_pitch_characteristics):
  current_time, current_note, current_volume, current_characteristic = merged_pitch_characteristics[i]
  merged_volume = current_volume
  j = i + 1
  while j < len(merged_pitch_characteristics):
    next_time, next_note, next_volume, next_characteristic = merged_pitch_characteristics[j]
    if 'flat' in current_characteristic and current_note == next_note:
      merged_volume += next_volume
      j += 1
    elif 'flat' in next_characteristic and current_note == next_note:
      merged_volume += next_volume
      j += 1
    elif 'strong attack' not in current_characteristic and current_note == next_note and 'strong attack' not in next_characteristic:
      merged_volume += next_volume
      j += 1
    else:
      break
  final_pitch_characteristics.append((current_time, current_note, merged_volume, current_characteristic))
  i = j

all_notes = sorted(set(note for _, note, _, _ in final_pitch_characteristics), key=lambda x: note_to_midi(x))
note_to_index = {note: idx for idx, note in enumerate(all_notes)}


plt.figure(figsize=(40, 8))
marker_dict = {
  'flat': 's',
  'strong attack': 'v',
  'bright': '*',
  'resonant': 'o',
  'neutral': 'o'
}
for time, note, volume, characteristic in final_pitch_characteristics:
  marker = 'o'
  characteristics = characteristic.split(', ')
  for char in characteristics:
    if char in marker_dict:
      marker = marker_dict[char]
      break

  plt.scatter(time, note_to_index[note], s=volume, marker=marker, alpha=0.6)

x_ticks = section_start_times + [section_start_times[-1] + (section_start_times[-1] - section_start_times[-2])]
plt.xticks(x_ticks)
plt.yticks(ticks=range(len(all_notes)), labels=all_notes)

plt.xlabel('Time (s)')
plt.ylabel('Note')
plt.title('Note Contour for Each Section with Volume and Timbre Indication')

plt.show()


try:
  lyrics_timestamp.make()
except:
  print("except MAKE")


f = open('./lyrics_timestamp.txt', 'r')
lyrics_timestamps = [x.strip() for x in f.readlines()]
f.close()

parsed_lyrics_timestamps = []
parsed_timestamps = []

for timestamp in lyrics_timestamps:
  parsed_lyrics_timestamps.append(ast.literal_eval(timestamp))
  parsed_timestamps.append((parsed_lyrics_timestamps[-1]["timestamp"][0], parsed_lyrics_timestamps[-1]["timestamp"][1] - parsed_lyrics_timestamps[-1]["timestamp"][0]))



j = OrderedDict()
j["code"] = 200
j["data"] = {"vibrations": [], "notes": []}

for time, duration in parsed_timestamps:
  j["data"]["vibrations"].append({"time": time, "duration": duration})


width = 80
height = 80

note_order = {'C': 0, 'C♯': 1, 'D': 2, 'D♯': 3, 'E': 4, 'F': 5, 'F♯': 6, 'G': 7, 'G♯': 8, 'A': 9, 'A♯': 10, 'B': 11}
timestamp_gap = 0.5
minimum_flat_duration = 1.0

def note_value(note):
  return int(note[-1]) * 12 + note_order[note[:-1]]

stft = np.abs(librosa.stft(y))

pitch_index = 0
parsed_timestamp_index = 0

for i, section in enumerate(sections):
  start = section["start"]
  end = start + section["duration"]

  s_pitches = []
  s_timestamps = []
  s_notes = set()

  for pitch_index in range(pitch_index, len(final_pitch_characteristics)):
    if final_pitch_characteristics[pitch_index][0] > end:
      break
    else:
      s_pitches.append(final_pitch_characteristics[pitch_index])
      s_notes.add(final_pitch_characteristics[pitch_index][1])

  for parsed_timestamp_index in range(parsed_timestamp_index, len(parsed_timestamps)):
    if parsed_timestamps[parsed_timestamp_index][0] > end:
      break
    else:
      s_timestamps.append(parsed_timestamps[parsed_timestamp_index])

  s_volume = np.mean([item[2] for item in s_pitches])
  s_notes_sorted = sorted(s_notes, key=note_value)
  s_meter = meter_values[i]

  ds = []

  for pitch in s_pitches:
    time, note, volume, timbre = pitch

    d = OrderedDict()
    d["section"] = i + 1
    d["time"] = time
    d["y"] = round(((s_notes_sorted.index(note) + 1) / len(s_notes_sorted)) * 100)
    d["height"] = round(width * (1 + volume / s_volume) / 2)
    d["width"] = d["height"]
    d["effect"] = []
    d["direction"] = (-1, 0)

    timbre = [x.strip() for x in timbre.split(',')]

    if timbre[0] == 'flat':
      d["sides"] = 4
      d["angle"] = 0
    elif timbre[0] == 'strong attack':
      d["sides"] = 3
      d["angle"] = 0.5
      d["direction"] = (0, -1)
    else:
      d["sides"] = 1
      d["angle"] = 0

    if 'bright' in timbre:
      d["effect"].append("GLOW")
    if 'resonant' in timbre:
      d["effect"].append("PING")

    ds.append(d)

  for timestamp in s_timestamps:
    stamp, duration = timestamp

    d = OrderedDict()
    d["section"] = i + 1
    d["time"] = stamp
    d["y"] = -1
    d["height"] = height
    d["width"] = round(height * (1 + duration / section["duration"]))
    d["effect"] = []
    d["direction"] = (-1, 0)
    d["duration"] = duration

    if duration < minimum_flat_duration:
      d["sides"] = 4
    else:
      d["sides"] = 1

    d["angle"] = 0

    ds.append(d)

  ds_sorted = sorted(ds, key=lambda d: d['time'])
  idx = 0

  while idx < len(ds_sorted):
    current = ds_sorted[idx]

    if current["y"] == -1:
      duration = current["duration"]
      copied = False

      if duration >= minimum_flat_duration:
        current["sides"] = 4
        idx2 = idx + 1

        while idx2 < len(ds_sorted):
          if ds_sorted[idx2]["time"] <= current["time"] + duration:
            if not copied:
              current["y"] = ds_sorted[idx2]["y"]
              current["height"] = ds_sorted[idx2]["height"]
              current["width"] = round(current["height"] * (1 + duration / section["duration"]))
              current["effect"] = ds_sorted[idx2]["effect"]
              copied = True

            ds_sorted.pop(idx2)
          else:
            break

      current.pop("duration")

    idx += 1

  for td in ds_sorted:
    if td["y"] == -1:
      frame = librosa.time_to_frames(td["time"], sr=sr)

      if frame < stft.shape[1]:
        mgs = stft[:, frame]
        max_bin = np.argmax(mgs)
        fr = librosa.fft_frequencies(sr=sr)[max_bin]
        n = librosa.hz_to_note(fr)
        s_notes.add(n)
        td["note"] = n

  s_notes_sorted = sorted(s_notes, key=note_value)

  for td in ds_sorted:
    if td["y"] == -1:
      td["y"] = round(((s_notes_sorted.index(td["note"]) + 1) / len(s_notes_sorted)) * 100)
      td.pop("note")

  for td in ds_sorted:
    j["data"]["notes"].append(td)

print(json.dumps(j, ensure_ascii=False, indent="\t"))

# ----- 병렬 작업 실행 -----
def run_v_music():
  """v_music.py의 메인 실행 로직"""
  # 기존 v_music 실행 로직을 호출합니다.
  audio_features, audio_analysis = init(track_id)  # 기존 track_id를 그대로 사용
  sections, segments, beats = get_sections_beats(audio_analysis)
  overall_meter, overall_tempo, mode, key = analyze_overall(audio_features)
  print("v_music 실행 완료!")

def run_v_lyrics():
  """v_lyrics.py의 메인 실행 로직"""
  # 기존 v_lyrics 실행 로직을 호출합니다.
  lyrics = parse_lyrics_file()
  generate_images_from_lyrics("SampleMusic", lyrics)
  print("v_lyrics 실행 완료!")

def main():
  """병렬로 v_music과 v_lyrics 실행"""
  music_thread = threading.Thread(target=run_v_music)
  lyrics_thread = threading.Thread(target=run_v_lyrics)

  music_thread.start()
  lyrics_thread.start()

  music_thread.join()
  lyrics_thread.join()

  print("모든 작업 완료!")

