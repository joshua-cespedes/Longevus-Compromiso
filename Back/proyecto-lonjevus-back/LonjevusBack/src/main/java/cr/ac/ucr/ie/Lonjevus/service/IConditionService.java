package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Condition;
import java.util.List;

public interface IConditionService {
    void save(Condition condition);
    List<Condition> getAll();
    void delete(int conditionId);
    Condition getById(int conditionId);
}
