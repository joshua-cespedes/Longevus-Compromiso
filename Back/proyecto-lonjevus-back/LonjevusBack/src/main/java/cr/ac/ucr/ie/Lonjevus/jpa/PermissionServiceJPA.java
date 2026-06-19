
package cr.ac.ucr.ie.Lonjevus.jpa;


import cr.ac.ucr.ie.Lonjevus.domain.Permission;
import cr.ac.ucr.ie.Lonjevus.domain.PermissionId;
import cr.ac.ucr.ie.Lonjevus.repository.IPermissionRepository;
import cr.ac.ucr.ie.Lonjevus.service.IPermissionService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class PermissionServiceJPA implements IPermissionService {
    
    @Autowired
    private IPermissionRepository permRepo;

    @Override
    public void save(Permission permission) {
       permRepo.save(permission);
    }

    @Override
    public List<Permission> getAllPermissions() {
        return permRepo.findAll();
    }

    @Override
    public void delete(PermissionId id) {
        permRepo.deleteById(id);
    }

    @Override
    public Permission getById(PermissionId id) {
       return permRepo.findById(id).orElse(null);
    }

    @Override
    public List<Permission> findByRoleId(int roleId) {
        return permRepo.findByRoleId(roleId);
    }



    


    
    
}
