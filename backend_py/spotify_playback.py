from elasticsearch import Elasticsearch
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Elasticsearch 및 Spotify 설정
es = Elasticsearch()

# Spotify API 인증 정보 설정
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    redirect_uri="http://localhost:8080",
    scope="user-modify-playback-state user-read-playback-state"
))

# Spotify 활성 기기 확인 및 선택
devices = sp.devices()
device_id = None

if devices['devices']:
    device_id = devices['devices'][0]['id']
    print("Device found:", devices['devices'][0]['name'])
else:
    print("No active devices found. Please start Spotify on a device and try again.")
    exit()

# Elasticsearch에서 여러 필드를 검색하고 페이징 기능 추가
def search_track_in_elasticsearch(query, page=0):
    """Elasticsearch에서 여러 필드로 검색하고, 페이징을 통해 10개씩 결과 반환"""
    body = {
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["music_name", "album_name", "artist_name", "playlist_name"]
            }
        },
        "from": page * 10,  # 페이지에 따른 시작 위치 설정
        "size": 10           # 한 번에 10개의 결과만 가져옴
    }
    res = es.search(index="tracks", body=body)
    tracks = res['hits']['hits']
    
    if tracks:
        print("Search results:")
        for idx, track in enumerate(tracks, start=1 + page * 10):
            track_info = track['_source']
            print(f"{idx}. {track_info['music_name']} by {track_info['artist_name']}")
        
        # 사용자로부터 재생할 트랙 선택 받기
        choice = input("Enter the track number to play, 'm' to load more results, or '0' to cancel: ").strip()
        if choice.isdigit():
            choice = int(choice)
            if 1 <= choice <= len(tracks) + page * 10:
                return tracks[choice - 1 - page * 10]['_source']['track_uri']  # 선택된 트랙의 URI 반환
            elif choice == 0:
                print("Cancelled.")
                return None
        elif choice.lower() == 'm':
            return 'more'  # "더보기"를 위한 키워드 반환
        else:
            print("Invalid choice.")
            return None
    else:
        print("No matching track found in Elasticsearch.")
        return None

# Spotify에서 track_uri로 재생
def start_playback(track_uri):
    """지정된 트랙을 재생 시작."""
    if device_id and track_uri:
        sp.start_playback(device_id=device_id, uris=[track_uri])
        print("Playback started on device:", device_id)
    else:
        print("No device available for playback or track not found.")

# 재생/일시정지 토글
def toggle_playback():
    """재생/일시정지를 토글."""
    current_playback = sp.current_playback()
    if current_playback and current_playback['is_playing']:
        sp.pause_playback(device_id=device_id)
        print("Playback paused.")
    else:
        sp.start_playback(device_id=device_id)
        print("Playback resumed.")

# 재생 중지
def stop_playback():
    """재생을 중지."""
    sp.pause_playback(device_id=device_id)
    print("Playback stopped.")

# 전체 실행 흐름
if __name__ == "__main__":
    # 사용자로부터 검색어 입력 받기
    search_query = input("Enter song, album, artist, or playlist name to play: ").strip()
    page = 0
    while True:
        track_uri = search_track_in_elasticsearch(search_query, page)
        
        if track_uri == 'more':
            # "더보기" 요청 시 다음 페이지를 가져옴
            page += 1
        elif track_uri:
            # 선택된 track_uri로 재생 시작
            start_playback(track_uri)
            break
        else:
            break  # 취소 또는 잘못된 입력 시 종료

    # 사용자 입력을 통해 재생/일시정지 제어
    while True:
        command = input("Enter 'p' to toggle play/pause, 'q' to quit: ").strip().lower()
        if command == 'p':
            toggle_playback()
        elif command == 'q':
            stop_playback()  # 재생 중지
            print("Exiting...")
            break
        else:
            print("Invalid command. Enter 'p' to play/pause or 'q' to quit.")
