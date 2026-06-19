/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Supplier;
import java.util.List;

/**
 *
 * @author Usuario
 */

public interface ISupplierService {
    
    void save(Supplier supplier);
    List<Supplier> getAllSuppliers();
    void delete(int supplierId);
    Supplier getById(int supplierId);
     
}
