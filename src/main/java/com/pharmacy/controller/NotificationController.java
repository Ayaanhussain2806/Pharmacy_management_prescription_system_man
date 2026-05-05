package com.pharmacy.controller;

import com.pharmacy.dto.ApiResponse;
import com.pharmacy.model.Notification;
import com.pharmacy.model.RefillReminder;
import com.pharmacy.model.User;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.NotificationService;
import com.pharmacy.service.RefillReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private RefillReminderService refillReminderService;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        long unreadCount = notificationService.getUnreadCount(userId);

        Map<String, Object> result = new HashMap<>();
        result.put("notifications", notifications);
        result.put("unreadCount", unreadCount);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponse(true, "Notification marked as read"));
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllAsRead(getUserId(userDetails));
        return ResponseEntity.ok(new ApiResponse(true, "All notifications marked as read"));
    }

    // ========== Refill Reminders ==========
    @PostMapping("/refill-reminders")
    public ResponseEntity<?> createReminder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> request) {
        Long userId = getUserId(userDetails);
        Long medicineId = Long.valueOf(request.get("medicineId").toString());
        String medicineName = request.get("medicineName").toString();
        int intervalDays = Integer.parseInt(request.get("intervalDays").toString());

        RefillReminder reminder = refillReminderService.createReminder(userId, medicineId, medicineName, intervalDays);
        return ResponseEntity.ok(new ApiResponse(true, "Refill reminder created", reminder));
    }

    @GetMapping("/refill-reminders")
    public ResponseEntity<List<RefillReminder>> getReminders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(refillReminderService.getUserReminders(getUserId(userDetails)));
    }

    @DeleteMapping("/refill-reminders/{id}")
    public ResponseEntity<?> deactivateReminder(@PathVariable Long id) {
        refillReminderService.deactivateReminder(id);
        return ResponseEntity.ok(new ApiResponse(true, "Reminder deactivated"));
    }
}
