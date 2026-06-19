
package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.Supplier;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ISupplierRepository extends JpaRepository<Supplier,Integer> {
    List<Supplier> findByIsActive(boolean isActive);
}
