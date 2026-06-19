/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/springframework/Controller.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.PurchaseProduct;
import cr.ac.ucr.ie.Lonjevus.repository.IPurchaseProductRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Usuario
 */
@RestController
@RequestMapping("/api/purchase-products")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseProductController {

    @Autowired
    private IPurchaseProductRepository repository;
    @PreAuthorize("hasAuthority('PERMISSION_COMPRAS_VIEW')") //pendiente tabla/modulo
    @GetMapping("/all")
    public List<PurchaseProduct> getAllPurchaseProducts() {
        return repository.findAll();
    }
}

