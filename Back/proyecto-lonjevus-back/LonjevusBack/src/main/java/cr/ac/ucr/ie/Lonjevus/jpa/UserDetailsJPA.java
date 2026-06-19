/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Admin;
import cr.ac.ucr.ie.Lonjevus.domain.Caregiver;
import cr.ac.ucr.ie.Lonjevus.domain.Permission;
import cr.ac.ucr.ie.Lonjevus.domain.Role;
import cr.ac.ucr.ie.Lonjevus.repository.IAdminRepository;
import cr.ac.ucr.ie.Lonjevus.repository.ICaregiverRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IPermissionRepository;
import cr.ac.ucr.ie.Lonjevus.service.IAdminService;
import cr.ac.ucr.ie.Lonjevus.service.ICaregiverService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 *
 * @author User
 */
@Service
public class UserDetailsJPA implements UserDetailsService{
    
    private final IAdminRepository adminRepository;
    private final ICaregiverRepository caregiverRepository;
    private final IPermissionRepository permissionRepository;
    
    public UserDetailsJPA(IAdminRepository adminRepository, ICaregiverRepository caregiverRepository,
                          IPermissionRepository permissionRepository){
        this.adminRepository = adminRepository;
        this.caregiverRepository = caregiverRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
       Admin admin = adminRepository.findByEmail(email).orElse(null);
       if(admin != null){
           //System.out.println("EMAIL: " +admin.getEmail());
           //System.out.println("CONTRA: "+ admin.getPassword());
           UserDetails user = createUserDetails(admin.getEmail(), admin.getPassword(), admin.getRol()); //Lista de permisos 
           //System.out.println("Password DENTRO del objeto UserDetails es: [" + user.getPassword() + "]");
           return user;
       }
       
       Caregiver caregiver = caregiverRepository.findByEmail(email).orElse(null);
       if(caregiver != null){
           UserDetails user = createUserDetails(caregiver.getEmail(), caregiver.getPassword(), caregiver.getRol());
           return user;
       }
       throw new UsernameNotFoundException("Usuario no encontrado con el email: " + email);
    }
    
    private UserDetails createUserDetails(String email, String password, Role rol){
        List<GrantedAuthority> authorities = new ArrayList<>();
        if(rol!=null){
            authorities.add(new SimpleGrantedAuthority("ROLE_"+rol.getName().toUpperCase()));
            
            List<Permission> permissions = permissionRepository.findByRoleId(rol.getId());
            for(Permission p : permissions){
                if (p.isCanView()) {
                authorities.add(new SimpleGrantedAuthority("PERMISSION_" + p.getModule().toUpperCase() + "_VIEW"));
                }
                if (p.isCanCreate()) {
                authorities.add(new SimpleGrantedAuthority("PERMISSION_" + p.getModule().toUpperCase() + "_CREATE"));
                }
                if (p.isCanUpdate()) {
                authorities.add(new SimpleGrantedAuthority("PERMISSION_" + p.getModule().toUpperCase() + "_UPDATE"));
                }
                if (p.isCanDelete()) {
                authorities.add(new SimpleGrantedAuthority("PERMISSION_" + p.getModule().toUpperCase() + "_DELETE"));
                }
            }
        }
        return new User(email, password, authorities);
    }
    
}
