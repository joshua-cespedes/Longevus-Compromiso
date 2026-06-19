package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.InventoryMovement;
import cr.ac.ucr.ie.Lonjevus.service.IInventoryPredictionService;
import java.time.LocalDate;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryPredictionController {

    @Autowired
    private IInventoryPredictionService predictionService;

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/prioritized")
    public Map<String, Object> getPrioritizedProducts() {
        return Collections.singletonMap("products", predictionService.getPrioritizedProducts());
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/prediction/{productId}")
    public Map<String, Object> getPrediction(
            @PathVariable int productId,
            @RequestParam(defaultValue = "30") int futureDays) {
        return predictionService.predictDemand(productId, futureDays);
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/alerts")
    public Map<String, Object> getAlerts() {
        return Collections.singletonMap("alerts", predictionService.getActiveAlerts());
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_DELETE')")
    @PostMapping("/exit")
    public Map<String, Object> recordExit(@RequestBody Map<String, Object> request) {
        int inventoryId = (Integer) request.get("inventoryId");
        String reason = (String) request.getOrDefault("reason", "Consumo");
        int performedBy = (Integer) request.getOrDefault("performedBy", 0);
        predictionService.recordExit(inventoryId, reason, performedBy);
        return Collections.singletonMap("success", true);
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_DELETE')")
    @PostMapping("/bulk-exit")
    public Map<String, Object> recordBulkExit(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Number> inventoryIds = (List<Number>) request.get("inventoryIds");
        String reason = (String) request.getOrDefault("reason", "Consumo");
        int performedBy = (Integer) request.getOrDefault("performedBy", 0);
        List<Integer> ids = new ArrayList<>();
        for (Number n : inventoryIds) {
            ids.add(n.intValue());
        }
        predictionService.recordBulkExit(ids, reason, performedBy);
        return Collections.singletonMap("success", true);
    }

    @PreAuthorize("hasAuthority('PERMISSION_INVENTARIO_VIEW')")
    @GetMapping("/movements")
    public Map<String, Object> getMovements(
            @RequestParam(required = false) Integer productId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        if (productId != null) {
            return Collections.singletonMap("movements", predictionService.getMovementsByProduct(productId));
        }
        if (startDate != null && endDate != null) {
            return Collections.singletonMap("movements",
                predictionService.getMovementsByDateRange(LocalDate.parse(startDate), LocalDate.parse(endDate)));
        }
        return Collections.singletonMap("movements", Collections.emptyList());
    }
}
