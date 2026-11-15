package com.portfolio.telecom.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "customer_accounts")
public class CustomerAccount {
    @Id public Long id;
    @Column(nullable = false, length = 100) public String name;
    @Column(nullable = false, length = 150) public String email;
    @Column(nullable = false, length = 20) public String phone;
    @Column(nullable = false, length = 50) public String memberSince;
    @Column(nullable = false, length = 25) public String activePlanId;

    protected CustomerAccount() { }
    public CustomerAccount(Long id, String name, String email, String phone, String memberSince, String activePlanId) {
        this.id = id; this.name = name; this.email = email; this.phone = phone;
        this.memberSince = memberSince; this.activePlanId = activePlanId;
    }
}
