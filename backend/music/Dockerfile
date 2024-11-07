FROM gradle:8.10-jdk17-alpine AS builder
WORKDIR /app
COPY . .
RUN gradle --no-daemon -x test build

FROM eclipse-temurin:17-jre-alpine
COPY --from=builder app/build/libs/*.jar app.jar
ENV TZ=Asia/Seoul
ENTRYPOINT ["java","-jar","/app.jar"]