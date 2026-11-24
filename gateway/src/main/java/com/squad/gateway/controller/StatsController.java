package com.squad.gateway.controller;

import com.squad.gateway.model.dto.response.stats.StatsResponse;
import com.squad.gateway.service.stats.StatsGrpcClientService;
import com.squad.stats.grpc.GetPlayerStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
public class StatsController {
    private final StatsGrpcClientService statsGrpcClientService;


    @GetMapping("user/{userId}")
    public ResponseEntity<Map<String, Object>> getPlayerStats(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        GetPlayerStatsResponse grpcResponse = statsGrpcClientService.getPlayerStats(userId);

        StatsResponse statsDto = new StatsResponse(
                grpcResponse.getEloRating(),
                grpcResponse.getKills(),
                grpcResponse.getDeaths(),
                grpcResponse.getRevives(),
                grpcResponse.getFavouriteRole(),
                grpcResponse.getTotalPlaytimeHours()
        );

        response.put("content", statsDto);
        return new ResponseEntity<>(response, HttpStatus.FOUND);
    }

    @GetMapping("user/leaderboard")
    public ResponseEntity<Map<String, Object>> getUserStatsLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int rpp,
            @RequestParam(defaultValue = "sortDir") String sortDir,
            @RequestParam(defaultValue = "sortBy") String sortBy
    ) {
        Map<String, Object> response = new HashMap<>();
        var serviceResponse = statsGrpcClientService.
    }
}