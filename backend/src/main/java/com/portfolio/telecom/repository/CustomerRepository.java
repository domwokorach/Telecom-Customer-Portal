package com.portfolio.telecom.repository;
import com.portfolio.telecom.domain.CustomerAccount;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CustomerRepository extends JpaRepository<CustomerAccount, Long> { }
