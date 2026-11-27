# Этап 1: Сборка и распаковка слоев
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /build

# Копируем только файлы конфигурации Gradle для кэширования зависимостей
COPY gradlew .
COPY gradle ./gradle
COPY settings.gradle .
COPY build.gradle .

# Сначала копируем общий модуль контрактов и сам сервис
COPY proto-contracts/build.gradle ./proto-contracts/
COPY proto-contracts/src ./proto-contracts/src

# Копируем исходный код и собираем проект
COPY gateway/build.gradle ./gateway/
COPY gateway/src ./gateway/src

RUN ./gradlew :gateway:clean :gateway:build -x test --no-daemon

# 4. Переходим в папку с собранным артефактом и распаковываем JAR на слои
WORKDIR /build/gateway/build/libs
RUN java -Djarmode=layertools -jar *.jar extract

# Этап 2: Легковесный Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Создаем пользователя без root-прав для безопасности
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Копируем слои из папки сборки конкретного модуля
COPY --from=builder /build/gateway/build/libs/dependencies/ ./
COPY --from=builder /build/gateway/build/libs/spring-boot-loader/ ./
COPY --from=builder /build/gateway/build/libs/snapshot-dependencies/ ./
COPY --from=builder /build/gateway/build/libs/application/ ./

EXPOSE 8080
EXPOSE 9090

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]