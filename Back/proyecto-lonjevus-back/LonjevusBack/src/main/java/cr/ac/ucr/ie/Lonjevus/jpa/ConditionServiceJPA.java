package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Condition;
import cr.ac.ucr.ie.Lonjevus.repository.IConditionRepository;
import cr.ac.ucr.ie.Lonjevus.service.IConditionService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConditionServiceJPA implements IConditionService {

    @Autowired
    private IConditionRepository repository;

    @Override
    public void save(Condition condition) {
        repository.save(condition);
    }

    @Override
    public List<Condition> getAll() {
        return repository.findByIsActiveTrue();
    }

    @Override
    public void delete(int conditionId) {
        repository.deleteById(conditionId);
    }

    @Override
    public Condition getById(int conditionId) {
        return repository.findById(conditionId).orElse(null);
    }
}
