/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;
import cr.ac.ucr.ie.Lonjevus.domain.Product;
import java.util.List;

public interface IProductService {
    
    void save(Product product);
    List<Product> getAllProducts();
    void delete(int productId);
    Product getById(int productId);
    void deleteBySupplierId(int supplierId);
    int countBySupplierId(int id);
}
