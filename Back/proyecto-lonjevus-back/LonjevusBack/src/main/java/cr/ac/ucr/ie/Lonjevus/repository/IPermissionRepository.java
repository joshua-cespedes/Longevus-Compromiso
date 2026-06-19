/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.Permission;
import cr.ac.ucr.ie.Lonjevus.domain.PermissionId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Usuario
 */
public interface IPermissionRepository extends JpaRepository<Permission,PermissionId> {
    
     List<Permission> findByRoleId(int roleId); 
    
    
}
