package com.pharmacy.repository;

import com.pharmacy.enums.OrderStatus;
import com.pharmacy.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByAgentIdOrderByCreatedAtDesc(Long agentId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByAgentIdAndStatusIn(Long agentId, List<OrderStatus> statuses);
    List<Order> findAllByOrderByCreatedAtDesc();
}
