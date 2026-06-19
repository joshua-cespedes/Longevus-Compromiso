package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Condition;
import cr.ac.ucr.ie.Lonjevus.service.IConditionService;
import java.util.Collections;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conditions")
@CrossOrigin(origins = "http://localhost:5173")
public class ConditionController {

    @Autowired
    private IConditionService service;

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/all")
    public Map<String, Object> getAll() {
        return Collections.singletonMap("conditions", service.getAll());
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_CREATE')")
    @PostMapping("/save")
    public Map<String, Object> save(@RequestBody Condition condition) {
        condition.setIsActive(true);
        service.save(condition);
        return getAll();
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_UPDATE')")
    @PutMapping("/update")
    public Map<String, Object> update(@RequestBody Condition condition) {
        service.save(condition);
        return getAll();
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_DELETE')")
    @DeleteMapping("/delete")
    public Map<String, Object> delete(@RequestParam int id) {
        service.delete(id);
        return getAll();
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/getById")
    public Condition getById(@RequestParam int id) {
        return service.getById(id);
    }
}
