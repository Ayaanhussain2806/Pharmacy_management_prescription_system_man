package com.pharmacy.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartItemResponse {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private String genericName;
    private BigDecimal price;
    private Integer quantity;
    private Integer availableStock;
    private boolean prescriptionRequired;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMedicineId() { return medicineId; }
    public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }
    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
    public String getGenericName() { return genericName; }
    public void setGenericName(String genericName) { this.genericName = genericName; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getAvailableStock() { return availableStock; }
    public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }
    public boolean isPrescriptionRequired() { return prescriptionRequired; }
    public void setPrescriptionRequired(boolean prescriptionRequired) { this.prescriptionRequired = prescriptionRequired; }
}
