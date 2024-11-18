## 프로젝트 소개

---------

- 프로젝트명: 모음(모두의 음악), 너의 목소리가 보여

- 서비스 특징: 청각 장애인을 위한 음악 시각화 서비스

- 주요 기능
  
  - AI를 활용한 음악 시각화
  
  - AI를 활용한 가사 시각화
  
  - 음악 추천 알고리즘
  
  - 카테고리별 음악 분류 기능
  
  - 마이 플레이리스트 생성 기능
  
  - 노래, 앨범, 아티스트 좋아요 기능

- 프로젝트의 특장점(기능 관점)
  
  - 소리를 완전히 또는 부분적으로 듣지 못하는 청각 장애인을 위해
    
    - 음악의 박자, 분위기, 음, 재상 시간 등 시각화
    
    - 생성형 AI를 통해 가사 시각화
    
    - 내 취향에 맞는 음악 맞춤 추천
  
  을 사용자 편의성을 고려한 UI, UX화 함께 지원

- 프로젝트의 차별점/독창성(기술 관점)
  
  - matter.js를 활용해 프론트엔드 상에서 Unity와 같은 물리엔진(예: RigidBody, Conllider 등) 구현
  
  - tone.js를 활용해 사용자가 커스텀 할 수 있는 EQ 기능 제공
  
  - Librosa + FastAPI를 활용해 음악 분석
  
  - MSA 도입

- 기술 스택
  
  - 백엔드
    - Java 17, Spring Boot 3. 3. 4, Python 3.10, FastAPI 0.11.0, ElasticSearch
  - 프론트엔드
    - React 18.3.1, TypeScript, Zustand, Emotion, Matter.js
  - DB
    - MariaDB, Redis, MongoDB
  - Infra
    - Ubuntu 24.04, Docker, Jenkins

## 아이디어 기획

-----

- 주제: 청각 장애인을 위한 음악 시각화 서비스

- 대상
  
  - 청각 장애인
  
  - 10~20대 트렌디한 경험을 추구하는 비장애인
  
  # MVP
  
  *(* 초록색: 차별화된 기능 / 보라색: 일반적인 기능)*
  
  ## ✅ 음악 시각화
  
  1. 음파 분석
  2. 1의 결과물을 바탕으로 음악의 악기, 볼륨, 강세, 박자 등 음악 구성 요소 수치화
  3. 2의 결과물을 단색, 그라데이션, 색상이 특정 방향으로 번지는 속도, 도형 등으로 시각화
  
  > **시각화 디자인**
  > 
  > 1. 분위기 : color (gradient)
  >    
  >    1. mode : 장/단조
  >    2. liveliness → 세 개의 property를 수치로 환산해서 표현
  >       1. danceability
  >       2. energy
  >       3. valence
  > 
  > 2. 박자 : line
  > 
  > 3. 음 : shape, 간단한 기초 도형들의 조합으로 표현 (시스템)
  >    
  >    1. key(C~B)
  >    2. volume
  >    3. *악기가 사용된 정도*
  > 
  > 4. 재생시간 : gradation
  > - 시각화 참고자료
  > 
  > <aside>
  > 
  > - [Taste Visualization for Pixar&#39;s Ratatouille (Synesthesia) - Michel Gagné - 1080P - YouTube](https://www.youtube.com/watch?v=xizttM_Cbuc)
  > - https://www.fastcompany.com/90822202/what-sound-looks-like-according-to-ai </aside>
  
  ## ✅ 가사 시각화 (On/Off 가능)
  
  1. 음악 정보 사이트에서 재생 시간에 싱크된 가사 정보 크롤링
  2. 1의 결과물을 DB에 저장
  3. 음악을 시각화한 결과물에 맞춰 비슷한 분위기로 가사를 시각화한 결과물을 합성
  
  <aside>
  
  - [The Weeknd, Ariana Grande - Die For You (Remix / Lyric Video) - YouTube](https://www.youtube.com/watch?v=YQ-qToZUybM) </aside>
  
  ## 음악 추천
  
  1. 좋아요, 1분 이상 들은 음악 기록을 바탕으로 비슷한 음파 형태의 음악 추천
  2. 비슷한 기록을 가진 사람들의 플레이리스트를 바탕으로 음악 추천
  
  ## 나만의 플레이리스트
  
  - 음악 좋아요
  - 나만의 플레이리스트 제작 및 공유
    - 공유시 시각화 결과물 스크린샷 → 대표 이미지 설정 (png로 다운로드 가능)
  
  ---
  
  # 의견
  
  - IoT 기기를 사용해서 진동으로 음악을 표현해 보자
  
  - 리액트 네이티브를 이용해서 핸드폰으로 쓸 수 있게 만들어보자
    
    - https://reactnative.dev/docs/vibration
    - 진동 패턴을 지정할 수 있음 → 반응성 테스트 필요
  
  - 추천: 머하웃 사용, 검색: 엘라스틱서치 사용 (Spark 고려)
  
  - 발표, 시연시 서비스 대상에게 공감할 수 있을 만한 방식 도입 要
  
  - 추가
    
    - 청각장애인의 연주 → 음, 박자 등이 맞는지 시각적 반응 피드백
  
  - **발표, 공감대 형성이 중요**
  
  - 음악의 작곡 배경, 설명 ⇒ AI로 스토리라인 비주얼화
    
    - 음악 그 자체에 대한 추상적인 색채 표현
    - 얽힌 이야기에 대한 짧은 영상화
      - (기존 사례) 커스텀 동화 + AI
  
  - 청각장애인을 위한 기능 강화
    
    - (예) 클래식: 음악 배경 등 설명 텍스트로 함께 제공
    - (예) 슈베르트, <마왕>: 부가적인 정보를 함께
  
  - 기술적으로 어렵다면 크롤링으로 해결# MVP
    
    *(* 초록색: 차별화된 기능 / 보라색: 일반적인 기능)*
    
    ## ✅ 음악 시각화
    
    1. 음파 분석
    2. 1의 결과물을 바탕으로 음악의 악기, 볼륨, 강세, 박자 등 음악 구성 요소 수치화
    3. 2의 결과물을 단색, 그라데이션, 색상이 특정 방향으로 번지는 속도, 도형 등으로 시각화
    
    > **시각화 디자인**
    > 
    > 1. 분위기 : color (gradient)
    >    
    >    1. mode : 장/단조
    >    2. liveliness → 세 개의 property를 수치로 환산해서 표현
    >       1. danceability
    >       2. energy
    >       3. valence
    > 
    > 2. 박자 : line
    > 
    > 3. 음 : shape, 간단한 기초 도형들의 조합으로 표현 (시스템)
    >    
    >    1. key(C~B)
    >    2. volume
    >    3. *악기가 사용된 정도*
    > 
    > 4. 재생시간 : gradation
    > - 시각화 참고자료
    > 
    > <aside>
    > 
    > - [Taste Visualization for Pixar&#39;s Ratatouille (Synesthesia) - Michel Gagné - 1080P - YouTube](https://www.youtube.com/watch?v=xizttM_Cbuc)
    > - https://www.fastcompany.com/90822202/what-sound-looks-like-according-to-ai </aside>
    
    ## ✅ 가사 시각화 (On/Off 가능)
    
    1. 음악 정보 사이트에서 재생 시간에 싱크된 가사 정보 크롤링
    2. 1의 결과물을 DB에 저장
    3. 음악을 시각화한 결과물에 맞춰 비슷한 분위기로 가사를 시각화한 결과물을 합성
    
    <aside>
    
    - [The Weeknd, Ariana Grande - Die For You (Remix / Lyric Video) - YouTube](https://www.youtube.com/watch?v=YQ-qToZUybM) </aside>
    
    ## 음악 추천
    
    1. 좋아요, 1분 이상 들은 음악 기록을 바탕으로 비슷한 음파 형태의 음악 추천
    2. 비슷한 기록을 가진 사람들의 플레이리스트를 바탕으로 음악 추천
    
    ## 나만의 플레이리스트
    
    - 음악 좋아요
    - 나만의 플레이리스트 제작 및 공유
      - 공유시 시각화 결과물 스크린샷 → 대표 이미지 설정 (png로 다운로드 가능)

## 시각화 시 고려 사항

- 색채 심리학 기반의 개인화 색상 질문 리스트
  
  - ### **1. 오늘의 기분을 가장 잘 표현하는 단어를 선택해 주세요.**
    
    - 차분함 / 활기참 / 슬픔 / 설렘 / 긴장
    
    **의도:** 사용자의 현재 감정 상태를 반영한 색상 추천 (예: 차분함 → 파란색 계열).
  
  - ### **2. 특정 환경이 주는 느낌 중 어느 쪽이 더 마음에 드시나요?**
    
    - 숲속의 고요함
    - 해변의 자유로움
    - 도시의 활기찬 에너지
    - 산의 웅장함
    
    **의도:** 사용자가 선호하는 환경의 색상과 분위기(자연 계열 vs. 인공적인 컬러)를 반영합니다.
  
  - ### **3. 하루 중 가장 좋아하는 시간은 언제인가요?**
    
    - 새벽 / 아침 / 오후 / 저녁 / 밤
    
    **의도:** 각 시간대가 주는 색감을 반영합니다 (예: 새벽 → 부드러운 파스텔, 저녁 → 따뜻한 오렌지 톤).
  
  - ### **4. 색상을 통해 어떤 느낌을 전달하고 싶으신가요?**
    
    - 안정감 / 활력 / 창의성 / 집중력 / 따뜻함
    
    **의도:** 사용자의 목표(예: 집중력 향상)와 관련된 색상 팔레트를 추천합니다 (예: 집중 → 녹색 계열).
  
  - ### **5. 평소에 좋아하는 색상은 무엇인가요?**
    
    - 파랑 / 빨강 / 노랑 / 초록 / 보라 / 기타
    
    **의도:** 사용자가 선호하는 색상을 기반으로 비슷한 색조나 보색을 추천합니다.
  
  - ### **6. 특정한 기분이 들 때 피하고 싶은 색상이 있나요?**
    
    - 예: 빨강(스트레스) / 검정(우울함) / 노랑(불안) / 없음
    
    **의도:** 부정적인 감정을 유발하는 색상을 배제하고 추천합니다.
  
  - ### **7. 특정 음악을 들을 때 어떤 색상이 떠오르나요?**
    
    - 예: 잔잔한 클래식 → 파스텔 계열 / 신나는 팝 → 강렬한 네온 색상
    
    **의도:** 음악과 시각화의 색상을 일치시켜 감각적 경험을 향상합니다.
  
  - ### **8. 특정 색상이 떠오르는 추억이 있나요?**
    
    - 예: 어린 시절의 노란 장난감 / 여행에서 본 바다의 파란색
    
    **의도:** 감정적으로 연결된 색상을 반영하여 더욱 의미 있는 팔레트를 추천합니다.
  
  - ### **9. 현재 앱을 사용할 때 가장 원하는 효과는 무엇인가요?**
    
    - 편안한 기분 / 에너지 충전 / 창의적 영감 / 집중력 향상 / 감성적 만족
    
    **의도:** 사용자의 목표에 부합하는 색상(예: 편안함 → 파란색 계열, 창의성 → 보라색)을 추천합니다.
  
  - ### **10. 시각적 자극이 강한 색상을 선호하시나요, 부드러운 색상을 선호하시나요?**
    
    - 강한 자극 (네온, 비비드) / 부드러운 자극 (파스텔, 모노톤) / 상관없음
    
    **의도:** 사용자가 선호하는 색조의 강도에 맞춘 팔레트를 제공합니다.
  
  이 10가지 질문들은 사용자가 색상과 감정의 관계를 심리학적으로 탐구할 수 있도록 유도하며, 색상 팔레트 설정 과정을 더욱 의미 있고 개인화된 경험으로 만듭니다.

- 시각적 디스플레이를 만들 때 고려 요소들
  
  1. 음표의 시작 (Note onset):
     - Librosa (Python): librosa.onset.onset_detect()
     - Essentia (C++/Python): OnsetDetection 알고리즘
  2. 음의 길이 (Note duration):
     - Pretty_midi (Python): note.end - note.start
     - JFugue (Java): Note 객체의 getDuration() 메소드
  3. 음높이 (Pitch):
     - Librosa (Python): librosa.yin() 또는 librosa.pyin()
     - TarsosDSP (Java): PitchDetector 인터페이스
  4. 음량 (Loudness):
     - Librosa (Python): librosa.feature.rms()
     - TarsosDSP (Java): AmplitudeFollower 클래스
  5. 악기 종류 (Instrument type):
     - TensorFlow (Python): 사용자 정의 CNN 모델
     - OpenL3 (Python): 오디오 임베딩 추출 후 분류
  6. 조성 변화 (Key changes):
     - Librosa (Python): librosa.feature.tonnetz()
     - Essentia (C++/Python): KeyExtractor 알고리즘
  7. 리듬 (Rhythm):
     - Librosa (Python): librosa.feature.tempogram()
     - jAudio (Java): BeatHistogramFeature 클래스
  8. 화성 (Harmony):
     - Librosa (Python): librosa.feature.chroma_stft()
     - TarsosDSP (Java): ConstantQ 변환 후 처리
  9. 음색 (Timbre):
     - Librosa (Python): librosa.feature.mfcc()
     - Essentia (C++/Python): MFCC 알고리즘
  10. 템포 (Tempo):
      - Librosa (Python): librosa.beat.tempo()
      - BeatRoot (Java): Agent 클래스
  11. 음악의 구조 (Musical structure):
      - MSAF (Python): 다양한 세그멘테이션 알고리즘 제공
      - Essentia (C++/Python): MusicExtractor 클래스
  12. 감정 (Emotion):
      - Keras/TensorFlow (Python): 사용자 정의 LSTM 모델
      - OpenSmile (C++/Python): 감정 관련 특성 추출
  
  시각화 시 고려해야 할 점들:
  
  1. 단순성: 너무 복잡하지 않게 만들어 이해하기 쉽도록 함
  2. 일관성: 같은 음악 요소는 항상 같은 방식으로 표현
  3. 실시간 반응: 음악과 동기화되어 실시간으로 변화하도록 함
  4. 개인화: 사용자가 원하는 대로 시각 효과를 조절할 수 있게 함
  5. 문화적 맥락: 색상이나 형태의 문화적 의미를 고려
  6. 화면 크기와 해상도: 다양한 기기에서 잘 보이도록 설계
  7. 시각적 피로도: 장시간 보아도 눈의 피로가 적도록 설계
  8. 청각장애 정도: 사용자의 청각장애 정도에 따라 조절 가능하게 함
  9. 학습 곡선: 처음 사용하는 사람도 쉽게 이해할 수 있도록 직관적으로 설계
  10. 예술성: 단순한 정보 전달을 넘어 심미적 만족을 줄 수 있도록 함

## 관련 논문 정리

[p_nanayakkara_2013_2.pdf](https://prod-files-secure.s3.us-west-2.amazonaws.com/24674912-6290-4358-94bd-a0518db2c00b/09395d5e-eb4a-44f7-bc77-68059c0d9cd7/p_nanayakkara_2013_2.pdf)

![논문1](C:\Users\SSAFY\Desktop\1119\misc\images\thesis1.png)

<img title="" src="file:///C:/Users/SSAFY/Desktop/1119/misc/images/thesis2.png" alt="논문2" width="372">

<img title="" src="file:///C:/Users/SSAFY/Desktop/1119/misc/images/thesis3.png" alt="논문3" width="309">

## 목업

![mockup](C:\Users\SSAFY\Desktop\1119\misc\images\mockup.png)

## ERD

![erd](C:\Users\SSAFY\Desktop\1119\misc\images\erd.png)

## 요구사항 명세서 (유즈 케이스)

[Notion – Use Case](https://www.notion.so/341064e1d74c4d9cbd39d698f37916ef)

## API 명세서

[Notion – API 명세서](https://www.notion.so/API-abe308c4ddd042d5925242acf4daae0d)

## 데이터 분석

![music](C:\Users\SSAFY\Desktop\1119\misc\images\music.PNG)

![beat](C:\Users\SSAFY\Desktop\1119\misc\images\beat.PNG)

![beat_num](C:\Users\SSAFY\Desktop\1119\misc\images\beat_num.PNG)

![mode](C:\Users\SSAFY\Desktop\1119\misc\images\mod.PNG)

![pitich](C:\Users\SSAFY\Desktop\1119\misc\images\pitch.PNG)

<img title="" src="file:///C:/Users/SSAFY/Desktop/1119/misc/images/shape.PNG" alt="shape" width="671">

## 팀 소개

- 민서령: 팀장/기획/백엔드 코드 리뷰 진행, 백엔드 개발, ERD작성, API 명세서 작성, AI 음악 시각화

- 서장원: 부팀장/백엔드 팀장, ERD 작성, API 명세서 작성, 추천 알고리즘 구현

- 박병우: QA 엔지니어, ERD 작성, API 명세서 작성, AI 가사 시각화

- 김재혁: 프론트엔드 팀장

- 김시현: 프로젝트 매니저/프론트엔드 코드 리뷰 진행

- 최진오: DevOps 엔지니어/디자인 리더

### 메인 페이지

![메인 페이지](C:\Users\SSAFY\Desktop\1119\misc\images\main.png)

### Login 페이지

![login](C:\Users\SSAFY\Desktop\1119\misc\images\login.png)

### Calibration 페이지

![calibration](C:\Users\SSAFY\Desktop\1119\misc\images\calibration.png)

### Playlist 페이지

![playlist](C:\Users\SSAFY\Desktop\1119\misc\images\playlist.png)
