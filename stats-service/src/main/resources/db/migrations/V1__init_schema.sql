CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY,
    clan_id UUID,
    elo_rating INT DEFAULT 1000,
    matches_played INT DEFAULT 0,
    total_playtime_hours INT DEFAULT 0,
    kills INT DEFAULT 0,
    deaths INT DEFAULT 0,
    revives INT DEFAULT 0,
    vehicles_destroyed INTEGER DEFAULT 0,
    favourite_role VARCHAR(50),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

CREATE INDEX idx_user_stats_id ON user_stats(user_id);
CREATE INDEX idx_user_stats_elo_rating ON user_stats(elo_rating)


CREATE TABLE clan_stats (

)

CREATE TABLE event_match_player_stats (
    id UUID PRIMARY KEY NOT NULL,
    match_id UUID NOT NULL REFERENCES event_match(id) ON DELETE CASCADE, --TODO: on delete cascade triggers realisation
    participant_id UUID NOT NULL REFERENCES event_participant(id) ON DELETE CASCADE, --TODO: on delete cascade triggers realisation

    primary_role VARCHAR(64),

    kills INTEGER NOT NULL DEFAULT 0,
    deaths INTEGER NOT NULL DEFAULT 0,
    revives INTEGER NOT NULL DEFAULT 0,
    team_kills INTEGER NOT NULL DEFAULT 0,

    vehicles_destroyed INTEGER NOT NULL DEFAULT 0,
    vehicles_lost INTEGER NOT NULL DEFAULT 0,
    flying_time_seconds INTEGER NOT NULL DEFAULT 0,
    supply_points INTEGER NOT NULL DEFAULT 0,


    CONSTRAINT uq_match_player_stats UNIQUE (match_id, participant_id)
);

CREATE INDEX idx_match_player_stats_match_id ON event_match_player_stats(match_id);
CREATE INDEX idx_match_player_stats_participant_id ON event_match_player_stats(participant_id);