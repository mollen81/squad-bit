package com.squad.stats.service;

import com.squad.stats.dto.UserStats;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class StatsService {
    private final UserStatsService userStatsService;


    // UserStatsService facade
    public UserStats getUserStats(UUID userId) {
        return userStatsService.getUserStats(userId);
    }

    public Page<UserStats> getUserStatsLeaderboard(Pageable pageable) {
        return userStatsService.getUserStatsLeaderboard(pageable);
    }

    public Page<UserStats> getUserStatsByClanId(UUID clanId, Pageable pageable) {
        return userStatsService.getUserStatsByClanId(clanId, pageable);
    }
}
