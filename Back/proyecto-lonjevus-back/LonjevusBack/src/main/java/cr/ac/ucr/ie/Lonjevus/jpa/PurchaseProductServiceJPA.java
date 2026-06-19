package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.PurchaseProduct;
import cr.ac.ucr.ie.Lonjevus.domain.PurchaseProductId;
import cr.ac.ucr.ie.Lonjevus.repository.IPurchaseProductRepository;
import cr.ac.ucr.ie.Lonjevus.service.IPurchaseProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseProductServiceJPA implements IPurchaseProductService {

    @Autowired
    private IPurchaseProductRepository repository;

    @Override
    public List<PurchaseProduct> getAll() {
        return repository.findAll();
    }

    @Override
    public PurchaseProduct findById(PurchaseProductId id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void save(PurchaseProduct purchaseProduct) {
        repository.save(purchaseProduct);
    }

    @Override
    public void deleteById(PurchaseProductId id) {
        repository.deleteById(id);
    }
}
