package com.squad.stats.repository;

import com.squad.stats.dto.UserStats;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, UUID> {
    @Override
    Optional<UserStats> findById(@NonNull UUID id);

    Optional<UserStats> findByUserId(UUID id);

    @Override
    Page<UserStats> findAll(@NonNull Pageable pageable);


    Page<UserStats> findAllByClanId(@NonNull UUID clanId, @NonNull Pageable pageable);
}
