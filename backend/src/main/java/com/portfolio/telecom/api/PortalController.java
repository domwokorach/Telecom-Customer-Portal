package com.portfolio.telecom.api;

import com.portfolio.telecom.api.PortalDtos.*;
import com.portfolio.telecom.service.PortalService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class PortalController {
    private final PortalService service;
    public PortalController(PortalService service) { this.service = service; }

    @GetMapping("/portal")
    public PortalDto portal() { return service.snapshot(); }

    @PatchMapping("/plan")
    public PortalDto changePlan(@Valid @RequestBody PlanChangeRequest input) { return service.changePlan(input); }

    @PostMapping("/tickets")
    public PortalDto createTicket(@Valid @RequestBody TicketRequest input) { return service.createTicket(input); }

    @PatchMapping("/profile")
    public PortalDto updateProfile(@Valid @RequestBody ProfileRequest input) { return service.updateProfile(input); }

    @PostMapping("/demo/reset")
    public PortalDto reset() { return service.reset(); }
}
