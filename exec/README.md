# 포팅 매뉴얼

## 빌드 및 배포 정보

1. 사용한 JVM, 웹 서버, WAS 제품
   - JVM: Liberica OpenJDK 17
   - WAS: Spring Boot 내장 Tomcat
   - 웹 서버: AWS EC2, nginx
   - IDE: Visual Studio Code, IntelliJ IDEA Ultimate 2024.2
2. 빌드 시 사용되는 환경 변수
   - 프론트엔드: .env 파일 참조
   - 백엔드: application-secret.yml 파일 참조
3. 주요 계정 및 프로퍼티
   - 서비스 테스트 계정
     - user: noreply.moeum@gmail.com
     - password: !admin123
   - Jenkins:
     - user: moeum
     - password: ahdma123
   - DB
     - user: root
     - password: admin123

## 외부 서비스 가입 및 활용 정보

- Spotify API
  - client_id: 372d841a811545ffb7354cea56cdb9e8
  - client_secret: 76220c93e48443ca927e1b469af1e968

## 시연 시나리오

1. 상단 메뉴 우측 로그인 버튼 클릭
2. 하단 회원 가입 버튼 클릭
3. 로그인 후 메인 화면
4. 홈 화면에서 최신곡 전체 보기
5. 홈 화면에서 플레이리스트에 곡 추가
6. 홈 화면에서 플레이리스트 클릭 -> 플레이리스트 상세 보기 페이지 진입
7. 검색창에 'want' 입력
8. 노래 더보기 버튼 클릭
9. 검색창에 'all i want' 입력
10. 'All I Want For Christmas is You' 클릭
11. 음악 재생 -> 시각화 감상
