package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.InventoryMovement;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IInventoryPredictionService {
    void recordExit(int inventoryId, String reason, int performedBy);
    void recordBulkExit(List<Integer> inventoryIds, String reason, int performedBy);
    List<InventoryMovement> getMovementsByProduct(int productId);
    List<InventoryMovement> getMovementsByDateRange(LocalDate start, LocalDate end);
    Map<String, Object> predictDemand(int productId, int futureDays);
    List<Map<String, Object>> getPrioritizedProducts();
    List<Map<String, Object>> getActiveAlerts();
}
