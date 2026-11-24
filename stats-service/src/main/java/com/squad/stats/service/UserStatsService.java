package com.squad.stats.service;

import com.squad.stats.dto.UserStats;
import com.squad.stats.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserStatsService {
    private final UserStatsRepository userStatsRepository;


    @Transactional(readOnly = true)
    public UserStats getUserStats(UUID userId) {
        log.info("Fetching user stats for user with id {}", userId);

        return userStatsRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User stats not found for user with id " + userId));
    }


    @Transactional(readOnly = true)
    public Page<UserStats> getUserStatsLeaderboard(Pageable pageable) {
        log.info("Fetching global user stats leaderboard");

        Page<UserStats> leaderboardPage = userStatsRepository.findAllBy(pageable);

        if(leaderboardPage.isEmpty()) {
            throw new IllegalArgumentException("User stats leaderboard page is not found");
        }

        return leaderboardPage;
    }


    @Transactional(readOnly = true)
    public Page<UserStats> getClanUserStatsLeaderBoard(UUID clanId, Pageable pageable) {
        log.info("Fetching clan {} user stats leaderboard", clanId);


    }
}
