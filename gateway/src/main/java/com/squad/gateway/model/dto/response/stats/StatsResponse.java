package com.squad.gateway.model.dto.response.stats;

public record StatsResponse(
        int eloRating,
        int kills,
        int deaths,
        int revives,
        String favouriteRole,
        int totalPlaytimeHours
) {}