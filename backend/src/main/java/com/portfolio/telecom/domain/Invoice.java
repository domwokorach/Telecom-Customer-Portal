package com.portfolio.telecom.domain;

import java.math.BigDecimal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "invoices")
public class Invoice {
    @Id public String id;
    @Column(nullable = false) public String period;
    @Column(name = "issue_date", nullable = false) public String date;
    @Column(nullable = false, precision = 10, scale = 2) public BigDecimal amount;
    @Column(nullable = false) public String status;
    protected Invoice() { }
    public Invoice(String id, String period, String date, BigDecimal amount, String status) {
        this.id = id; this.period = period; this.date = date; this.amount = amount; this.status = status;
    }
}
