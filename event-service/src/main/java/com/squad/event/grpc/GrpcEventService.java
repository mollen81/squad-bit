package com.squad.event.grpc;

import com.google.protobuf.Empty;
import com.google.protobuf.Timestamp;
import com.squad.event.model.domain.Event;
import com.squad.event.model.domain.TimelineEvent;
import com.squad.event.model.enums.EventGameMode;
import com.squad.event.model.enums.EventStatus;
import com.squad.event.service.EventService;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@GrpcService
@RequiredArgsConstructor
@Slf4j
public class GrpcEventService extends EventServiceGrpc.EventServiceImplBase {
    private final EventService eventService;
    private final GrpcTimelineStreamManager streamManager;

    @Override
    public void createEvent(CreateEventRequest request, StreamObserver<CreateEventResponse> responseStreamObserver) {
        log.info("Starting to process gRPC createEvent request from user {}", request.getCreatorUserId());

        com.squad.event.model.dto.CreateEventRequest createEventRequest = new com.squad.event.model.dto.CreateEventRequest(
                request.getName(),
                UUID.fromString(request.getCreatorUserId()),
                UUID.fromString(request.getSecondLeaderId()),
                request.getTargetGameCount(),
                Instant.ofEpochSecond(request.getTimeStart().getSeconds(), request.getTimeStart().getNanos()),
                EventGameMode.valueOf(request.getGameMode().toString()),
                request.getCreatorSideName(),
                request.getEnemySideName()
        );

        UUID eventId = eventService.createEvent(createEventRequest);

        CreateEventResponse response = CreateEventResponse.newBuilder()
                .setEventId(eventId.toString())
                .build();
        responseStreamObserver.onNext(response);
        responseStreamObserver.onCompleted();

        log.info("gRPC createEvent request from user {} is processed. Event {} created",
                request.getCreatorUserId(), eventId.toString());
    }

    @Override
    public void joinEvent(JoinEventRequest request, StreamObserver<JoinEventResponse> responseStreamObserver) {
        log.info("Starting to process gRPC joinEvent request from user {} to event {}",
                request.getUserId(), request.getEventId());

        com.squad.event.model.dto.JoinEventRequest joinEventRequest = new com.squad.event.model.dto.JoinEventRequest(
                UUID.fromString(request.getUserId()),
                UUID.fromString(request.getEventId()),
                UUID.fromString(request.getSideId())
        );

        UUID eventParticipantId = eventService.joinEvent(joinEventRequest);

        JoinEventResponse response = JoinEventResponse.newBuilder()
                .setEventParticipantId(eventParticipantId.toString())
                .build();
        responseStreamObserver.onNext(response);
        responseStreamObserver.onCompleted();

        log.info("gRPC joinEvent request from user {} to event {} is processed",
                request.getUserId(), request.getEventId());
    }

    @Override
    public void setSideReady(SetSideReadyRequest request, StreamObserver<Empty> responseStreamObserver) {
        log.info("Starting to process gRPC setSideReady request from user {} to event {}",
        request.getUserId(), request.getEventId());

        eventService.setSideReady(UUID.fromString(request.getEventId()), UUID.fromString(request.getUserId()));

        responseStreamObserver.onNext(Empty.getDefaultInstance());
        responseStreamObserver.onCompleted();

        log.info("gRPC setSideReady request from user {} to event {} is processed",
                request.getUserId(), request.getEventId());
    }

    @Override
    public void mapVote(MapVoteRequest request, StreamObserver<Empty> responseStreamObserver) {
        log.info("Starting to process gRPC mapVote request from user {}, to match {}, vote layer {}",
                request.getUserId(), request.getMatchId(), request.getLayer());

        eventService.mapVote(
                UUID.fromString(request.getMatchId()),
                UUID.fromString(request.getUserId()),
                request.getLayer());

        responseStreamObserver.onNext(Empty.getDefaultInstance());
        responseStreamObserver.onCompleted();

        log.info("gRPC mapVote request from user {} to match {}, layer {} is processed",
                request.getUserId(), request.getMatchId(), request.getLayer());
    }

    @Override
    public void getMatchTimeline(
            GetMatchTimelineRequest request,
            StreamObserver<GetMatchTimelineResponse> responseStreamObserver) {

        log.info("Starting to process gRPC getMatchTimeline for event {}, match #{}",
                request.getEventId(), request.getMatchSequenceNumber());

        List<TimelineEvent> timelineEvents = eventService.getMatchTimelineHistory(
                UUID.fromString(request.getEventId()),
                request.getMatchSequenceNumber());

        List<com.squad.event.grpc.TimelineEvent> grpcEvents = timelineEvents.stream()
                .map(streamManager::mapToProto)
                .toList();

        GetMatchTimelineResponse response = GetMatchTimelineResponse.newBuilder()
                .addAllTimelineMatchEvents(grpcEvents)
                .build();

        responseStreamObserver.onNext(response);
        responseStreamObserver.onCompleted();

        log.info("gRPC getMatchTimeline request to event {}, match #{} is processed",
                request.getEventId(), request.getMatchSequenceNumber());
    }

    @Override
    public void streamMatchTimeline(
            StreamMatchTimelineRequest request,
            StreamObserver<com.squad.event.grpc.TimelineEvent> responseStreamObserver) {
        log.info("Starting to stream match timeline on event {}", request.getEventId());
        streamManager.registerGatewayObserver(UUID.fromString(request.getEventId()), responseStreamObserver);
    }

    @Override
    public void getAllByStatus(
            GetAllByStatusRequest request,
            StreamObserver<GetAllByStatusResponse> streamObserver) {

        log.info("Starting to process gRPC getAllByStatus request");

        Page<Event> eventPage = eventService.findAllByStatus(
                EventStatus.valueOf(request.getStatus()),
                PageRequest.of(request.getPage(), request.getRpp(), Sort.Direction.fromString(request.getSortDir())));

        List<EventDto> eventDtos = eventPage.getContent().stream()
                .map(this::toEventDto)
                .toList();

        PageInfo pageInfo = PageInfo.newBuilder()
                .setCurrentPage(eventPage.getNumber())
                .setRpp(eventPage.getNumber())
                .setTotalElements(eventPage.getTotalElements())
                .setTotalPages(eventPage.getTotalPages())
                .setHasNext(eventPage.hasNext())
                .setHasPrevious(eventPage.hasPrevious())
                .build();

        GetAllByStatusResponse response = GetAllByStatusResponse.newBuilder()
                .addAllEvents(eventDtos)
                .setPageInfo(pageInfo)
                .build();

        log.info("gRPC getAllByStatus request is processed");
    }


    public EventDto toEventDto(Event event) {
        EventDto.Builder builder = EventDto.newBuilder()
                .setId(event.getId().toString())
                .setCreatorUserId(event.getCreatorUserId().toString())
                .setTargetGameCount(event.getTargetGameCount())
                .setStatus(com.squad.event.grpc.EventStatus.valueOf(event.getStatus().name()))
                .setGameMode(com.squad.event.grpc.EventGameMode.valueOf(event.getGameMode().name()));

        if (event.getName() != null) {
            builder.setName(event.getName());
        }
        if (event.getTimeStart() != null) {
            builder.setTimeStart(toProtoTimestamp(event.getTimeStart()));
        }
        if (event.getCreatedAt() != null) {
            builder.setCreatedAt(toProtoTimestamp(event.getCreatedAt()));
        }
        if (event.getUpdatedAt() != null) {
            builder.setUpdatedAt(toProtoTimestamp(event.getUpdatedAt()));
        }

        return builder.build();
    }

    private Timestamp toProtoTimestamp(Instant instant) {
        return Timestamp.newBuilder()
                .setSeconds(instant.getEpochSecond())
                .setNanos(instant.getNano())
                .build();
    }
}
