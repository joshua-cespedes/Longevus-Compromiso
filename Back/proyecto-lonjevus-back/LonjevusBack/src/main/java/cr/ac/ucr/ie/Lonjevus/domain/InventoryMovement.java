package cr.ac.ucr.ie.Lonjevus.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "inventory_movement")
public class InventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inventoryId", nullable = false)
    @JsonIgnoreProperties({"purchase"})
    private Inventory inventory;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "productId", nullable = false)
    @JsonIgnoreProperties({"supplier"})
    private Product product;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    private String reason;

    @Column(name = "performedBy")
    private Integer performedBy;

    @Column(name = "movementDate", nullable = false)
    @CreationTimestamp
    private LocalDateTime movementDate;

    public InventoryMovement() {}

    public InventoryMovement(Integer id, Inventory inventory, Product product, String type, Integer quantity, String reason, Integer performedBy, LocalDateTime movementDate) {
        this.id = id;
        this.inventory = inventory;
        this.product = product;
        this.type = type;
        this.quantity = quantity;
        this.reason = reason;
        this.performedBy = performedBy;
        this.movementDate = movementDate;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Inventory getInventory() { return inventory; }
    public void setInventory(Inventory inventory) { this.inventory = inventory; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Integer getPerformedBy() { return performedBy; }
    public void setPerformedBy(Integer performedBy) { this.performedBy = performedBy; }

    public LocalDateTime getMovementDate() { return movementDate; }
    public void setMovementDate(LocalDateTime movementDate) { this.movementDate = movementDate; }
}
