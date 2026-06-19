package cr.ac.ucr.ie.Lonjevus.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "product_condition")
@SQLDelete(sql = "UPDATE product_condition SET isActive = 0 WHERE id = ?")
@Where(clause = "isActive = 1")
public class ProductCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "productId", nullable = false)
    @JsonIgnoreProperties({"supplier"})
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "conditionId", nullable = false)
    private Condition condition;

    @Column(name = "relationshipType")
    private String relationshipType;

    private String notes;

    @Column(name = "isActive")
    private boolean isActive;

    public ProductCondition() {}

    public ProductCondition(Integer id, Product product, Condition condition, String relationshipType, String notes, boolean isActive) {
        this.id = id;
        this.product = product;
        this.condition = condition;
        this.relationshipType = relationshipType;
        this.notes = notes;
        this.isActive = isActive;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Condition getCondition() { return condition; }
    public void setCondition(Condition condition) { this.condition = condition; }

    public String getRelationshipType() { return relationshipType; }
    public void setRelationshipType(String relationshipType) { this.relationshipType = relationshipType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public boolean isIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }
}
