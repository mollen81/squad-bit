package com.squad.gateway.model.dto.response.stats;

import java.util.List;

public record GetUserStatsLeaderboardResponse(
        List<StatsResponse> content

) {}