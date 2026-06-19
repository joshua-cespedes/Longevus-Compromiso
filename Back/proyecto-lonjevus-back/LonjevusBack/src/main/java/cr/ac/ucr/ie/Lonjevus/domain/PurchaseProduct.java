package cr.ac.ucr.ie.Lonjevus.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
@Table(name = "purchase_product")
public class PurchaseProduct implements Serializable {

    @EmbeddedId
    private PurchaseProductId id;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("idPurchase")
    @JoinColumn(name = "idPurchase")
    @JsonBackReference("purchase-items")
    private Purchase purchase;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("idProduct")
    @JoinColumn(name = "idProduct")
    @JsonBackReference
    @NotFound(action = NotFoundAction.IGNORE)
    private Product product;

    @Column(name = "quantity")
    private Integer quantity;

    @Transient
    private BigDecimal price;

    @Column(name = "expirationDate")
    private LocalDate expirationDate;

    @Transient
    private String productName;

    public PurchaseProduct() {
    }

    public PurchaseProduct(Purchase purchase, Product product, Integer quantity, BigDecimal price, LocalDate expirationDate, String productName) {
        this.purchase = purchase;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.expirationDate = expirationDate;
        this.productName = productName;
        this.id = new PurchaseProductId(purchase.getId(), product.getId());
    }

    public PurchaseProductId getId() {
        return id;
    }

    public void setId(PurchaseProductId id) {
        this.id = id;
    }

    public Purchase getPurchase() {
        return purchase;
    }

    public void setPurchase(Purchase purchase) {
        this.purchase = purchase;
        if (this.id == null) {
            this.id = new PurchaseProductId();
        }
        this.id.setIdPurchase(purchase.getId());
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
        if (this.id == null) {
            this.id = new PurchaseProductId();
        }
        if (product != null && product.getId() != null) {
            this.id.setIdProduct(product.getId());
        }
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    @Transient
    public BigDecimal getPrice() {
        if (this.product != null) {
            return this.product.getPrice();
        }
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getProductName() {
        if (this.productName == null && product != null) {
            return product.getName();
        }
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getIdProduct() {
        return (id != null) ? id.getIdProduct() : null;
    }

    public void setIdProduct(Integer idProduct) {
        if (this.id == null) {
            this.id = new PurchaseProductId();
        }
        this.id.setIdProduct(idProduct);
    }

}
