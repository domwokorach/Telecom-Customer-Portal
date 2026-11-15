package com.portfolio.telecom.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "support_tickets")
public class SupportTicket {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @Column(nullable = false, length = 100) public String subject;
    @Column(nullable = false, length = 1000) public String message;
    @Column(nullable = false, length = 50) public String category;
    @Column(nullable = false, length = 20) public String status;
    @Column(nullable = false, length = 30) public String createdAt;

    protected SupportTicket() { }
    public SupportTicket(String subject, String message, String category, String status, String createdAt) {
        this.subject = subject; this.message = message; this.category = category;
        this.status = status; this.createdAt = createdAt;
    }
}
