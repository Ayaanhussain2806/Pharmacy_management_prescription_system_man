package com.pharmacy.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brandName;

    private String genericName;

    private String category;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    private String symptoms;

    private String imageUrl;

    private boolean prescriptionRequired;

    private String substituteIds;

    private String manufacturer;

    private String dosage;

    public Medicine() {}

    public Medicine(String brandName, String genericName, String category, String description,
                    BigDecimal price, Integer stock, String symptoms, boolean prescriptionRequired,
                    String manufacturer, String dosage) {
        this.brandName = brandName;
        this.genericName = genericName;
        this.category = category;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.symptoms = symptoms;
        this.prescriptionRequired = prescriptionRequired;
        this.manufacturer = manufacturer;
        this.dosage = dosage;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }
    public String getGenericName() { return genericName; }
    public void setGenericName(String genericName) { this.genericName = genericName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isPrescriptionRequired() { return prescriptionRequired; }
    public void setPrescriptionRequired(boolean prescriptionRequired) { this.prescriptionRequired = prescriptionRequired; }
    public String getSubstituteIds() { return substituteIds; }
    public void setSubstituteIds(String substituteIds) { this.substituteIds = substituteIds; }
    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
}
