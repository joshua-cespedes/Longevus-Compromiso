/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import cr.ac.ucr.ie.Lonjevus.domain.Room;
import cr.ac.ucr.ie.Lonjevus.repository.IResidentRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IRoomRepository;
import cr.ac.ucr.ie.Lonjevus.service.IResidentService;
import cr.ac.ucr.ie.Lonjevus.service.IRoomService;
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
public class ResidentServiceJPA implements IResidentService {

    @Autowired
    private IResidentRepository residentRepository;
    @Autowired
    private IRoomRepository roomService;

    @Override
    public void save(Resident resident) {
        residentRepository.save(resident);
    }

    @Override
    public List<Resident> getList() {
        LinkedList<Resident> list = new LinkedList<>();

        for (Resident r : residentRepository.findByIsActive(true)) {
            if (r.isIsActive()) {
                Optional<Room> room = roomService.findById(r.getNumberRoom());
                if (room.isPresent()) {
                    r.setNumberRoom(room.get().getRoomNumber());
                } else {
                    r.setNumberRoom(0);
                }
                list.add(r);
            }
        }

        return list;
    }

    @Override
    public void delete(int id) {
        Resident resident = residentRepository.findById(id).orElse(null);

        resident.setIsActive(false);

        residentRepository.save(resident);
    }

    @Override
    public void update(int id, Resident r) {
        Optional<Resident> optResident = residentRepository.findById(id);
        if (optResident.isPresent()) {
            Resident resident = optResident.get();

            resident.setIdentification(r.getIdentification());
            resident.setName(r.getName());
            resident.setBirthdate(r.getBirthdate());
            resident.setHealthStatus(r.getHealthStatus());
            resident.setNumberRoom(r.getNumberRoom());
            resident.setPhoto(r.getPhoto());

            residentRepository.save(resident);
        }
    }

    @Override
    public Resident getById(int id) {
        return residentRepository.findById(id).orElse(null);
    }

    @Override
    public long countByNumberRoom(Integer numberRoom) {
        return residentRepository.countByNumberRoom(numberRoom);
    }

    @Override
    public List<Resident> findByIsActive(boolean isActive) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }


}
