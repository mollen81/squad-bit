package com.squad.event.grpcs;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.protobuf.Timestamp;
import com.squad.event.grpc.StreamMatchTimelineResponse;
import com.squad.event.grpc.TimelineEvent;
import io.grpc.stub.ServerCallStreamObserver;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
@RequiredArgsConstructor
public class GrpcTimelineStreamManager {
    private final Map<UUID, List<StreamObserver<StreamMatchTimelineResponse>>> observersByEvent = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;


    public void registerGatewayObserver(UUID eventId, StreamObserver<StreamMatchTimelineResponse> streamObserver) {


        List<StreamObserver<StreamMatchTimelineResponse>> eventObservers = observersByEvent.computeIfAbsent(
                eventId, k -> new CopyOnWriteArrayList<>());
        eventObservers.add(streamObserver);

        if(streamObserver instanceof ServerCallStreamObserver<StreamMatchTimelineResponse> serverObserver) {
            serverObserver.setOnCancelHandler(() -> {
                log.info("gRPC stream canceled by gateway for event {}", eventId);
                removeObserver(eventId, streamObserver);
            });
        }

        log.info("Registered gRPC timeline stream for event {}. Active streams: {}", eventId, eventObservers.size());
    }


    public void broadcastTimelineEvent(UUID eventId, com.squad.event.model.domain.TimelineEvent timelineEvent) {
        List<StreamObserver<StreamMatchTimelineResponse>> eventObservers = observersByEvent.get(eventId);
        if(eventObservers == null || eventObservers.isEmpty()) {
            return;
        }

        StreamMatchTimelineResponse grpcMessage = StreamMatchTimelineResponse.newBuilder()
                .setTimelineEvent(mapToProto(timelineEvent))
                .build();

        for(StreamObserver<StreamMatchTimelineResponse> observer : eventObservers) {
            try {
                synchronized (observer) {
                    observer.onNext(grpcMessage);
                }
            }
            catch (Exception e) {
                log.warn("Failed to send timeline event to gRPC stream for event {}. Removing observer.", eventId);
                removeObserver(eventId, observer);
            }
        }
    }


    public void completeStreamsForEvent(UUID eventId) {
        List<StreamObserver<StreamMatchTimelineResponse>> eventObservers = observersByEvent.get(eventId);
        if(eventObservers == null) {
            return;
        }

        for(StreamObserver<StreamMatchTimelineResponse> observer : eventObservers) {
            try {
                synchronized (observer) {
                    observer.onCompleted();
                }
            }
            catch (Exception ignored) {}
        }

        log.info("Closed all gRPC timeline streams for finished event {}", eventId);
    }


    private void removeObserver(UUID eventId, StreamObserver<StreamMatchTimelineResponse> observer) {
        List<StreamObserver<StreamMatchTimelineResponse>> observers = observersByEvent.get(eventId);
        if(observers != null) {
            observers.remove(observer);
            if(observers.isEmpty()) {
                observersByEvent.remove(eventId);
            }
        }
    }


    public TimelineEvent mapToProto(com.squad.event.model.domain.TimelineEvent event) {
        String payloadJson = "{}";

        try {
            payloadJson = objectMapper.writeValueAsString(event.getPayload());
        }
        catch (JsonProcessingException e) {
            log.error("Failed to serialize timeline payload for entry {}", event.getId(), e);
        }

        return TimelineEvent.newBuilder()
                    .setId(event.getId().toString())
                    .setMatchId(event.getMatchId().toString())
                    .setTimelineEventType(event.getTimelineEventType().toString())
                    .setGameTimeSeconds(event.getGameTimeSeconds())
                    .setPayload(event.getPayload().toString())
                    .setCreatedAt(event.getCreatedAt().toEpochMilli())
                    .build();
    }
}
