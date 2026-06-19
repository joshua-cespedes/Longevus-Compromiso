/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Role;
import java.util.List;

/**
 *
 * @author Usuario
 */
public interface IRoleService {
    
    Role save(Role role);
    List<Role> getAllRoles();
    void delete(int roleId);
    Role getById(int roleId);
    
}
