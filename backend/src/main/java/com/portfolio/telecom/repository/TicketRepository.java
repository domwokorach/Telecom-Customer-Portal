package com.portfolio.telecom.repository;
import com.portfolio.telecom.domain.SupportTicket;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findAllByOrderByIdDesc();
}
