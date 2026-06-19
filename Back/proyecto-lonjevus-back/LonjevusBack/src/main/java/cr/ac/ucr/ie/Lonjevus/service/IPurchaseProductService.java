package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.PurchaseProduct;
import cr.ac.ucr.ie.Lonjevus.domain.PurchaseProductId;
import java.util.List;

public interface IPurchaseProductService {

    List<PurchaseProduct> getAll();
    PurchaseProduct findById(PurchaseProductId id);
    void save(PurchaseProduct purchaseProduct);
    void deleteById(PurchaseProductId id);
}
