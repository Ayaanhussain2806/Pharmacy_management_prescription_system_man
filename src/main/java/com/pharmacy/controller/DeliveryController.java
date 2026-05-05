package com.pharmacy.controller;

import com.pharmacy.dto.ApiResponse;
import com.pharmacy.model.Order;
import com.pharmacy.model.User;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@PreAuthorize("hasRole('DELIVERY_AGENT')")
public class DeliveryController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAssignedOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.getAgentOrders(getUserId(userDetails)));
    }

    @GetMapping("/orders/active")
    public ResponseEntity<List<Order>> getActiveOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.getActiveAgentOrders(getUserId(userDetails)));
    }

    @PutMapping("/orders/{id}/pickup")
    public ResponseEntity<?> pickupOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.pickupOrder(id, getUserId(userDetails));
        return ResponseEntity.ok(new ApiResponse(true, "Order marked as picked up", order));
    }

    @PutMapping("/orders/{id}/deliver")
    public ResponseEntity<?> deliverOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        String otp = request.get("otp");
        Order order = orderService.deliverOrder(id, getUserId(userDetails), otp);
        return ResponseEntity.ok(new ApiResponse(true, "Order delivered successfully", order));
    }
}
