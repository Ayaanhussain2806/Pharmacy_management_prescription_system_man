package com.pharmacy.controller;

import com.pharmacy.dto.ApiResponse;
import com.pharmacy.enums.Role;
import com.pharmacy.model.*;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('PHARMACIST')")
public class PharmacistController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    // ========== Dashboard Stats ==========
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("pendingPrescriptions", prescriptionService.getPendingPrescriptions().size());
        stats.put("totalOrders", orderService.getAllOrders().size());
        stats.put("totalMedicines", medicineService.getAllMedicines().size());
        stats.put("lowStockMedicines", medicineService.getLowStockMedicines().size());
        stats.put("deliveryAgents", userRepository.findByRole(Role.DELIVERY_AGENT).size());
        return ResponseEntity.ok(new ApiResponse(true, "Dashboard stats", stats));
    }

    // ========== Prescription Management ==========
    @GetMapping("/prescriptions")
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/prescriptions/pending")
    public ResponseEntity<List<Prescription>> getPendingPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getPendingPrescriptions());
    }

    @PutMapping("/prescriptions/{id}/approve")
    public ResponseEntity<?> approvePrescription(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Prescription prescription = prescriptionService.approvePrescription(id, getUserId(userDetails));
        return ResponseEntity.ok(new ApiResponse(true, "Prescription approved", prescription));
    }

    @PutMapping("/prescriptions/{id}/reject")
    public ResponseEntity<?> rejectPrescription(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        String reason = request.getOrDefault("reason", "No reason provided");
        Prescription prescription = prescriptionService.rejectPrescription(id, getUserId(userDetails), reason);
        return ResponseEntity.ok(new ApiResponse(true, "Prescription rejected", prescription));
    }

    // ========== Order Management ==========
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/approve")
    public ResponseEntity<?> approveOrder(@PathVariable Long id) {
        Order order = orderService.approveOrder(id);
        return ResponseEntity.ok(new ApiResponse(true, "Order approved", order));
    }

    @PutMapping("/orders/{id}/reject")
    public ResponseEntity<?> rejectOrder(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String reason = request.getOrDefault("reason", "No reason provided");
        Order order = orderService.rejectOrder(id, reason);
        return ResponseEntity.ok(new ApiResponse(true, "Order rejected", order));
    }

    @PostMapping("/orders/{id}/assign-agent")
    public ResponseEntity<?> assignAgent(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        Long agentId = request.get("agentId");
        Order order = orderService.assignAgent(id, agentId);
        return ResponseEntity.ok(new ApiResponse(true, "Delivery agent assigned", order));
    }

    // ========== Inventory Management ==========
    @GetMapping("/inventory")
    public ResponseEntity<List<Medicine>> getInventory() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @PostMapping("/inventory")
    public ResponseEntity<?> addMedicine(@RequestBody Medicine medicine) {
        Medicine saved = medicineService.saveMedicine(medicine);
        return ResponseEntity.ok(new ApiResponse(true, "Medicine added", saved));
    }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        Medicine updated = medicineService.updateMedicine(id, medicine);
        return ResponseEntity.ok(new ApiResponse(true, "Medicine updated", updated));
    }

    @DeleteMapping("/inventory/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok(new ApiResponse(true, "Medicine deleted"));
    }

    @GetMapping("/inventory/low-stock")
    public ResponseEntity<List<Medicine>> getLowStock() {
        return ResponseEntity.ok(medicineService.getLowStockMedicines());
    }

    @GetMapping("/inventory/{id}/substitutes")
    public ResponseEntity<List<Medicine>> getSubstitutes(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getSubstitutes(id));
    }

    // ========== Delivery Agents ==========
    @GetMapping("/delivery-agents")
    public ResponseEntity<List<User>> getDeliveryAgents() {
        return ResponseEntity.ok(userRepository.findByRole(Role.DELIVERY_AGENT));
    }
}
