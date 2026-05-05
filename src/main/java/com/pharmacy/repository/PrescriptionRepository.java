package com.pharmacy.repository;

import com.pharmacy.enums.PrescriptionStatus;
import com.pharmacy.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByUserId(Long userId);
    List<Prescription> findByStatus(PrescriptionStatus status);
    List<Prescription> findByUserIdAndStatus(Long userId, PrescriptionStatus status);
}
