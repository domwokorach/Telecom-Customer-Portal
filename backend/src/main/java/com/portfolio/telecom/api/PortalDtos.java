package com.portfolio.telecom.api;

import java.math.BigDecimal;
import java.util.List;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class PortalDtos {
    private PortalDtos() { }
    public record CustomerDto(Long id, String name, String email, String phone, String memberSince) { }
    public record PlanDto(String id, String name, String description, BigDecimal price, Integer dataLimitGb,
                          String calls, String texts, List<String> perks) { }
    public record UsagePoint(String month, double amountGb) { }
    public record UsageCategory(String name, double amountGb, String color) { }
    public record UsageDto(double dataUsedGb, int daysLeft, String nextRenewal,
                           List<UsagePoint> history, List<UsageCategory> categories) { }
    public record InvoiceDto(String id, String period, String date, BigDecimal amount, String status) { }
    public record TicketDto(Long id, String subject, String message, String category, String status, String createdAt) { }
    public record PortalDto(CustomerDto customer, String activePlanId, List<PlanDto> plans,
                            UsageDto usage, List<InvoiceDto> invoices, List<TicketDto> tickets) { }
    public record PlanChangeRequest(@NotBlank String planId) { }
    public record TicketRequest(@NotBlank @Size(min = 3, max = 100) String subject,
                                @NotBlank @Size(min = 10, max = 1000) String message,
                                @NotBlank @Size(max = 50) String category) { }
    public record ProfileRequest(@NotBlank @Size(min = 2, max = 100) String name,
                                 @NotBlank @Email @Size(max = 150) String email) { }
}
