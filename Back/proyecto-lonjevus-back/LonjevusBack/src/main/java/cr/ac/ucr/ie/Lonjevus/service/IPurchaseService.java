package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Purchase;

import java.util.List;

public interface IPurchaseService {

    List<Purchase> getAll();
    List<Purchase> getAllInactive();
    Purchase findById(String id);
    void save(Purchase purchase);
    void update(String id, Purchase purchase);
    void delete(String id);
}
