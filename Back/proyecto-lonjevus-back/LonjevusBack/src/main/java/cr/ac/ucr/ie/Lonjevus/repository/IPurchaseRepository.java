package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPurchaseRepository extends JpaRepository<Purchase, String> {

    List<Purchase> findByIsActiveTrue();
    List<Purchase> findByIsActiveFalse();

}
