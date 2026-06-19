/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Permission;
import cr.ac.ucr.ie.Lonjevus.service.IPermissionService;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("permissions")
@CrossOrigin(origins = "http://localhost:5173")
public class PermissionController {

    @Autowired
    private IPermissionService permissionService;

    // Obtener todos los permisos
    @PreAuthorize("hasAuthority('PERMISSION_PERMISOS_VIEW')")
    @RequestMapping("/listss")
    public Map getAllPermissions() {
        return Collections.singletonMap("permissions", permissionService.getAllPermissions());
    }

    // Obtener permiso por ID
    @PreAuthorize("hasAuthority('PERMISSION_PERMISOS_VIEW')")
    @GetMapping("/list/{roleId}")
    public List<Permission> getPermissionsByRole(@PathVariable int roleId) {
        
        return permissionService.findByRoleId(roleId);
        
    }


    // Crear o actualizar un permiso
    @PreAuthorize("hasAuthority('PERMISSION_PERMISOS_CREATE') or hasAuthority('PERMISSION_PERMISOS_UPDATE')")
    @PostMapping("/save/{roleId}")
    public ResponseEntity<List<Permission>> createOrUpdatePermission(@PathVariable int roleId,
            @RequestBody List<Permission> perms) {
       
        perms.forEach(perm -> perm.setRoleId(roleId));
        
        perms.forEach(perm -> permissionService.save(perm));
        List<Permission> updatedPermissions = permissionService.findByRoleId(roleId);
        return ResponseEntity.ok(updatedPermissions);
    }


}
