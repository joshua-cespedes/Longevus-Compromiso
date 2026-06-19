package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.Condition;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IConditionRepository extends JpaRepository<Condition, Integer> {
    List<Condition> findByIsActiveTrue();
    Condition findByNameAndIsActiveTrue(String name);
}
