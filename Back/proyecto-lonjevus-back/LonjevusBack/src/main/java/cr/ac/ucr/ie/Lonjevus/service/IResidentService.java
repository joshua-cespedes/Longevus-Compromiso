/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import java.util.List;

/**
 *
 * @author JOSHUACALETCESPEDESG
 */
public interface IResidentService {
    void save(Resident resident);
    List<Resident> getList();
    void delete(int id);
    void update(int id, Resident resident);
    Resident getById(int id);
    long countByNumberRoom(Integer numberRoom);
    List<Resident> findByIsActive(boolean isActive);
    
}
