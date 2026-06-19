package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Purchase;
import cr.ac.ucr.ie.Lonjevus.service.IPurchaseService;
import java.util.LinkedList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author Usuario
 */
@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseController {

    private final IPurchaseService purchaseService;

    @Autowired
    public PurchaseController(IPurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }
    @PreAuthorize("hasAuthority('PERMISSION_COMPRAS_VIEW')")
    @GetMapping("/all")
    public List<Purchase> getAllPurchases() {
        return purchaseService.getAll();
    }
    @PreAuthorize("hasAuthority('PERMISSION_COMPRAS_VIEW')")
    @GetMapping("/inactive")
    public List<Purchase> getInactivePurchases() {
        return purchaseService.getAllInactive();
    }
    @PreAuthorize("hasAuthority('PERMISSION_COMPRAS_CREATE')")
    @PostMapping("/add")
    public ResponseEntity<?> addPurchase(@RequestBody Purchase purchase) {
        try {
            purchaseService.save(purchase);
            return ResponseEntity.ok().body("{\"message\": \"Compra registrada correctamente\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Error al registrar la compra\"}");
        }
    }
    @PreAuthorize("hasAuthority('PERMISSION_COMPRAS_VIEW')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getPurchaseById(@PathVariable String id) {
        try {
            Purchase purchase = purchaseService.findById(id);
            return ResponseEntity.ok(purchase);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Compra no encontrada");
        }
    }
    @PreAuthorize("hasAuthority('PERMISSION_COMPRAS_UPDATE')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePurchase(@PathVariable String id, @RequestBody Purchase purchase) {
        try {
            purchaseService.update(id, purchase);
            return ResponseEntity.ok("Compra actualizada correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al actualizar");
        }
    }
    @PreAuthorize("hasAuthority('PERMISSION_COMPRAS_DELETE')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePurchase(@PathVariable String id) {
        purchaseService.delete(id);
        return ResponseEntity.ok("Compra eliminada correctamente.");
    }

}
