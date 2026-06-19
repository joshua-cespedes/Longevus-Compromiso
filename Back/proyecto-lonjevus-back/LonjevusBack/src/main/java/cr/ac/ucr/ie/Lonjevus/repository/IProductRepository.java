/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Usuario
 */
public interface IProductRepository extends JpaRepository<Product,Integer> {

    
    @Transactional
    @Modifying
    @Query("UPDATE Product p SET p.isActive = false WHERE p.supplier.id = :id")      
    void deleteAllBySupplierId(@Param("id") int id);
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Product findProductByIdRegardlessOfStatus(@Param("id") int id);
    

    List<Product> findByIsActiveTrue();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.supplier.id = :id AND p.isActive = true")
    int countBySupplierId(@Param("id") int id);


    
}
