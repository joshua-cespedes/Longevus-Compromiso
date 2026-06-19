/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Activity;
import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import java.time.LocalDate;
import java.util.List;

/**
 *
 * @author JOSHUACALETCESPEDESG
 */
public interface IActivityService {
    void save (Activity a);
    List<Activity> getAll();
    void delete(int id);
    void update(int id, Activity a);
    Activity getById(int id);
    void addResidentToActivity(int idResident, int idActivity);
    void deleteResidentFromActivity(int idResident, int idActivity);
    List<Activity> getByDate(LocalDate date);
    List<Resident> getResidentsFromActivity(Integer id);
}
