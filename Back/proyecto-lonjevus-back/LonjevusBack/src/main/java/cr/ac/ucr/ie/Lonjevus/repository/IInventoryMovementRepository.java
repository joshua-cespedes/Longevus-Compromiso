package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.InventoryMovement;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IInventoryMovementRepository extends JpaRepository<InventoryMovement, Integer> {

    List<InventoryMovement> findByProductIdOrderByMovementDateDesc(int productId);

    List<InventoryMovement> findByTypeAndMovementDateBetween(String type, LocalDateTime start, LocalDateTime end);

    @Query("SELECT m FROM InventoryMovement m WHERE m.product.id = :productId AND m.type = 'EXIT' AND m.movementDate >= :since ORDER BY m.movementDate DESC")
    List<InventoryMovement> findExitsByProductSince(@Param("productId") int productId, @Param("since") LocalDateTime since);

    @Query("SELECT m.product.id, COUNT(m) FROM InventoryMovement m WHERE m.type = 'EXIT' AND m.movementDate >= :since GROUP BY m.product.id ORDER BY COUNT(m) DESC")
    List<Object[]> countExitsByProductSince(@Param("since") LocalDateTime since);
}
