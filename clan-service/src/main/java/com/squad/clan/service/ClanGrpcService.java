package com.squad.clan.service;

import com.squad.clan.dto.ClanRequests;
import com.squad.clan.entity.Clan;
import com.squad.clan.entity.ClanApplication;
import com.squad.clan.entity.ClanMember;
import com.squad.clan.facade.ClanFacade;
import com.squad.clan.grpc.*;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

@GrpcService
@Slf4j
@RequiredArgsConstructor
public class ClanGrpcService extends ClanServiceGrpc.ClanServiceImplBase {

    private final ClanFacade clanFacade;

    @Override
    public void createClan(CreateClanRequest request, StreamObserver<CreateClanResponse> responseObserver) {
        log.info("Create clan request is sent from user: {}", request.getLeaderId());
        try {
            // gRPC request -> DTO
            ClanRequests.CreateClanDto dto = ClanRequests.CreateClanDto.builder()
                    .leaderId(UUID.fromString(request.getLeaderId()))
                    .tag(request.getTag())
                    .name(request.getName())
                    .description(request.getDescription())
                    .requirements(request.getRequirements())
                    .avatarUrl(request.getAvatarUrl())
                    .build();

            // Facade call, (ELO fetching from stats-service + saving in DB)
            Clan clan = clanFacade.createClan(dto);

            // Clan -> ClanResponse (Entity -> gPRC response)
            CreateClanResponse response = CreateClanResponse.newBuilder()
                    .setClanId(clan.getId().toString())
                    .setMessage("Clan successfully created")
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
        catch (Exception e) {
            log.error("Internal server error while creating clan", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription(e.getMessage())
                    .withCause(e.getCause())
                    .asRuntimeException());
        }
    }


    @Override
    public void applyToClan(ApplyToClanRequest request, StreamObserver<ApplyToClanResponse> responseObserver) {
        log.info("Application to clan is received from user: {} to clan: {}",
                request.getUserId(), request.getClanId());
        try {
            // gRPC request -> DTO
            ClanRequests.ApplyToClanDto applyToClanDto = ClanRequests.ApplyToClanDto.builder()
                    .clanId(UUID.fromString(request.getClanId()))
                    .userId(UUID.fromString(request.getUserId()))
                    .socialLink(request.getSocialLink())
                    .experienceText(request.getExperienceText())
                    .build();

            // Facade call, (ELO fetching from stats-service + saving in DB)
            ClanApplication clanApplication = clanFacade.applyToClan(applyToClanDto);

            ApplyToClanResponse response = ApplyToClanResponse.newBuilder()
                    .setMessage("Application to clan successfully sent")
                    .setApplicationId(clanApplication.getId().toString())
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
        catch (Exception e) {
            log.error("Internal server error while applying user: {} to clan with clanId: {}",
                    request.getUserId(), request.getClanId());
            responseObserver.onError(Status.INTERNAL
                    .withDescription(e.getMessage())
                    .withCause(e.getCause())
                    .asRuntimeException());
        }
    }


    @Override
    public void getClanWithMembers(GetClanWithMembersRequest request, StreamObserver<GetClanWithMembersResponse> responseObserver) {
        log.info("Requesting information about clan with clanId: {}", request.getClanId());
        try {
            UUID clanId = UUID.fromString(request.getClanId());

            Clan clan = clanFacade.getClanWithMembers(clanId);

            GetClanWithMembersResponse response = mapToClanWithMembersResponse(clan);

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
        catch (IllegalArgumentException e) {
            // Невалидный UUID или клан не найден
            log.warn("Invalid argument in getClanWithMembers: {}", e.getMessage());
            responseObserver.onError(
                    Status.INVALID_ARGUMENT
                            .withDescription(e.getMessage())
                            .asRuntimeException()
            );
        } catch (IllegalStateException e) {
            log.warn("Business rule violation in getClanWithMembers: {}", e.getMessage());
            responseObserver.onError(
                    Status.FAILED_PRECONDITION
                            .withDescription(e.getMessage())
                            .asRuntimeException()
            );
        } catch (Exception e) {
            log.error("Unexpected error in getClanWithMembers", e);
            responseObserver.onError(
                    Status.INTERNAL
                            .withDescription(e.getMessage())
                            .asRuntimeException()
            );
        }
    }

    @Override
    public void getAllClans(GetAllClansRequest request, StreamObserver<GetAllClansResponse> responseObserver) {
        log.info("Fetching clans page {}, rpp {}", request.getPage(), request.getRpp());
        try {
            Pageable pageable = PageRequest.of(
                    request.getPage(),
                    request.getRpp(),
                    Sort.Direction.fromString(request.getSortDir()),
                    request.getSortBy());

            Page<Clan> clanPage = clanFacade.getAllClans(pageable);

            java.util.List<ClanDto> clanDtos = clanPage.stream().map(this::mapToClanDto).toList();

            GetAllClansResponse response = GetAllClansResponse.newBuilder()
                    .addAllClans(clanDtos)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
            log.info("Clans page {}, rpp {} successfully fetched", request.getPage(), request.getRpp());
        }
        catch (IllegalArgumentException e) {
            log.error("Clans page not found for page {}, rpp {}", request.getPage(), request.getRpp());
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription(e.getMessage())
                    .asRuntimeException());
        } catch (Exception e) {
            log.error("Unexpected error for getAllClans call");
            responseObserver.onError(Status.INTERNAL
                    .withDescription(e.getMessage())
                    .asRuntimeException());
        }
    }

    @Override
    public void getClanIdFromUserId(
            GetClanIdFromUserIdRequest request,
            StreamObserver<GetClanIdFromUserIdResponse> responseObserver
    ) {
        log.info("Finding clanId for userId {} from clan_member table", request.getUserId());
        try {
            UUID clanId = clanFacade.getClanIdFromUserId(UUID.fromString(request.getUserId()));

            GetClanIdFromUserIdResponse response = GetClanIdFromUserIdResponse.newBuilder()
                    .setClanId(clanId.toString())
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
        catch (IllegalArgumentException e) {
            log.error("clanId is not found for userId {} in table clan_member", request.getUserId());
            responseObserver.onError(
                    Status.NOT_FOUND
                            .withDescription(e.getMessage())
                            .asRuntimeException()
            );
        }
        catch (Exception e) {
            log.error("Unexpected error for getClanIdFromUserId method");
            responseObserver.onError(
                    Status.INTERNAL
                            .withCause(e.getCause())
                            .withDescription(e.getMessage())
                            .asRuntimeException()
            );
        }
    }

    @Override
    public void processAcceptance(ProcessAcceptanceRequest request, StreamObserver<ProcessAcceptanceResponse> responseObserver) {
        log.info("Processing the acceptance of application: {}, accepted by user: {}",
                request.getApplicationId(), request.getAcceptorId());
        try {
            ClanRequests.AcceptApplicationDto acceptApplicationDto = ClanRequests.AcceptApplicationDto.builder()
                    .applicationId(UUID.fromString(request.getApplicationId()))
                    .accepterId(UUID.fromString(request.getAcceptorId()))
                    .build();
            ClanMember newMember = clanFacade.acceptApplication(acceptApplicationDto);

            ProcessAcceptanceResponse response = ProcessAcceptanceResponse.newBuilder()
                    .setNewMember(mapToMemberGrpcResponse(newMember))
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
        catch (Exception e) {
            log.error("Unexpected error in processAcceptance", e);
            responseObserver.onError(
                    Status.INTERNAL
                            .withDescription(e.getMessage())
                            .asRuntimeException()
            );
        }
    }


    // MAPPERS
    private GetClanWithMembersResponse mapToClanWithMembersResponse(Clan clan) {
        ClanDto clanDto = mapToClanDto(clan);

        return GetClanWithMembersResponse.newBuilder()
                .setClan(clanDto)
                .build();
    }

    public ClanDto mapToClanDto(Clan clan) {
        List<ClanMemberDto> memberResponses = clan.getMembers().stream()
                .map(this::mapToMemberGrpcResponse)
                .toList();

        return ClanDto.newBuilder()
                .setId(clan.getId().toString())
                .setName(clan.getName())
                .setTag(clan.getTag())
                .setDescription(clan.getDescription() != null ? clan.getDescription() : "")
                .setRequirements(clan.getRequirements() != null ? clan.getRequirements() : "")
                .setAvatarUrl(clan.getAvatarUrl() != null ? clan.getAvatarUrl() : "")
                .setIsRecruiting(clan.getIsRecruiting() != null ? clan.getIsRecruiting() : true)
                .setStatus(clan.getStatus() != null ? clan.getStatus().name() : "")
                .setTotalElo(clan.getTotalElo() != null ? clan.getTotalElo() : 0)
                .setMinElo(clan.getMinElo())
                .setCreatedAt(clan.getCreatedAt() != null ? clan.getCreatedAt().toString() : "")
                .addAllMembers(memberResponses)
                .build();
    }


    public ClanMemberDto mapToMemberGrpcResponse(ClanMember clanMember) {
        return ClanMemberDto.newBuilder()
                .setId(clanMember.getId() != null ? clanMember.getId().toString() : "")
                .setUserId(clanMember.getUserId() != null ? clanMember.getUserId().toString() : "")
                .setRole(clanMember.getRole() != null ? clanMember.getRole().toString() : "")
                .build();
    }
}
