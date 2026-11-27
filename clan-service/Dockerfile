# Этап 1: Сборка и распаковка слоев
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /build

# 1. Копируем общие файлы сборщика из корня
COPY gradlew .
COPY gradle ./gradle
COPY settings.gradle .
COPY build.gradle .

# Сначала копируем общий модуль контрактов и сам сервис
COPY proto-contracts/build.gradle ./proto-contracts/
COPY proto-contracts/src ./proto-contracts/src

# 2. Копируем конфигурацию и исходный код именно clan-service
COPY clan-service/build.gradle ./clan-service/
COPY clan-service/src ./clan-service/src

# 3. Собираем только user-service
RUN ./gradlew :clan-service:clean :clan-service:build -x test --no-daemon

# 4. Распаковываем JAR на слои через layertools
WORKDIR /build/clan-service/build/libs
RUN java -Djarmode=layertools -jar *[!plain].jar extract

# Этап 2: Финальный легковесный Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /build/clan-service/build/libs/dependencies/ ./
COPY --from=builder /build/clan-service/build/libs/spring-boot-loader/ ./
COPY --from=builder /build/clan-service/build/libs/snapshot-dependencies/ ./
COPY --from=builder /build/clan-service/build/libs/application/ ./

EXPOSE 8084
EXPOSE 9094

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]