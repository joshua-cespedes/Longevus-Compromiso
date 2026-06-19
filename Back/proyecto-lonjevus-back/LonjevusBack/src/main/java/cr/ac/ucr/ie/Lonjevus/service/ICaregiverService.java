/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Caregiver;
import java.util.LinkedList;
import java.util.Optional;

/**
 *
 * @author User
 */
public interface ICaregiverService {
    void save (Caregiver c);
    LinkedList<Caregiver> getAll();
    void delete(int caregiverId);
    void update(int caregiverId, Caregiver c);
    Caregiver getById(int caregiverId);
    Optional<Caregiver> findByEmail(String email);
    void updatePassword(int caregiverId, String password);
}
