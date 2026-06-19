/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Unit;
import cr.ac.ucr.ie.Lonjevus.repository.IProductRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IUnitRepository;
import cr.ac.ucr.ie.Lonjevus.service.IUnitService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Usuario
 */
@Service
public class UnitServiceJPA implements IUnitService {

    @Autowired
    private IUnitRepository repo;
    
    @Override
    public void save(Unit unit) {
        repo.save(unit);
    }

    @Override
    public List<Unit> getAllUnits() {
       return repo.findAll();
    }

    @Override
    public void delete(int unitId) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public Unit getById(int unitId) {
        return repo.findById(unitId).get();
    }
    
}
