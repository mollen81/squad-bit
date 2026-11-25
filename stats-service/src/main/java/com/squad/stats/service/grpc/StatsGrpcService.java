package com.squad.stats.service.grpc;

import com.squad.stats.dto.UserStats;
import com.squad.stats.grpc.GetPlayerStatsByInternalIdRequest;
import com.squad.stats.grpc.GetPlayerStatsResponse;
import com.squad.stats.grpc.StatsServiceGrpc;
import com.squad.stats.repository.UserStatsRepository;
import com.squad.stats.service.UserStatsService;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.Optional;
import java.util.UUID;

@GrpcService
@Slf4j
@RequiredArgsConstructor
public class StatsGrpcService extends StatsServiceGrpc.StatsServiceImplBase {
    private final UserStatsService userStatsService;

    @Override
    public void getPlayerStats(GetPlayerStatsByInternalIdRequest request, StreamObserver<GetPlayerStatsResponse> responseObserver) {
        log.info("New gRPC statistics query for userId: {}", request.getUserId());

        try {
            UUID userId = UUID.fromString(request.getUserId());

            UserStats userStats = userStatsService.getUserStats(UUID.fromString(request.getUserId()));

            GetPlayerStatsResponse response = GetPlayerStatsResponse.newBuilder()
                    .setEloRating(userStats.getEloRating())
                    .setFavouriteRole(userStats.getFavouriteRole())
                    .setKills(userStats.getKills())
                    .setVehiclesDestroyed(userStats.getVehiclesDestroyed())
                    .setDeaths(userStats.getKills())
                    .setRevives(userStats.getRevives())
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
        catch (IllegalArgumentException e) {
            log.error("Incorrect UUID format: {}", request.getUserId());
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription(e.getMessage())
                    .withCause(e.getCause())
                    .asRuntimeException());
        }
        catch (Exception e) {
            log.error("Internal server error while stats fetching", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription(e.getMessage())
                    .withCause(e.getCause())
                    .asRuntimeException());
        }
    }
}
