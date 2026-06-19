/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
        
import org.hibernate.annotations.SQLDelete;

@Entity
@Table(name="product")
@SQLDelete(sql = "UPDATE product SET isActive = 0 WHERE id = ?")
@FilterDef(name = "activeProductFilter", parameters = @ParamDef(name = "isActive", type = Boolean.class))
@Filter(name = "activeProductFilter", condition = "is_active = :isActive")
public class Product {
    
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String name;
    private BigDecimal price;
    private String category;
    private LocalDate expirationDate;
    private String photoURL;
    @Column(name = "isActive")
    private boolean isActive;
    
    @ManyToOne
    @JoinColumn(name = "unitId", nullable = false)
    private Unit unit;
    
    @ManyToOne
    @JoinColumn(name = "supplierId", nullable = false)
    private Supplier supplier;

    public Product() {}

    public Product(Integer id, String name, BigDecimal price, String category, LocalDate expirationDate, String photoURL, Unit unit, Supplier supplier,boolean isActive) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.expirationDate = expirationDate;
        this.photoURL = photoURL;
        this.unit = unit;
        this.supplier = supplier;
        this.isActive=isActive;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public String getPhotoURL() {
        return photoURL;
    }

    public Unit getUnit() {
        return unit;
    }

   public Supplier getSupplier() {
      return supplier;
    }

    public boolean isIsActive() {
        return isActive;
    }
   
    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public void setPhotoURL(String photoURL) {
        this.photoURL = photoURL;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }
    
    

    
    
    
}
