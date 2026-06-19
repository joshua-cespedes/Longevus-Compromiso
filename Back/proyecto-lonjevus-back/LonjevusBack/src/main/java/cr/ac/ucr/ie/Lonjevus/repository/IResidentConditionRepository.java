package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.ResidentCondition;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IResidentConditionRepository extends JpaRepository<ResidentCondition, Integer> {
    List<ResidentCondition> findByResidentIdAndIsActiveTrue(int residentId);
    List<ResidentCondition> findByConditionIdAndIsActiveTrue(int conditionId);
    long countByConditionIdAndIsActiveTrue(int conditionId);

    @Query("SELECT rc.condition.id, COUNT(rc) FROM ResidentCondition rc WHERE rc.isActive = true GROUP BY rc.condition.id")
    List<Object[]> countResidentsByCondition();

    @Query("SELECT rc.resident.id FROM ResidentCondition rc WHERE rc.condition.id = :conditionId AND rc.isActive = true")
    List<Integer> findResidentIdsByConditionId(@Param("conditionId") int conditionId);
}
