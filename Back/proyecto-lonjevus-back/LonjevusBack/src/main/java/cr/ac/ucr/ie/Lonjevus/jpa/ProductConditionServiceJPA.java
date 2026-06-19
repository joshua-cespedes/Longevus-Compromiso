package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.ProductCondition;
import cr.ac.ucr.ie.Lonjevus.repository.IProductConditionRepository;
import cr.ac.ucr.ie.Lonjevus.service.IProductConditionService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductConditionServiceJPA implements IProductConditionService {

    @Autowired
    private IProductConditionRepository repository;

    @Override
    public void save(ProductCondition productCondition) {
        repository.save(productCondition);
    }

    @Override
    public List<ProductCondition> getByProductId(int productId) {
        return repository.findByProductIdAndIsActiveTrue(productId);
    }

    @Override
    public List<ProductCondition> getByConditionId(int conditionId) {
        return repository.findByConditionIdAndIsActiveTrue(conditionId);
    }

    @Override
    public void delete(int id) {
        repository.deleteById(id);
    }

    @Override
    public ProductCondition getById(int id) {
        return repository.findById(id).orElse(null);
    }
}
