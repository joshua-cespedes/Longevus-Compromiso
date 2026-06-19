/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.ResidentContact;
import java.util.List;

/**
 *
 * @author JOSHUACALETCESPEDESG
 */
public interface IResidentContactService {
    void save(ResidentContact resident);
    List<ResidentContact> getList(int id);
    void delete(int id);
    void update(int id, ResidentContact resident);
    ResidentContact getById(int id); 
}
