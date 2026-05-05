package com.pharmacy.controller;

import com.pharmacy.model.Medicine;
import com.pharmacy.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchMedicines(@RequestParam String q) {
        return ResponseEntity.ok(medicineService.searchMedicines(q));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Medicine>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(medicineService.getMedicinesByCategory(category));
    }

    @GetMapping("/otc")
    public ResponseEntity<List<Medicine>> getOtcMedicines() {
        return ResponseEntity.ok(medicineService.getOtcMedicines());
    }

    @GetMapping("/{id}/substitutes")
    public ResponseEntity<List<Medicine>> getSubstitutes(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getSubstitutes(id));
    }
}
