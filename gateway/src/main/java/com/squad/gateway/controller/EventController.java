package com.squad.gateway.controller;

import com.squad.event.grpc.GetAllByStatusRequest;
import com.squad.event.grpc.GetAllByStatusResponse;
import com.squad.event.grpc.GetEventByIdResponse;
import com.squad.gateway.model.dto.request.*;
import com.squad.gateway.model.dto.response.TimelineEventHttpResponse;
import com.squad.gateway.security.UserPrincipal;
import com.squad.gateway.service.event.EventGrpcClientService;
import com.squad.gateway.service.event.EventStreamBridgeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/event")
@RequiredArgsConstructor
public class EventController {
    private final EventGrpcClientService eventGrpcClientService;
    private final EventStreamBridgeService eventStreamBridgeService;

    // TODO getUpcomingEvents @GetMapping getEvent @GetMapping("/{eventId}")

    @GetMapping("/{eventId}")
    public ResponseEntity<Map<String, Object>> getEventById(
            @PathVariable String eventId) {

        GetEventByIdResponse serviceResponse = eventGrpcClientService.getEventById(eventId);

        Map<String, Object> response = new HashMap<>();

        response.put("content", serviceResponse.getEvent());

        return new ResponseEntity<>(response, HttpStatus.FOUND);
    }


    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int rpp,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(defaultValue = "createdAt") String sortBy
    ) {
        GetAllByStatusRequest request = GetAllByStatusRequest.newBuilder()
                .setPage(page)
                .setRpp(rpp)
                .setSortDir(sortDir)
                .setSortBy(sortBy)
                .build();

        GetAllByStatusResponse serviceResponse = eventGrpcClientService.getAllEventsByStatus(request);

        Map<String, Object> response = new HashMap<>();

        response.put("content", serviceResponse.getEventsList());
        response.put("pageInfo", serviceResponse.getPageInfo());

        return new ResponseEntity<>(response, HttpStatus.FOUND);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, UUID>> createEvent(@Valid @RequestBody CreateEventHttpRequest request,
                                                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UUID eventId = eventGrpcClientService.createEvent(request, userPrincipal.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("eventId", eventId));
    }


    @PostMapping("/{eventId}/join")
    public ResponseEntity<Map<String, UUID>> joinEvent(
            @PathVariable UUID eventId,
            @Valid @RequestBody JoinEventHttpRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        UUID participantId = eventGrpcClientService.joinEvent(request, userPrincipal.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("participantId", participantId));
    }


    @PatchMapping("/{eventId}/side/{sideId}/ready")
    public ResponseEntity<Void> updateSideReady(
            @PathVariable UUID eventId,
            @PathVariable UUID sideId,
            @Valid @RequestBody UpdateSideReadyHttpRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        eventGrpcClientService.setSideReady(
                eventId, sideId, userPrincipal.id(), request.isReady());
        return ResponseEntity.ok().build();
    }


    @PutMapping("/{eventId}/match/{matchId}/map-vote")
    public ResponseEntity<Void> mapVote(
            @PathVariable UUID eventId,
            @PathVariable UUID matchId,
            @Valid @RequestBody MapVoteHttpRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        eventGrpcClientService.mapVote(eventId, matchId, userPrincipal.id(), request.layer());
        return ResponseEntity.ok().build();
    }


    @GetMapping("/{eventId}/match/{matchId}/match-timeline")
    public ResponseEntity<Map<String, List<TimelineEventHttpResponse>>> getMatchTimeline (
            @Valid @PathVariable UUID eventId,
            @Valid @PathVariable UUID matchId
    ) {

        List<TimelineEventHttpResponse> timelineEventsList = eventGrpcClientService.getMatchTimeline(eventId, matchId);
        return ResponseEntity.ok(Map.of("timelineEvent", timelineEventsList));
    }


    @GetMapping(
            value = "/{eventId}/match/{matchId}/timeline/stream",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public SseEmitter streamMatchTimeline(
            @PathVariable UUID eventId,
            @PathVariable UUID matchId
    ) {
        return eventStreamBridgeService.subscribe(eventId, matchId);
    }
}
