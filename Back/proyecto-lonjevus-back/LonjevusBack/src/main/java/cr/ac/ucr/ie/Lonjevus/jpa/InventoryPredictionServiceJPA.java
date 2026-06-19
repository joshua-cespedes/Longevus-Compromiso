package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.*;
import cr.ac.ucr.ie.Lonjevus.repository.*;
import cr.ac.ucr.ie.Lonjevus.service.IInventoryPredictionService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryPredictionServiceJPA implements IInventoryPredictionService {

    @Autowired
    private IInventoryMovementRepository movementRepository;

    @Autowired
    private IInventoryRepository inventoryRepository;

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private IResidentRepository residentRepository;

    @Autowired
    private IProductConditionRepository productConditionRepository;

    @Autowired
    private IResidentConditionRepository residentConditionRepository;

    private static final double ALPHA = 0.3;
    private static final int DEFAULT_WINDOW = 7;
    private static final int DEFAULT_HORIZON_DAYS = 30;

    private static final Map<String, Double> CATEGORY_WEIGHT = Map.of(
        "Salud", 1.0,
        "Alimento", 0.7,
        "Limpieza", 0.4,
        "Otro", 0.2
    );

    private static final Map<String, Double> SEVERITY_WEIGHT = Map.of(
        "Grave", 1.0,
        "Moderada", 0.6,
        "Leve", 0.3
    );

    @Override
    @Transactional
    public void recordExit(int inventoryId, String reason, int performedBy) {
        Inventory inventory = inventoryRepository.findById(inventoryId).orElse(null);
        if (inventory == null) {
            throw new RuntimeException("Inventario con ID " + inventoryId + " no encontrado.");
        }

        Product product = null;
        if (inventory.getProductId() != null) {
            product = productRepository.findProductByIdRegardlessOfStatus(inventory.getProductId());
        }

        InventoryMovement movement = new InventoryMovement();
        movement.setInventory(inventory);
        movement.setProduct(product);
        movement.setType("EXIT");
        movement.setQuantity(1);
        movement.setReason(reason);
        movement.setPerformedBy(performedBy);
        movement.setMovementDate(LocalDateTime.now());

        movementRepository.save(movement);

        inventory.setIsActive(false);
        inventoryRepository.save(inventory);
    }

    @Override
    @Transactional
    public void recordBulkExit(List<Integer> inventoryIds, String reason, int performedBy) {
        for (Integer id : inventoryIds) {
            recordExit(id, reason, performedBy);
        }
    }

    @Override
    public List<InventoryMovement> getMovementsByProduct(int productId) {
        return movementRepository.findByProductIdOrderByMovementDateDesc(productId);
    }

    @Override
    public List<InventoryMovement> getMovementsByDateRange(LocalDate start, LocalDate end) {
        return movementRepository.findByTypeAndMovementDateBetween(
            "EXIT",
            start.atStartOfDay(),
            end.atTime(23, 59, 59)
        );
    }

    @Override
    public Map<String, Object> predictDemand(int productId, int futureDays) {
        Product product = productRepository.findProductByIdRegardlessOfStatus(productId);
        if (product == null) {
            throw new RuntimeException("Producto con ID " + productId + " no encontrado.");
        }

        List<InventoryMovement> exits = movementRepository.findExitsByProductSince(
            productId, LocalDateTime.now().minusDays(90)
        );

        List<Double> dailyConsumption = buildDailyConsumption(exits, 90);

        double movingAverage = calculateMovingAverage(dailyConsumption, DEFAULT_WINDOW);
        double exponentialSmoothing = calculateExponentialSmoothing(dailyConsumption);
        double trend = calculateTrend(dailyConsumption);

        double projectedDaily = (movingAverage + exponentialSmoothing) / 2.0;
        double projectedTotal = projectedDaily * futureDays;

        List<Inventory> currentStock = inventoryRepository.findAll().stream()
            .filter(inv -> inv.getProductId() != null && inv.getProductId() == productId && inv.getIsActive())
            .collect(Collectors.toList());

        int stockActual = currentStock.size();

        boolean riskOfStockout = stockActual < projectedTotal;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("productId", productId);
        result.put("productName", product.getName());
        result.put("category", product.getCategory());
        result.put("stockActual", stockActual);
        result.put("movingAverage", Math.round(movingAverage * 100.0) / 100.0);
        result.put("exponentialSmoothing", Math.round(exponentialSmoothing * 100.0) / 100.0);
        result.put("trend", Math.round(trend * 100.0) / 100.0);
        result.put("projectedDaily", Math.round(projectedDaily * 100.0) / 100.0);
        result.put("projectedTotal", Math.round(projectedTotal * 100.0) / 100.0);
        result.put("horizonDays", futureDays);
        result.put("riskOfStockout", riskOfStockout);
        result.put("daysUntilStockout", stockActual > 0 ? (int)(stockActual / Math.max(projectedDaily, 0.01)) : 0);

        return result;
    }

    @Override
    public List<Map<String, Object>> getPrioritizedProducts() {
        long totalActiveResidents = residentRepository.findByIsActive(true).size();
        if (totalActiveResidents == 0) totalActiveResidents = 1;

        List<Inventory> allInventory = inventoryRepository.findAll();
        Map<Integer, Long> stockByProduct = allInventory.stream()
            .filter(inv -> inv.getProductId() != null && inv.getIsActive())
            .collect(Collectors.groupingBy(Inventory::getProductId, Collectors.counting()));

        List<Object[]> exitCounts = movementRepository.countExitsByProductSince(
            LocalDateTime.now().minusDays(30)
        );
        Map<Integer, Long> exitsByProduct = new HashMap<>();
        for (Object[] row : exitCounts) {
            exitsByProduct.put((Integer) row[0], (Long) row[1]);
        }
        long maxExits = exitsByProduct.values().stream().mapToLong(Long::longValue).max().orElse(1);
        if (maxExits == 0) maxExits = 1;

        Set<Integer> allProductIds = new HashSet<>();
        allProductIds.addAll(stockByProduct.keySet());
        allProductIds.addAll(exitsByProduct.keySet());

        List<Map<String, Object>> products = new ArrayList<>();

        for (Integer productId : allProductIds) {
            Product product = productRepository.findProductByIdRegardlessOfStatus(productId);
            if (product == null || !product.isIsActive()) continue;

            long stock = stockByProduct.getOrDefault(productId, 0L);
            if (stock == 0) continue;

            long exitsLast30 = exitsByProduct.getOrDefault(productId, 0L);

            List<InventoryMovement> exits = movementRepository.findExitsByProductSince(
                productId, LocalDateTime.now().minusDays(90)
            );
            List<Double> dailyConsumption = buildDailyConsumption(exits, 90);
            double projectedDaily = calculateMovingAverage(dailyConsumption, DEFAULT_WINDOW);
            double projected30 = projectedDaily * DEFAULT_HORIZON_DAYS;

            LocalDate earliestExpiration = findEarliestExpiration(productId);
            double factorVencimiento = 0;
            if (earliestExpiration != null) {
                long daysToExpire = ChronoUnit.DAYS.between(LocalDate.now(), earliestExpiration);
                factorVencimiento = Math.max(0, 1.0 - (daysToExpire / 90.0));
            }

            String category = product.getCategory() != null ? product.getCategory() : "Otro";
            double factorCategoria = CATEGORY_WEIGHT.getOrDefault(category, 0.2);

            double factorRotacion = (double) exitsLast30 / maxExits;

            double factorStockBajo = projected30 > 0 ? Math.min(1.0, stock / projected30) : 0.5;
            factorStockBajo = 1.0 - factorStockBajo;

            double factorDemandaMedica = calculateMedicalDemandFactor(productId, totalActiveResidents);

            double priorityScore =
                0.25 * factorVencimiento +
                0.15 * factorCategoria +
                0.15 * factorRotacion +
                0.15 * factorStockBajo +
                0.30 * factorDemandaMedica;

            String level;
            if (priorityScore >= 0.7) level = "Critico";
            else if (priorityScore >= 0.5) level = "Alto";
            else if (priorityScore >= 0.3) level = "Medio";
            else level = "Bajo";

            Map<String, Object> productData = new LinkedHashMap<>();
            productData.put("productId", productId);
            productData.put("productName", product.getName());
            productData.put("category", category);
            productData.put("stockActual", stock);
            productData.put("consumosUltimos30d", exitsLast30);
            productData.put("demandaProyectada30d", Math.round(projected30 * 100.0) / 100.0);
            productData.put("diasParaVencimiento", earliestExpiration != null ? ChronoUnit.DAYS.between(LocalDate.now(), earliestExpiration) : null);
            productData.put("fechaVencimiento", earliestExpiration);
            productData.put("factorVencimiento", Math.round(factorVencimiento * 100.0) / 100.0);
            productData.put("factorCategoria", Math.round(factorCategoria * 100.0) / 100.0);
            productData.put("factorRotacion", Math.round(factorRotacion * 100.0) / 100.0);
            productData.put("factorStockBajo", Math.round(factorStockBajo * 100.0) / 100.0);
            productData.put("factorDemandaMedica", Math.round(factorDemandaMedica * 100.0) / 100.0);
            productData.put("priorityScore", Math.round(priorityScore * 1000.0) / 1000.0);
            productData.put("level", level);

            products.add(productData);
        }

        products.sort((a, b) -> Double.compare(
            (Double) b.get("priorityScore"),
            (Double) a.get("priorityScore")
        ));

        return products;
    }

    @Override
    public List<Map<String, Object>> getActiveAlerts() {
        List<Map<String, Object>> alerts = new ArrayList<>();

        List<Inventory> allInventory = inventoryRepository.findAll();
        Map<Integer, Long> stockByProduct = allInventory.stream()
            .filter(inv -> inv.getProductId() != null && inv.getIsActive())
            .collect(Collectors.groupingBy(Inventory::getProductId, Collectors.counting()));

        for (Map.Entry<Integer, Long> entry : stockByProduct.entrySet()) {
            int productId = entry.getKey();
            long stock = entry.getValue();

            Product product = productRepository.findProductByIdRegardlessOfStatus(productId);
            if (product == null || !product.isIsActive()) continue;

            List<InventoryMovement> exits = movementRepository.findExitsByProductSince(
                productId, LocalDateTime.now().minusDays(90)
            );
            List<Double> dailyConsumption = buildDailyConsumption(exits, 90);
            double projectedDaily = calculateMovingAverage(dailyConsumption, DEFAULT_WINDOW);
            double projected30 = projectedDaily * DEFAULT_HORIZON_DAYS;

            if (projected30 > 0 && stock < projected30) {
                Map<String, Object> alert = new LinkedHashMap<>();
                alert.put("type", "STOCKOUT_RISK");
                alert.put("productId", productId);
                alert.put("productName", product.getName());
                alert.put("category", product.getCategory());
                alert.put("stockActual", stock);
                alert.put("demandaProyectada30d", Math.round(projected30 * 100.0) / 100.0);
                alert.put("severity", stock < projected30 * 0.5 ? "Critica" : "Advertencia");
                alert.put("message", "Stock bajo para " + product.getName() + ". Actual: " + stock + ", Necesario: " + Math.round(projected30));
                alerts.add(alert);
            }

            LocalDate earliestExpiration = findEarliestExpiration(productId);
            if (earliestExpiration != null) {
                long daysToExpire = ChronoUnit.DAYS.between(LocalDate.now(), earliestExpiration);
                if (daysToExpire <= 30) {
                    Map<String, Object> alert = new LinkedHashMap<>();
                    alert.put("type", "EXPIRATION_WARNING");
                    alert.put("productId", productId);
                    alert.put("productName", product.getName());
                    alert.put("category", product.getCategory());
                    alert.put("stockActual", stock);
                    alert.put("expirationDate", earliestExpiration);
                    alert.put("daysUntilExpiration", daysToExpire);
                    alert.put("severity", daysToExpire <= 7 ? "Critica" : "Advertencia");
                    alert.put("message", product.getName() + " vence en " + daysToExpire + " dias.");
                    alerts.add(alert);
                }
            }
        }

        alerts.sort((a, b) -> {
            boolean aCritical = "Critica".equals(a.get("severity"));
            boolean bCritical = "Critica".equals(b.get("severity"));
            if (aCritical != bCritical) return aCritical ? -1 : 1;
            return 0;
        });

        return alerts;
    }

    private double calculateMedicalDemandFactor(int productId, long totalActiveResidents) {
        List<ProductCondition> productConditions = productConditionRepository.findByProductIdAndIsActiveTrue(productId);
        if (productConditions.isEmpty()) return 0;

        double totalFactor = 0;

        for (ProductCondition pc : productConditions) {
            if (!"Indicado".equals(pc.getRelationshipType())) continue;

            Condition condition = pc.getCondition();
            if (condition == null) continue;

            long residentsWithCondition = residentConditionRepository.countByConditionIdAndIsActiveTrue(condition.getId());
            double severityFactor = SEVERITY_WEIGHT.getOrDefault(condition.getSeverity(), 0.5);

            double conditionFactor = (double) residentsWithCondition / totalActiveResidents;
            totalFactor += conditionFactor * severityFactor;
        }

        for (ProductCondition pc : productConditions) {
            if (!"Contraindicado".equals(pc.getRelationshipType())) continue;

            Condition condition = pc.getCondition();
            if (condition == null) continue;

            long residentsWithCondition = residentConditionRepository.countByConditionIdAndIsActiveTrue(condition.getId());
            double contraindicationRisk = (double) residentsWithCondition / totalActiveResidents;
            totalFactor -= contraindicationRisk * 0.5;
        }

        return Math.max(0, Math.min(1.0, totalFactor));
    }

    private List<Double> buildDailyConsumption(List<InventoryMovement> exits, int days) {
        Map<LocalDate, Integer> dailyMap = new LinkedHashMap<>();

        LocalDate today = LocalDate.now();
        for (int i = days - 1; i >= 0; i--) {
            dailyMap.put(today.minusDays(i), 0);
        }

        for (InventoryMovement exit : exits) {
            LocalDate date = exit.getMovementDate().toLocalDate();
            if (dailyMap.containsKey(date)) {
                dailyMap.merge(date, exit.getQuantity(), Integer::sum);
            }
        }

        return dailyMap.values().stream()
            .map(Integer::doubleValue)
            .collect(Collectors.toList());
    }

    private double calculateMovingAverage(List<Double> data, int window) {
        if (data.isEmpty()) return 0;
        int effectiveWindow = Math.min(window, data.size());
        double sum = 0;
        for (int i = data.size() - effectiveWindow; i < data.size(); i++) {
            sum += data.get(i);
        }
        return sum / effectiveWindow;
    }

    private double calculateExponentialSmoothing(List<Double> data) {
        if (data.isEmpty()) return 0;
        double forecast = data.get(0);
        for (int i = 1; i < data.size(); i++) {
            forecast = ALPHA * data.get(i) + (1 - ALPHA) * forecast;
        }
        return forecast;
    }

    private double calculateTrend(List<Double> data) {
        if (data.size() < 2) return 0;
        int n = data.size();
        double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        for (int i = 0; i < n; i++) {
            sumX += i;
            sumY += data.get(i);
            sumXY += i * data.get(i);
            sumX2 += i * i;
        }
        double denominator = n * sumX2 - sumX * sumX;
        if (denominator == 0) return 0;
        return (n * sumXY - sumX * sumY) / denominator;
    }

    private LocalDate findEarliestExpiration(int productId) {
        List<Inventory> inventoryItems = inventoryRepository.findAll().stream()
            .filter(inv -> inv.getProductId() != null && inv.getProductId() == productId && inv.getIsActive())
            .collect(Collectors.toList());

        return inventoryItems.stream()
            .map(Inventory::getExpirationDate)
            .filter(Objects::nonNull)
            .min(Comparator.naturalOrder())
            .orElse(null);
    }
}
