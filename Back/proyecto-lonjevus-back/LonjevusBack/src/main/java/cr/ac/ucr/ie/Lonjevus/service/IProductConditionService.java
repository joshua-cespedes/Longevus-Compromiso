package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.ProductCondition;
import java.util.List;

public interface IProductConditionService {
    void save(ProductCondition productCondition);
    List<ProductCondition> getByProductId(int productId);
    List<ProductCondition> getByConditionId(int conditionId);
    void delete(int id);
    ProductCondition getById(int id);
}
