/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;


import cr.ac.ucr.ie.Lonjevus.domain.Unit;
import java.util.List;

public interface IUnitService {
    
    void save(Unit unit);
    List<Unit> getAllUnits();
    void delete(int unitId);
    Unit getById(int unitId);
    
}
