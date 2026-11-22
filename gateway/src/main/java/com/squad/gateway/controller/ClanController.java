package com.squad.gateway.controller;

import com.squad.gateway.service.clan.ClanGrpcClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/clan")
@RequiredArgsConstructor
public class ClanController {
    private final ClanGrpcClientService clanGrpcClientService;

    public record CreateClanDto(String name, String tag, String leaderId, String description, String requirements, String avatarUrl) {}
    public record ApplyToClanDto(String userId, String clanId, String socialLink, String experienceText) {}
    public record ClanMemberDto(String id, String userId, String role) {}
    public record ClanDto(String id, String name, String tag, String avatarUrl, String description, String requirements, boolean isRecruiting,
            String status, int totalElo, int minElo, String createdAt, List<ClanMemberDto> members) {}
    public record ClanActionResponseDto(String id, String message) {}
    public record ProcessAcceptanceDto(String acceptorId) {}
    public record ProcessAcceptanceResponse(ClanMemberDto newMember, String message) {}

    // clan creation: POST /api/v1/clan/create
    @PostMapping("/create")
    public ResponseEntity<?> createClan(@RequestBody CreateClanDto request) {
        try {
            var grpcResponse = clanGrpcClientService.createClan(
                    request.name, request.tag, request.leaderId,
                    request.description, request.requirements, request.avatarUrl);
            return ResponseEntity.ok(new ClanActionResponseDto(
                    grpcResponse.getClanId(),
                    grpcResponse.getMessage()));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // clan get with members list: GET /api/v1/clan/{clanId}
    @GetMapping("/{clanId}")
    public ResponseEntity<?> getClanWithMembers(@PathVariable String clanId) {
        try {
            var grpcResponse = clanGrpcClientService.getClanWithMembers(clanId).getClan();


            List<ClanMemberDto> members = grpcResponse.getMembersList().stream()
                    .map(m -> new ClanMemberDto(m.getId(), m.getUserId(), m.getRole()))
                    .toList();

            ClanDto response = new ClanDto(
                    grpcResponse.getId(),
                    grpcResponse.getName(),
                    grpcResponse.getTag(),
                    grpcResponse.getAvatarUrl(),
                    grpcResponse.getDescription(),
                    grpcResponse.getRequirements(),
                    grpcResponse.getIsRecruiting(),
                    grpcResponse.getStatus(),
                    grpcResponse.getTotalElo(),
                    grpcResponse.getMinElo(),
                    grpcResponse.getCreatedAt(),
                    members
            );
            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAllClans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int rpp,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(defaultValue = "totalElo") String sortBy
    ) {
        try {
            var serviceResponse = clanGrpcClientService.getAllClans(page, rpp, sortDir, sortBy);

            Map<String, Object> response = new HashMap<>();

            response.put("content", serviceResponse.getClansList());
            response.put("pageInfo", serviceResponse.getPageInfo());

            return ResponseEntity.ok(response);
        }

        catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(504).body(Map.of("error", e.getMessage()));
        }
        catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{clanId}/applications")
    public ResponseEntity<?> applyToClan(@PathVariable String clanId, @RequestBody ApplyToClanDto request) {
        try {
            var grpcResponse = clanGrpcClientService.applyToClan(
                    request.userId, request.clanId, request.socialLink, request.experienceText);
            return ResponseEntity.ok(new ClanActionResponseDto(
                    grpcResponse.getApplicationId(),
                    grpcResponse.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/application/{applicationId}/status")
    public ResponseEntity<?> resolveApplication(
            @PathVariable String applicationId,
            @RequestBody ProcessAcceptanceDto request) {
        try {
            var grpcResponse = clanGrpcClientService.processAcceptance(applicationId, request.acceptorId);
            ClanMemberDto memberDto = grpcResponse.hasNewMember()
                    ? new ClanMemberDto(
                            grpcResponse.getNewMember().getId(),
                            grpcResponse.getNewMember().getUserId(),
                            grpcResponse.getNewMember().getRole())
                    : null;

            return ResponseEntity.ok(new ProcessAcceptanceResponse(memberDto, grpcResponse.getMessage()));
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
