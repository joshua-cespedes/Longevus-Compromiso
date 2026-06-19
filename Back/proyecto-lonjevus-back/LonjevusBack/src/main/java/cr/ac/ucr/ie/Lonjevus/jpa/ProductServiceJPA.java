/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Product;
import cr.ac.ucr.ie.Lonjevus.repository.IProductRepository;
import cr.ac.ucr.ie.Lonjevus.service.IProductService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Usuario
 */
@Service
public class ProductServiceJPA implements IProductService {

    @Autowired
    private IProductRepository repo;

    @Override
    public void save(Product product) {
        repo.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return repo.findByIsActiveTrue();
    }
    
    @Override
    public void delete(int productId) {
        repo.deleteById(productId);
    }

    @Override
    public Product getById(int productId) {
        return repo.findById(productId).orElse(null);
    }

    @Override
    public void deleteBySupplierId(int supplierId) {
        repo.deleteAllBySupplierId(supplierId);
    }
    
    @Override
    public int countBySupplierId(int id) {
        return repo.countBySupplierId(id);
    }
}
