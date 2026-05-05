package com.pharmacy.repository;

import com.pharmacy.model.RefillReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RefillReminderRepository extends JpaRepository<RefillReminder, Long> {
    List<RefillReminder> findByUserId(Long userId);
    List<RefillReminder> findByActiveTrue();
    List<RefillReminder> findByActiveTrueAndNextReminderDateLessThanEqual(LocalDate date);
}
