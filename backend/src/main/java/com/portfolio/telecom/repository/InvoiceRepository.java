package com.portfolio.telecom.repository;
import com.portfolio.telecom.domain.Invoice;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    List<Invoice> findAllByOrderByIdDesc();
}
