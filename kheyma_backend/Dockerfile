# المرحلة الأولى: بناء المشروع
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
ARG SERVICE_NAME
RUN mvn clean package -DskipTests -f pom.xml

# المرحلة الثانية: تشغيل التطبيق
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
ARG SERVICE_NAME
COPY --from=build /app/target/${SERVICE_NAME}.jar app.jar
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=docker
ENTRYPOINT ["java","-jar","app.jar"]
