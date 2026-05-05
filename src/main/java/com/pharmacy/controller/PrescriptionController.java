package com.pharmacy.controller;

import com.pharmacy.dto.ApiResponse;
import com.pharmacy.model.Prescription;
import com.pharmacy.model.User;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.OcrService;
import com.pharmacy.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private OcrService ocrService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPrescription(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String doctorName,
            @RequestParam(required = false) String doctorLicense,
            @RequestParam(required = false) String patientName) throws IOException {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Prescription prescription = prescriptionService.uploadPrescription(
                user.getId(), file, doctorName, doctorLicense, patientName);

        return ResponseEntity.ok(new ApiResponse(true, "Prescription uploaded successfully", prescription));
    }

    @GetMapping
    public ResponseEntity<List<Prescription>> getUserPrescriptions(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(prescriptionService.getUserPrescriptions(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescription(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionById(id));
    }

    @PostMapping("/{id}/ocr")
    public ResponseEntity<?> runOcr(@PathVariable Long id) {
        Prescription prescription = prescriptionService.getPrescriptionById(id);
        Map<String, Object> ocrResult = ocrService.extractText(prescription.getFilePath());

        String extractedText = (String) ocrResult.get("extractedText");
        prescriptionService.updateExtractedText(id, extractedText);

        return ResponseEntity.ok(new ApiResponse(true, "OCR completed", ocrResult));
    }
}
