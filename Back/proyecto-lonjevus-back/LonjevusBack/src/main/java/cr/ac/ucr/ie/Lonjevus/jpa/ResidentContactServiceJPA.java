/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import cr.ac.ucr.ie.Lonjevus.domain.ResidentContact;
import cr.ac.ucr.ie.Lonjevus.repository.IResidentContactRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IResidentRepository;
import cr.ac.ucr.ie.Lonjevus.service.IResidentContactService;
import jakarta.transaction.Transactional;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author JOSHUACALETCESPEDESG
 */
@Service
public class ResidentContactServiceJPA implements IResidentContactService {

    @Autowired
    private IResidentContactRepository contactRepository;

    @Autowired
    private IResidentRepository residentRepository;

    @Transactional
    @Override
    public void save(ResidentContact contact) {
        contactRepository.save(contact);
    }

    @Override
    public List<ResidentContact> getList(int id) {
        return contactRepository.findByResidentId(id);
    }

    @Override
    public void delete(int id) {
        ResidentContact contact = contactRepository.findById(id).orElse(null);
        if (contact != null) {
            contact.setResident(null);
            contactRepository.delete(contact);
            System.out.println("Contacto eliminado correctamente: " + id);
        } else {
            System.out.println("No se encontró el contacto con id: " + id);
        }
    }

    @Transactional
    @Override
    public void update(int id, ResidentContact c) {
        Optional<ResidentContact> optContact = contactRepository.findById(id);
        if (optContact.isPresent()) {
            ResidentContact contact = optContact.get();

            contact.setName(c.getName());
            contact.setRelationShip(c.getRelationShip());
            contact.setResident(c.getResident());
            contactRepository.save(contact);
        }
    }

    @Override
    public ResidentContact getById(int id) {
        return contactRepository.findById(id).orElse(null);
    }

}
