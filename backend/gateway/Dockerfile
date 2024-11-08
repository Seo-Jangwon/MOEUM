FROM eclipse-temurin:17-jre-alpine
COPY ./build/libs/*.jar app.jar
ENV TZ=Asia/Seoul
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "/app.jar"]