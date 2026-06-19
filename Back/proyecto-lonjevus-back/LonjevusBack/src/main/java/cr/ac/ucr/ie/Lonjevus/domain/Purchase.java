package cr.ac.ucr.ie.Lonjevus.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase")
public class Purchase {

    @Id
    private String id;

    private LocalDate date;

    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idAdministrator")
    private Admin admin;

    private boolean isActive;

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("purchase-items")
    private List<PurchaseProduct> items = new ArrayList<>();

    public Purchase() {
    }

    public Purchase(String id, LocalDate date, BigDecimal amount, Admin admin, boolean isActive) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.admin = admin;
        this.isActive = isActive;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public List<PurchaseProduct> getItems() {
        return items;
    }

    public void setItems(List<PurchaseProduct> items) {
        this.items = items;
    }

    public void addItem(PurchaseProduct item) {
        item.setPurchase(this);
        this.items.add(item);
    }

    public void clearItems() {
        for (PurchaseProduct item : this.items) {
            item.setPurchase(null);
        }
        this.items.clear();
    }
}
