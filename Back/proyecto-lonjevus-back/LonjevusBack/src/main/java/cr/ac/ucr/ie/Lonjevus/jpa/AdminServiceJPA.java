/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Admin;
import cr.ac.ucr.ie.Lonjevus.repository.IAdminRepository;
import cr.ac.ucr.ie.Lonjevus.service.IAdminService;
import java.util.LinkedList;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author User
 */
@Service
public class AdminServiceJPA implements IAdminService{
    
    @Autowired
    private IAdminRepository adminRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void save(Admin a) {
        String passwordEncript = passwordEncoder.encode(a.getPassword());
        a.setPassword(passwordEncript);
        adminRepository.save(a);
    }

    @Override
    public LinkedList<Admin> getAll() {
        
       return new LinkedList<>(adminRepository.findAll());
    }

    @Override
    public void delete(int adminId) {
        adminRepository.deleteById(adminId);
    }

    @Override
    public void update(int adminId, Admin a) {
      Optional<Admin> optAdmin = adminRepository.findById(adminId);
      if(optAdmin.isPresent()){
          Admin admin = optAdmin.get();
          
          admin.setIdentification(a.getIdentification());
          admin.setName(a.getName());
          admin.setSalary(a.getSalary());
          admin.setEmail(a.getEmail());
          admin.setOficeContact(a.getOfficeContact());
          admin.setPhotoUrl(a.getPhotoUrl());
          admin.setSchedule(a.getSchedule());
      }
    }

    @Override
    public Admin getById(int adminId) {
       return adminRepository.findById(adminId).orElse(null);
    }

    @Override
    public Optional<Admin> findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    @Override
    public void updatePassword(int adminId, String password) {
        Admin admin = adminRepository.findById(adminId).orElse(null);
        if(admin!=null){
            String passwordEncript = passwordEncoder.encode(password);
            admin.setPassword(passwordEncript);
            adminRepository.save(admin);
        }
    }  
}
