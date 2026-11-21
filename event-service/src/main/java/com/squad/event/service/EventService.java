package com.squad.event.service;

import com.squad.event.kafka.event.EventMatchTimelineEvent;
import com.squad.event.kafka.event.MatchFinishedEvent;
import com.squad.event.kafka.event.ServerReadyEvent;
import com.squad.event.model.domain.*;
import com.squad.event.model.dto.*;
import com.squad.event.model.enums.EventStatus;
import com.squad.event.repo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventService {

    private final EventLifecycleManagementService eventLifecycleManagementService;
    private final EventParticipantManagementService eventParticipantManagementService;
    private final EventSideManagementService eventSideManagementService;
    private final EventMatchLayerManagementService eventMatchLayerManagementService;
    private final EventMatchTimelineService eventMatchTimelineService;
    private final EventRepository eventRepository;


    public Optional<Event> getEventById(UUID id) {
        return eventRepository.findById(id);
    }

    public UUID createEvent(CreateEventHttpRequest request) {
        return eventLifecycleManagementService.createEvent(request);
    }


    public UUID joinEvent(JoinEventHttpRequest request) {
        return eventParticipantManagementService.joinEvent(request);
    }


    public void setSideReady(UpdateSideReadyHttpRequest request) {
        eventSideManagementService.setSideReady(request);
    }


    public void mapVote(MapVoteHttpRequest request) {
        eventMatchLayerManagementService.mapVote(request);
    }


    public void startEventPreparation(UUID eventId) {
        eventLifecycleManagementService.startEventPreparation(eventId);
    }


    public void handleMatchFinished(MatchFinishedEvent matchFinishedEvent) {
        eventLifecycleManagementService.handleMatchFinished(matchFinishedEvent);
    }


    public void handleServerReady(ServerReadyEvent event) {
        eventLifecycleManagementService.handleServerReady(event);
    }

    public void processMatchTimelineEvent(EventMatchTimelineEvent eventMatchTimelineEvent) {
        eventMatchTimelineService.processTimelineEvent(eventMatchTimelineEvent);
    }

    public List<TimelineEvent> getMatchTimelineHistory(UUID eventId, UUID matchId) {
        return eventMatchTimelineService.getMatchTimelineHistory(eventId, matchId);
    }

    public Page<Event> getAllEventsByStatus(EventStatus status, Pageable pageable) {
        return eventRepository.findAllByStatus(status, pageable);
    }
}
