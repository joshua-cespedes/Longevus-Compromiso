/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Caregiver;
import cr.ac.ucr.ie.Lonjevus.repository.ICaregiverRepository;
import cr.ac.ucr.ie.Lonjevus.service.ICaregiverService;
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
public class CaregiverServiceJPA implements ICaregiverService {

    @Autowired
    private ICaregiverRepository caregiverRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void save(Caregiver c) {
        String password = c.getPassword();
        String passwordEncript = passwordEncoder.encode(password.trim());
        c.setPassword(passwordEncript);
        c.setIsActive(true);
        caregiverRepository.save(c);
    }
    
    @Override
    public LinkedList<Caregiver> getAll() {
        return new LinkedList<>(caregiverRepository.findAll());
    }
    
    @Override
    public void delete(int caregiverId) {
        caregiverRepository.deleteById(caregiverId);
    }
    
    @Override
    public void update(int caregiverId, Caregiver c) {
        Optional<Caregiver> optCaregiver = caregiverRepository.findById(caregiverId);
        if (optCaregiver.isPresent()) {
            Caregiver caregiver = optCaregiver.get();
            caregiver.setIdentification(c.getIdentification());
            caregiver.setName(c.getName());
            caregiver.setSalary(c.getSalary());
            caregiver.setEmail(c.getEmail());
            caregiver.setShift(c.getShift());   
            if (c.getPhotoUrl() != null && !c.getPhotoUrl().isEmpty()) {
                caregiver.setPhotoUrl(c.getPhotoUrl());
            }
            caregiver.setSchedule(c.getSchedule());
            caregiverRepository.save(caregiver);
        }
    }
    
    @Override
    public Caregiver getById(int caregiverId) {
        return caregiverRepository.findById(caregiverId).orElse(null);
    }

    @Override
    public Optional<Caregiver> findByEmail(String email) {
        return caregiverRepository.findByEmail(email);
    }

    @Override
    public void updatePassword(int caregiverId, String password) {
       
        Caregiver caregiver = caregiverRepository.findById(caregiverId).orElse(null);
        if(caregiver!=null){
            String passwordEncript = passwordEncoder.encode(password);
            caregiver.setPassword(passwordEncript);
            caregiverRepository.save(caregiver);
        }
    
    }
    
}
