/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Admin;
import java.util.LinkedList;
import java.util.Optional;

/**
 *
 * @author User
 */
public interface IAdminService {
    void save (Admin a);
    LinkedList<Admin> getAll();
    void delete(int adminId);
    void update(int adminId, Admin a);
    Admin getById(int adminId);
    Optional<Admin> findByEmail(String email);
    void updatePassword(int adminId, String password);
}
