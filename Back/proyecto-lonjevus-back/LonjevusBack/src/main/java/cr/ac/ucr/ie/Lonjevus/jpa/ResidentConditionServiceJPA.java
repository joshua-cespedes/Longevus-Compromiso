package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.ResidentCondition;
import cr.ac.ucr.ie.Lonjevus.repository.IResidentConditionRepository;
import cr.ac.ucr.ie.Lonjevus.service.IResidentConditionService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResidentConditionServiceJPA implements IResidentConditionService {

    @Autowired
    private IResidentConditionRepository repository;

    @Override
    public void save(ResidentCondition residentCondition) {
        repository.save(residentCondition);
    }

    @Override
    public List<ResidentCondition> getByResidentId(int residentId) {
        return repository.findByResidentIdAndIsActiveTrue(residentId);
    }

    @Override
    public List<ResidentCondition> getByConditionId(int conditionId) {
        return repository.findByConditionIdAndIsActiveTrue(conditionId);
    }

    @Override
    public void delete(int id) {
        repository.deleteById(id);
    }

    @Override
    public ResidentCondition getById(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public long countByConditionId(int conditionId) {
        return repository.countByConditionIdAndIsActiveTrue(conditionId);
    }

    @Override
    public List<Object[]> countResidentsByCondition() {
        return repository.countResidentsByCondition();
    }

    @Override
    public List<Integer> getResidentIdsByConditionId(int conditionId) {
        return repository.findResidentIdsByConditionId(conditionId);
    }
}
