package com.portfolio.telecom.service;

import com.portfolio.telecom.api.PortalDtos.*;
import com.portfolio.telecom.domain.CustomerAccount;
import com.portfolio.telecom.domain.Invoice;
import com.portfolio.telecom.domain.SupportTicket;
import com.portfolio.telecom.repository.CustomerRepository;
import com.portfolio.telecom.repository.InvoiceRepository;
import com.portfolio.telecom.repository.TicketRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PortalService implements ApplicationRunner {
    private static final long DEMO_CUSTOMER_ID = 1L;
    private final CustomerRepository customers;
    private final InvoiceRepository invoices;
    private final TicketRepository tickets;

    private static final List<PlanDto> PLANS = List.of(
        new PlanDto("essential", "Essential", "The everyday essentials", new BigDecimal("18.00"), 20,
            "Unlimited UK calls", "Unlimited texts", List.of("5G connectivity", "EU roaming add-on available", "No annual contract")),
        new PlanDto("plus", "Plus", "More freedom, more data", new BigDecimal("28.00"), 80,
            "Unlimited UK calls", "Unlimited texts", List.of("5G connectivity", "EU roaming included", "Priority customer support")),
        new PlanDto("unlimited", "Unlimited", "All the data you need", new BigDecimal("38.00"), null,
            "Unlimited UK calls", "Unlimited texts", List.of("Unlimited 5G data", "EU roaming included", "Priority customer support", "Entertainment benefit"))
    );
    private static final Map<String, PlanDto> PLAN_BY_ID = PLANS.stream().collect(Collectors.toUnmodifiableMap(PlanDto::id, Function.identity()));
    private static final UsageDto USAGE = new UsageDto(32.4, 12, "27 Nov 2026", List.of(
        new UsagePoint("Jun", 25.2), new UsagePoint("Jul", 38.4), new UsagePoint("Aug", 29.8),
        new UsagePoint("Sep", 43.2), new UsagePoint("Oct", 35.6), new UsagePoint("Nov", 32.4)), List.of(
        new UsageCategory("Streaming", 13.2, "#846cf5"), new UsageCategory("Social", 8.5, "#fd9a69"),
        new UsageCategory("Browsing", 5.8, "#47b6c8"), new UsageCategory("Other", 4.9, "#d7dce7")));

    public PortalService(CustomerRepository customers, InvoiceRepository invoices, TicketRepository tickets) {
        this.customers = customers; this.invoices = invoices; this.tickets = tickets;
    }

    @Override @Transactional
    public void run(ApplicationArguments args) { if (customers.count() == 0) seed(); }

    private void seed() {
        customers.save(new CustomerAccount(DEMO_CUSTOMER_ID, "Alex Morgan", "alex.morgan@example.com", "07700 900123", "January 2024", "plus"));
        invoices.saveAll(List.of(
            new Invoice("INV-2026-10", "October 2026", "27 Oct 2026", new BigDecimal("28.00"), "PAID"),
            new Invoice("INV-2026-09", "September 2026", "27 Sep 2026", new BigDecimal("28.00"), "PAID"),
            new Invoice("INV-2026-08", "August 2026", "27 Aug 2026", new BigDecimal("28.00"), "PAID"),
            new Invoice("INV-2026-07", "July 2026", "27 Jul 2026", new BigDecimal("28.00"), "PAID")));
        tickets.save(new SupportTicket("Checking EU roaming availability", "Can I use my data while travelling?", "Plan & roaming", "RESOLVED", "5 Nov 2026"));
        tickets.save(new SupportTicket("eSIM activation assistance", "I need help activating my new eSIM.", "Technical support", "IN_PROGRESS", "12 Nov 2026"));
    }

    private CustomerAccount customer() { return customers.findById(DEMO_CUSTOMER_ID).orElseThrow(() -> new NoSuchElementException("Demo account missing")); }

    @Transactional(readOnly = true)
    public PortalDto snapshot() {
        var customer = customer();
        return new PortalDto(new CustomerDto(customer.id, customer.name, customer.email, customer.phone, customer.memberSince),
            customer.activePlanId, PLANS, USAGE,
            invoices.findAllByOrderByIdDesc().stream().map(invoice -> new InvoiceDto(invoice.id, invoice.period, invoice.date, invoice.amount, invoice.status)).toList(),
            tickets.findAllByOrderByIdDesc().stream().map(ticket -> new TicketDto(ticket.id, ticket.subject, ticket.message, ticket.category, ticket.status, ticket.createdAt)).toList());
    }

    @Transactional
    public PortalDto changePlan(PlanChangeRequest request) {
        if (!PLAN_BY_ID.containsKey(request.planId())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown plan id");
        var account = customer(); account.activePlanId = request.planId(); customers.save(account);
        return snapshot();
    }

    @Transactional
    public PortalDto createTicket(TicketRequest request) {
        tickets.save(new SupportTicket(request.subject().trim(), request.message().trim(), request.category().trim(),
            "OPEN", LocalDate.now().format(DateTimeFormatter.ofPattern("d MMM uuuu"))));
        return snapshot();
    }

    @Transactional
    public PortalDto updateProfile(ProfileRequest request) {
        var account = customer(); account.name = request.name().trim(); account.email = request.email().trim();
        customers.save(account); return snapshot();
    }

    @Transactional
    public PortalDto reset() {
        tickets.deleteAll(); invoices.deleteAll(); customers.deleteAll();
        seed(); return snapshot();
    }
}
