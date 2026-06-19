package cr.ac.ucr.ie.Lonjevus.domain;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PurchaseProductId implements Serializable {

    private String idPurchase;
    private Integer idProduct;

    public PurchaseProductId() {}

    public PurchaseProductId(String idPurchase, Integer idProduct) {
        this.idPurchase = idPurchase;
        this.idProduct = idProduct;
    }

    public String getIdPurchase() {
        return idPurchase;
    }

    public void setIdPurchase(String idPurchase) {
        this.idPurchase = idPurchase;
    }

    public Integer getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(Integer idProduct) {
        this.idProduct = idProduct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PurchaseProductId)) return false;
        PurchaseProductId that = (PurchaseProductId) o;
        return Objects.equals(idPurchase, that.idPurchase) &&
               Objects.equals(idProduct, that.idProduct);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPurchase, idProduct);
    }
}
