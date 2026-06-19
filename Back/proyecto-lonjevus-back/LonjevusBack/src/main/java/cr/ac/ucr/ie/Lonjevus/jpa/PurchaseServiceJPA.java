package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Inventory;
import cr.ac.ucr.ie.Lonjevus.domain.Product;
import cr.ac.ucr.ie.Lonjevus.domain.Purchase;
import cr.ac.ucr.ie.Lonjevus.domain.PurchaseProduct;
import cr.ac.ucr.ie.Lonjevus.domain.PurchaseProductId;
import cr.ac.ucr.ie.Lonjevus.repository.IInventoryRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IProductRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IPurchaseRepository;
import cr.ac.ucr.ie.Lonjevus.service.IPurchaseService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PurchaseServiceJPA implements IPurchaseService {

    @Autowired
    private IPurchaseRepository repository;

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private IInventoryRepository inventoryRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Purchase> getAll() {
        List<Purchase> purchases = repository.findByIsActiveTrue();
        setProductPrices(purchases);
        return purchases;
    }

    @Override
    public List<Purchase> getAllInactive() {
        List<Purchase> purchases = repository.findByIsActiveFalse();
        setProductPrices(purchases);
        return purchases;
    }

    @Override
    public Purchase findById(String id) {
        Purchase purchase = repository.findById(id)
                .filter(Purchase::isIsActive)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada o inactiva"));

        if (purchase.getAdmin() != null) {
            purchase.getAdmin().getName(); // para forzar carga
        }

        for (PurchaseProduct item : purchase.getItems()) {
            Integer productId = item.getIdProduct();

            Product product = productRepository.findProductByIdRegardlessOfStatus(productId);
            if (product != null) {
                item.setProduct(product);
                item.setProductName(product.getName());
                item.setPrice(product.getPrice());
            } else {
                Product placeholder = new Product();
                placeholder.setId(productId);
                placeholder.setName("Producto eliminado");
                placeholder.setIsActive(false);
                item.setProduct(placeholder);
                item.setProductName("Producto eliminado");
                item.setPrice(null);
            }
        }

        return purchase;
    }

    @Override
    @Transactional
    public void save(Purchase purchase) {
        String datePart = purchase.getDate().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = repository.count() + 1;
        String newId = String.format("%04d-%s", count, datePart);
        purchase.setId(newId);
        purchase.setIsActive(true);

        for (PurchaseProduct item : purchase.getItems()) {
            item.setPurchase(purchase);
            Integer productId = item.getIdProduct();
            if (productId == null) {
                throw new RuntimeException("Falta idProduct en un item");
            }

            item.setId(new PurchaseProductId(newId, productId));
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            item.setProduct(product);
            item.setProductName(product.getName());
        }

        repository.save(purchase);

        for (PurchaseProduct item : purchase.getItems()) {
            Product product = item.getProduct();

            for (int i = 0; i < item.getQuantity(); i++) {
                Inventory inv = new Inventory();
                inv.setProductId(product.getId());
                inv.setExpirationDate(item.getExpirationDate());
                inv.setProduct(product);
                inv.setQuantity(1);
                inv.setIsActive(true);
                inv.setCategory(product.getCategory());
                inv.setPhotoURL(product.getPhotoURL());
                inv.setPurchase(purchase);
                inventoryRepository.save(inv);
            }
        }
    }

    @Override
    @Transactional
    public void update(String id, Purchase updatedPurchase) {
        Purchase existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada"));

        //Todos los productos originales todavía estén en inventario
        for (PurchaseProduct oldItem : existing.getItems()) {
            Integer productId = oldItem.getIdProduct();
            boolean exists = inventoryRepository.existsByProductIdAndPurchaseId(productId, id);
            if (!exists) {
                throw new RuntimeException("No se puede editar la compra. El producto con ID " + productId + " ya no está en inventario.");
            }
        }

        existing.setDate(updatedPurchase.getDate());
        existing.setAmount(updatedPurchase.getAmount());

        // Eliminar inventario
        List<Inventory> oldInventory = inventoryRepository.findByPurchaseId(id);
        for (Inventory inv : oldInventory) {
            inventoryRepository.delete(inv);
        }

        // Eliminar productos antiguos
        existing.getItems().clear();
        entityManager.flush();

        // Agregar nuevos productos
        for (PurchaseProduct item : updatedPurchase.getItems()) {
            Integer productId = item.getIdProduct();
            if (productId == null) {
                throw new RuntimeException("Falta idProduct en un item");
            }

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + productId));

            PurchaseProduct nuevoItem = new PurchaseProduct();
            nuevoItem.setPurchase(existing);
            nuevoItem.setProduct(product);
            nuevoItem.setQuantity(item.getQuantity());
            nuevoItem.setExpirationDate(item.getExpirationDate());
            nuevoItem.setProductName(product.getName());

            existing.addItem(nuevoItem);

            for (int i = 0; i < item.getQuantity(); i++) {
                Inventory inv = new Inventory();
                inv.setProduct(product);
                inv.setProductId(product.getId());
                inv.setQuantity(1);
                inv.setIsActive(true);
                inv.setCategory(product.getCategory());
                inv.setPhotoURL(product.getPhotoURL());
                inv.setPurchase(existing);
                inv.setExpirationDate(item.getExpirationDate());
                inventoryRepository.save(inv);
            }
        }

        repository.save(existing);
    }

    @Override
    @Transactional
    public void delete(String id) {
        Purchase purchase = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada"));
        purchase.setIsActive(false);
        repository.save(purchase);
    }

    private void setProductPrices(List<Purchase> purchases) {
        for (Purchase purchase : purchases) {
            for (PurchaseProduct item : purchase.getItems()) {
                Integer productId = item.getIdProduct();

                Product product = productRepository.findProductByIdRegardlessOfStatus(productId);
                if (product != null) {
                    item.setProduct(product);
                    item.setProductName(product.getName());
                    item.setPrice(product.getPrice());
                } else {
                    Product placeholder = new Product();
                    placeholder.setId(productId);
                    placeholder.setName("Producto eliminado");
                    placeholder.setIsActive(false);
                    item.setProduct(placeholder);
                    item.setProductName("Producto eliminado");
                    item.setPrice(null);
                }
            }
        }
    }

}
