package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Inventory;
import java.time.LocalDate;
import java.util.List;

public interface IInventoryService {
    void save(Inventory inventory);
    List<Inventory> getAll();
    void delete(int inventoryId);
    Inventory getById(int inventoryId);
    List<Inventory> findByExpirationDate(LocalDate expirationDate);
}
