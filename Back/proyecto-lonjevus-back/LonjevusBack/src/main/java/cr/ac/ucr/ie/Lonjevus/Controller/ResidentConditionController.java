package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Condition;
import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import cr.ac.ucr.ie.Lonjevus.domain.ResidentCondition;
import cr.ac.ucr.ie.Lonjevus.service.IConditionService;
import cr.ac.ucr.ie.Lonjevus.service.IResidentConditionService;
import cr.ac.ucr.ie.Lonjevus.service.IResidentService;
import java.time.LocalDate;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resident-conditions")
@CrossOrigin(origins = "http://localhost:5173")
public class ResidentConditionController {

    @Autowired
    private IResidentConditionService service;

    @Autowired
    private IResidentService residentService;

    @Autowired
    private IConditionService conditionService;

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/all")
    public Map<String, Object> getAll() {
        List<ResidentCondition> all = new ArrayList<>();
        List<Resident> residents = residentService.getList();
        for (Resident r : residents) {
            all.addAll(service.getByResidentId(r.getId()));
        }
        return Collections.singletonMap("residentConditions", all);
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/byResident")
    public Map<String, Object> getByResident(@RequestParam int residentId) {
        return Collections.singletonMap("residentConditions", service.getByResidentId(residentId));
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/byCondition")
    public Map<String, Object> getByCondition(@RequestParam int conditionId) {
        return Collections.singletonMap("residentConditions", service.getByConditionId(conditionId));
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_CREATE')")
    @PostMapping("/save")
    public Map<String, Object> save(@RequestBody ResidentCondition rc) {
        Resident resident = residentService.getById(rc.getResident().getId());
        Condition condition = conditionService.getById(rc.getCondition().getId());
        if (resident == null || condition == null) {
            throw new RuntimeException("Residente o condicion no encontrado.");
        }
        rc.setResident(resident);
        rc.setCondition(condition);
        rc.setIsActive(true);
        if (rc.getDiagnosedDate() == null) {
            rc.setDiagnosedDate(LocalDate.now());
        }
        service.save(rc);
        return Collections.singletonMap("success", true);
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_DELETE')")
    @DeleteMapping("/delete")
    public Map<String, Object> delete(@RequestParam int id) {
        service.delete(id);
        return Collections.singletonMap("success", true);
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/countsByCondition")
    public Map<String, Object> getCountsByCondition() {
        List<Object[]> counts = service.countResidentsByCondition();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : counts) {
            Condition cond = conditionService.getById(((Number) row[0]).intValue());
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("conditionId", row[0]);
            item.put("conditionName", cond != null ? cond.getName() : "Desconocido");
            item.put("residentCount", row[1]);
            result.add(item);
        }
        return Collections.singletonMap("counts", result);
    }
}
