package com.pharmacy.seed;

import com.pharmacy.enums.Role;
import com.pharmacy.model.Medicine;
import com.pharmacy.model.User;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedMedicines();
        logger.info("✅ Sample data seeded successfully!");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        String encodedPassword = passwordEncoder.encode("password123");

        List<User> users = Arrays.asList(
            createUser("John Patient", "patient@demo.com", encodedPassword, "9876543210", Role.CUSTOMER, "123 Health Street, Mumbai"),
            createUser("Dr. Sarah Pharmacist", "pharmacist@demo.com", encodedPassword, "9876543211", Role.PHARMACIST, "MedPlus Pharmacy, Delhi"),
            createUser("Raj Delivery", "delivery@demo.com", encodedPassword, "9876543212", Role.DELIVERY_AGENT, "Delivery Hub, Mumbai"),
            createUser("Priya Sharma", "priya@demo.com", encodedPassword, "9876543213", Role.CUSTOMER, "456 Wellness Road, Bangalore"),
            createUser("Amit Driver", "amit@demo.com", encodedPassword, "9876543214", Role.DELIVERY_AGENT, "Delivery Hub 2, Delhi")
        );

        userRepository.saveAll(users);
        logger.info("Seeded {} users", users.size());
    }

    private User createUser(String name, String email, String password, String phone, Role role, String address) {
        User user = new User(name, email, password, phone, role);
        user.setAddress(address);
        return user;
    }

    private void seedMedicines() {
        if (medicineRepository.count() > 0) return;

        List<Medicine> medicines = Arrays.asList(
            createMedicine("Paracetamol 500mg", "Paracetamol", "Pain Relief", "Used for fever and mild to moderate pain relief", new BigDecimal("25.00"), 500, "fever,headache,body pain,cold", false, "Cipla", "500mg tablet", null),
            createMedicine("Dolo 650", "Paracetamol", "Pain Relief", "Effective for fever and pain relief, higher dose", new BigDecimal("35.00"), 350, "fever,headache,body pain", false, "Micro Labs", "650mg tablet", "1"),
            createMedicine("Crocin Advance", "Paracetamol", "Pain Relief", "Fast-acting fever and pain relief tablets", new BigDecimal("40.00"), 200, "fever,headache,pain", false, "GSK", "500mg tablet", "1,2"),
            createMedicine("Ibuprofen 400mg", "Ibuprofen", "Anti-inflammatory", "Non-steroidal anti-inflammatory drug for pain and inflammation", new BigDecimal("45.00"), 300, "pain,inflammation,arthritis,headache", false, "Cipla", "400mg tablet", null),
            createMedicine("Combiflam", "Ibuprofen+Paracetamol", "Pain Relief", "Combination of ibuprofen and paracetamol for fast pain relief", new BigDecimal("55.00"), 250, "pain,headache,toothache,body pain", false, "Sanofi", "400mg+325mg tablet", null),
            createMedicine("Amoxicillin 250mg", "Amoxicillin", "Antibiotic", "Broad-spectrum antibiotic for bacterial infections", new BigDecimal("85.00"), 150, "infection,throat infection,ear infection,pneumonia", true, "Cipla", "250mg capsule", null),
            createMedicine("Azithromycin 500mg", "Azithromycin", "Antibiotic", "Macrolide antibiotic for respiratory and skin infections", new BigDecimal("120.00"), 100, "infection,respiratory infection,skin infection", true, "Sun Pharma", "500mg tablet", null),
            createMedicine("Metformin 500mg", "Metformin", "Diabetes", "First-line medication for type 2 diabetes management", new BigDecimal("30.00"), 400, "diabetes,blood sugar,type 2 diabetes", true, "USV", "500mg tablet", null),
            createMedicine("Atorvastatin 10mg", "Atorvastatin", "Cholesterol", "Statin medication to lower cholesterol levels", new BigDecimal("65.00"), 200, "cholesterol,heart disease,lipids", true, "Ranbaxy", "10mg tablet", null),
            createMedicine("Omeprazole 20mg", "Omeprazole", "Gastric", "Proton pump inhibitor for acid reflux and ulcers", new BigDecimal("50.00"), 250, "acidity,acid reflux,ulcer,heartburn", true, "Dr Reddy's", "20mg capsule", null),
            createMedicine("Pantoprazole 40mg", "Pantoprazole", "Gastric", "Proton pump inhibitor for GERD and gastric ulcers", new BigDecimal("75.00"), 180, "acidity,GERD,ulcer,heartburn", true, "Sun Pharma", "40mg tablet", "10"),
            createMedicine("Cetirizine 10mg", "Cetirizine", "Allergy", "Antihistamine for allergies, hay fever, and hives", new BigDecimal("20.00"), 400, "allergy,sneezing,runny nose,hives,itching", false, "Dr Reddy's", "10mg tablet", null),
            createMedicine("Allegra 120mg", "Fexofenadine", "Allergy", "Non-drowsy antihistamine for allergic rhinitis", new BigDecimal("95.00"), 150, "allergy,sneezing,rhinitis,hives", false, "Sanofi", "120mg tablet", null),
            createMedicine("Vitamin C 500mg", "Ascorbic Acid", "Vitamins", "Immunity booster and antioxidant supplement", new BigDecimal("120.00"), 300, "immunity,cold,vitamin deficiency,antioxidant", false, "Limcee", "500mg chewable", null),
            createMedicine("Vitamin D3 60K", "Cholecalciferol", "Vitamins", "Weekly vitamin D supplement for bone health", new BigDecimal("35.00"), 200, "vitamin D deficiency,bone health,calcium absorption", false, "USV", "60000 IU capsule", null),
            createMedicine("B-Complex Forte", "Vitamin B Complex", "Vitamins", "Essential B vitamins for energy and nerve function", new BigDecimal("45.00"), 250, "fatigue,nerve health,vitamin B deficiency,energy", false, "Abbott", "Tablet", null),
            createMedicine("ORS Sachets", "Oral Rehydration Salts", "General", "Electrolyte replacement for dehydration", new BigDecimal("15.00"), 500, "dehydration,diarrhea,vomiting,electrolyte", false, "WHO", "Sachet", null),
            createMedicine("Betadine Solution", "Povidone-Iodine", "First Aid", "Antiseptic solution for wound cleaning", new BigDecimal("80.00"), 150, "wound,antiseptic,infection prevention,cuts", false, "Win-Medicare", "100ml solution", null),
            createMedicine("Cough Syrup", "Dextromethorphan", "Cough & Cold", "Relief from dry and productive cough", new BigDecimal("65.00"), 200, "cough,cold,throat irritation,congestion", false, "Cipla", "100ml syrup", null),
            createMedicine("Insulin Glargine", "Insulin Glargine", "Diabetes", "Long-acting insulin for diabetes management", new BigDecimal("450.00"), 50, "diabetes,blood sugar,insulin,type 1 diabetes", true, "Sanofi", "3ml cartridge", null),
            createMedicine("Amlodipine 5mg", "Amlodipine", "Blood Pressure", "Calcium channel blocker for hypertension", new BigDecimal("40.00"), 300, "blood pressure,hypertension,angina", true, "Cipla", "5mg tablet", null),
            createMedicine("Losartan 50mg", "Losartan", "Blood Pressure", "ARB medication for high blood pressure", new BigDecimal("55.00"), 200, "blood pressure,hypertension,kidney protection", true, "Torrent", "50mg tablet", null),
            createMedicine("Hand Sanitizer", "Ethanol-based", "Hygiene", "Kills 99.9% of germs, travel-size sanitizer", new BigDecimal("60.00"), 400, "hygiene,sanitizer,germ protection", false, "Dettol", "200ml gel", null),
            createMedicine("N95 Face Mask", "N95 Respirator", "Safety", "High-filtration face mask for protection", new BigDecimal("25.00"), 1000, "mask,protection,air filtration,safety", false, "3M", "Pack of 5", null),
            createMedicine("Digital Thermometer", "Electronic Thermometer", "Devices", "Accurate digital body temperature measurement", new BigDecimal("150.00"), 100, "thermometer,fever,temperature,monitoring", false, "Omron", "1 unit", null)
        );

        medicineRepository.saveAll(medicines);
        logger.info("Seeded {} medicines", medicines.size());
    }

    private Medicine createMedicine(String brandName, String genericName, String category, String description,
                                     BigDecimal price, int stock, String symptoms, boolean prescriptionRequired,
                                     String manufacturer, String dosage, String substituteIds) {
        Medicine m = new Medicine(brandName, genericName, category, description, price, stock, symptoms,
                prescriptionRequired, manufacturer, dosage);
        m.setSubstituteIds(substituteIds);
        return m;
    }
}
