/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Role;
import cr.ac.ucr.ie.Lonjevus.repository.IRoleRepository;
import cr.ac.ucr.ie.Lonjevus.service.IRoleService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Usuario
 */
@Service
public class RoleServiceJPA implements IRoleService {
    
    @Autowired
    private IRoleRepository repo;

    @Override
    @Transactional
    public Role save(Role role) {
       return repo.save(role);
    }

    @Override
    public List<Role> getAllRoles() {
     return repo.findAll();
    }

    @Override
    public void delete(int roleId) {
        repo.deleteById(roleId);
    }

    @Override
    public Role getById(int roleId) {
        return repo.findById(roleId).get();
    }
    
}
