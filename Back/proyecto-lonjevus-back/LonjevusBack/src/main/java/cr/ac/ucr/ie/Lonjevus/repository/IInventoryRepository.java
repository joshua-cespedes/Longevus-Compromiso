package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.Inventory;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IInventoryRepository extends JpaRepository<Inventory, Integer> {
    
    List<Inventory> findByProduct_ExpirationDate(LocalDate expirationDate);
    List<Inventory> findByPurchaseId(String purchaseId);
    boolean existsByProductIdAndPurchaseId(Integer productId, String purchaseId);

}
