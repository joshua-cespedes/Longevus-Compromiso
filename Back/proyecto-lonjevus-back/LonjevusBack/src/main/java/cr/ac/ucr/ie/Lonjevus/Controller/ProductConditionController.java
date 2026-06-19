package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Condition;
import cr.ac.ucr.ie.Lonjevus.domain.Product;
import cr.ac.ucr.ie.Lonjevus.domain.ProductCondition;
import cr.ac.ucr.ie.Lonjevus.service.IConditionService;
import cr.ac.ucr.ie.Lonjevus.service.IProductConditionService;
import cr.ac.ucr.ie.Lonjevus.service.IProductService;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product-conditions")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductConditionController {

    @Autowired
    private IProductConditionService service;

    @Autowired
    private IProductService productService;

    @Autowired
    private IConditionService conditionService;

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/all")
    public Map<String, Object> getAll() {
        List<ProductCondition> all = new ArrayList<>();
        List<Product> products = productService.getAllProducts();
        for (Product p : products) {
            all.addAll(service.getByProductId(p.getId()));
        }
        return Collections.singletonMap("productConditions", all);
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/byProduct")
    public Map<String, Object> getByProduct(@RequestParam int productId) {
        return Collections.singletonMap("productConditions", service.getByProductId(productId));
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/byCondition")
    public Map<String, Object> getByCondition(@RequestParam int conditionId) {
        return Collections.singletonMap("productConditions", service.getByConditionId(conditionId));
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_CREATE')")
    @PostMapping("/save")
    public Map<String, Object> save(@RequestBody ProductCondition pc) {
        Product product = productService.getById(pc.getProduct().getId());
        Condition condition = conditionService.getById(pc.getCondition().getId());
        if (product == null || condition == null) {
            throw new RuntimeException("Producto o condicion no encontrado.");
        }
        pc.setProduct(product);
        pc.setCondition(condition);
        pc.setIsActive(true);
        service.save(pc);
        return Collections.singletonMap("success", true);
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_DELETE')")
    @DeleteMapping("/delete")
    public Map<String, Object> delete(@RequestParam int id) {
        service.delete(id);
        return Collections.singletonMap("success", true);
    }
}
