/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Visit;
import java.util.LinkedList;

/**
 *
 * @author User
 */
public interface IVisitService {
    void save (Visit v);
    LinkedList<Visit> getAll();
    void delete(int visitId);
    void update(int visitId, Visit v);
    Visit getById(int visitId);
}
