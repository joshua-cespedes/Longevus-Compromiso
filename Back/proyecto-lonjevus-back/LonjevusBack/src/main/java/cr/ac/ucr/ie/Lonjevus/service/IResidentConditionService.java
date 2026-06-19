package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.ResidentCondition;
import java.util.List;

public interface IResidentConditionService {
    void save(ResidentCondition residentCondition);
    List<ResidentCondition> getByResidentId(int residentId);
    List<ResidentCondition> getByConditionId(int conditionId);
    void delete(int id);
    ResidentCondition getById(int id);
    long countByConditionId(int conditionId);
    List<Object[]> countResidentsByCondition();
    List<Integer> getResidentIdsByConditionId(int conditionId);
}
