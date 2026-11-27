package com.squad.event.grpcs;

import com.squad.event.grpc.*;

import com.google.protobuf.Timestamp;
import com.squad.event.model.domain.Event;
import com.squad.event.model.domain.TimelineEvent;
import com.squad.event.model.dto.CreateEventHttpRequest;
import com.squad.event.model.dto.JoinEventHttpRequest;
import com.squad.event.model.dto.MapVoteHttpRequest;
import com.squad.event.model.dto.UpdateSideReadyHttpRequest;
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

        CreateEventHttpRequest externalRequest = new CreateEventHttpRequest(
                request.getName(),
                UUID.fromString(request.getCreatorUserId()),
                UUID.fromString(request.getSecondLeaderId()),
                request.getTargetGameCount(),
                Instant.ofEpochSecond(request.getTimeStart().getSeconds(), request.getTimeStart().getNanos()),
                EventGameMode.valueOf(request.getGameMode().toString()),
                request.getCreatorSideName(),
                request.getEnemySideName()
        );

        UUID eventId = eventService.createEvent(externalRequest);

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

        JoinEventHttpRequest externalRequest = new JoinEventHttpRequest(
                UUID.fromString(request.getUserId()),
                UUID.fromString(request.getEventId()),
                UUID.fromString(request.getSideId())
        );

        UUID eventParticipantId = eventService.joinEvent(externalRequest);

        JoinEventResponse response = JoinEventResponse.newBuilder()
                .setEventParticipantId(eventParticipantId.toString())
                .build();
        responseStreamObserver.onNext(response);
        responseStreamObserver.onCompleted();

        log.info("gRPC joinEvent request from user {} to event {} is processed",
                request.getUserId(), request.getEventId());
    }

    @Override
    public void updateSideReady(UpdateSideReadyRequest request, StreamObserver<UpdateSideReadyResponse> responseStreamObserver) {
        log.info("Starting to process gRPC setSideReady request: event {}, side {}, user {}",
        request.getEventId(), request.getSideId(), request.getUserId());

        UpdateSideReadyHttpRequest externalRequest = new UpdateSideReadyHttpRequest(
                UUID.fromString(request.getEventId()),
                UUID.fromString(request.getSideId()),
                UUID.fromString(request.getUserId()),
                request.getIsReady()
        );

        eventService.setSideReady(externalRequest);
        UpdateSideReadyResponse response = UpdateSideReadyResponse.newBuilder()
                .setMessage("Side ready status updated to " + request.getIsReady())
                .build();

        responseStreamObserver.onNext(response);
        responseStreamObserver.onCompleted();

        log.info("gRPC setSideReady request from user {} to event {} is processed",
                request.getUserId(), request.getEventId());
    }

    @Override
    public void mapVote(MapVoteRequest request, StreamObserver<MapVoteResponse> responseStreamObserver) {
        log.info("Starting to process gRPC mapVote request from user {}, to match {}, vote layer {}",
                request.getUserId(), request.getMatchId(), request.getLayer());

        MapVoteHttpRequest externalRequest = new MapVoteHttpRequest(
                UUID.fromString(request.getEventId()),
                UUID.fromString(request.getMatchId()),
                UUID.fromString(request.getUserId()),
                request.getLayer()
        );

        eventService.mapVote(externalRequest);

        MapVoteResponse response = MapVoteResponse.newBuilder()
                .setMessage("Map vote is processed")
                .build();

        responseStreamObserver.onNext(response);
        responseStreamObserver.onCompleted();

        log.info("gRPC mapVote request from user {} to match {}, layer {} is processed",
                request.getUserId(), request.getMatchId(), request.getLayer());
    }

    @Override
    public void getMatchTimeline(
            GetMatchTimelineRequest request,
            StreamObserver<GetMatchTimelineResponse> responseStreamObserver) {

        log.info("Starting to process gRPC getMatchTimeline for event {}, match {}}",
                request.getEventId(), request.getMatchId());

        List<TimelineEvent> timelineEvents = eventService.getMatchTimelineHistory(
                UUID.fromString(request.getEventId()),
                UUID.fromString(request.getMatchId())
        );

        List<com.squad.event.grpc.TimelineEvent> grpcEvents = timelineEvents.stream()
                .map(streamManager::mapToProto)
                .toList();

        GetMatchTimelineResponse response = GetMatchTimelineResponse.newBuilder()
                .addAllTimelineEvents(grpcEvents)
                .build();

        responseStreamObserver.onNext(response);
        responseStreamObserver.onCompleted();

        log.info("gRPC getMatchTimeline request to event {}, match {} is processed",
                request.getEventId(), request.getMatchId());
    }

    @Override
    public void streamMatchTimeline(
            StreamMatchTimelineRequest request,
            StreamObserver<StreamMatchTimelineResponse> streamObserver) {
        log.info("Starting to stream match timeline on event {}", request.getEventId());
        streamManager.registerGatewayObserver(UUID.fromString(request.getEventId()), streamObserver);
    }

    @Override
    public void getEventById(GetEventByIdRequest request, StreamObserver<GetEventByIdResponse> streamObserver) {
        log.info("Starting to process gRPC getEventById request");

        Event event = eventService.getEventById(UUID.fromString(request.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Event with id " + request.getId() + " not found"));

        EventDto eventDto = toEventDto(event);

        GetEventByIdResponse response = GetEventByIdResponse.newBuilder()
                .setEvent(eventDto)
                .build();

        streamObserver.onNext(response);
        streamObserver.onCompleted();

        log.info("gRPC getEventById request is processed");
    }

    @Override
    public void getAllByStatus(
            GetAllByStatusRequest request,
            StreamObserver<GetAllByStatusResponse> streamObserver) {

        log.info("Starting to process gRPC getAllByStatus request");

        Page<Event> eventPage = eventService.getAllEventsByStatus(
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

        streamObserver.onNext(response);
        streamObserver.onCompleted();

        log.info("gRPC getAllByStatus request is processed");
    }


    // mapping to gRPC event object
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
