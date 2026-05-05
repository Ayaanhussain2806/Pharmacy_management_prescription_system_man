package com.pharmacy.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "refill_reminders")
public class RefillReminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long medicineId;

    private String medicineName;

    @Column(nullable = false)
    private Integer intervalDays;

    @Column(nullable = false)
    private LocalDate nextReminderDate;

    private boolean active = true;

    public RefillReminder() {}

    public RefillReminder(Long userId, Long medicineId, String medicineName, Integer intervalDays, LocalDate nextReminderDate) {
        this.userId = userId;
        this.medicineId = medicineId;
        this.medicineName = medicineName;
        this.intervalDays = intervalDays;
        this.nextReminderDate = nextReminderDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getMedicineId() { return medicineId; }
    public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }
    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
    public Integer getIntervalDays() { return intervalDays; }
    public void setIntervalDays(Integer intervalDays) { this.intervalDays = intervalDays; }
    public LocalDate getNextReminderDate() { return nextReminderDate; }
    public void setNextReminderDate(LocalDate nextReminderDate) { this.nextReminderDate = nextReminderDate; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
