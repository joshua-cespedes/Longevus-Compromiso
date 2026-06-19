package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.ProductCondition;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IProductConditionRepository extends JpaRepository<ProductCondition, Integer> {
    List<ProductCondition> findByProductIdAndIsActiveTrue(int productId);
    List<ProductCondition> findByConditionIdAndIsActiveTrue(int conditionId);
}
