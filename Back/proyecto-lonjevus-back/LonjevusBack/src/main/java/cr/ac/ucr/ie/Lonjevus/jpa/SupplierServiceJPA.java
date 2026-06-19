
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.repository.ISupplierRepository;
import cr.ac.ucr.ie.Lonjevus.domain.Supplier;
import cr.ac.ucr.ie.Lonjevus.service.ISupplierService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/*
 *
 * @author Usuario
 */
@Service
public class SupplierServiceJPA implements ISupplierService {
    
    @Autowired
    private ISupplierRepository repo;

    @Override
    public void save(Supplier supplier) {
       repo.save(supplier);
    }

    @Override
    public List<Supplier> getAllSuppliers() {
       return repo.findByIsActive(true);
    }

    @Override
    public void delete(int supplierId) {
        repo.deleteById(supplierId);
    }

    @Override
    public Supplier getById(int supplierId) {
       return repo.findById(supplierId).get();
    }
    
    
}
