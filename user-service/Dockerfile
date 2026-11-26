# Этап 1: Сборка и распаковка слоев
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /build

COPY gradlew .
COPY gradle ./gradle
COPY settings.gradle .
COPY build.gradle .

# Сначала копируем общий модуль контрактов и сам сервис
COPY proto-contracts/build.gradle ./proto-contracts/
COPY proto-contracts/src ./proto-contracts/src

COPY user-service/build.gradle ./user-service/
COPY user-service/src ./user-service/src

# И только затем запускаем сборку Gradle
RUN ./gradlew :user-service:clean :user-service:build -x test --no-daemon

# 4. Распаковываем JAR на слои через layertools
WORKDIR /build/user-service/build/libs
RUN java -Djarmode=layertools -jar *.jar extract