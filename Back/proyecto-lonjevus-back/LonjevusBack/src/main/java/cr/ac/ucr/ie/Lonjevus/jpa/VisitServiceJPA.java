/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import cr.ac.ucr.ie.Lonjevus.domain.Room;
import cr.ac.ucr.ie.Lonjevus.domain.Visit;
import cr.ac.ucr.ie.Lonjevus.repository.IResidentRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IRoomRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IVisitRepository;
import cr.ac.ucr.ie.Lonjevus.service.IResidentService;
import cr.ac.ucr.ie.Lonjevus.service.IRoomService;
import cr.ac.ucr.ie.Lonjevus.service.IVisitService;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author User
 */
@Service
public class VisitServiceJPA implements IVisitService {

    @Autowired
    private IVisitRepository visitRepository;
    @Autowired
    private IRoomRepository roomService;
    @Autowired
    private IResidentService residentService;

    @Override
    public void save(Visit v) {
        visitRepository.save(v);
    }

    @Override
    public LinkedList<Visit> getAll() {
        List<Visit> allVisits = visitRepository.findAllByOrderByVisitDateDesc();
        for (Visit v : allVisits) {
            Resident resident = v.getResident();
            if (resident != null) {
                Resident r = residentService.getById(resident.getId());
                if (r != null) {
                    Optional<Room> room = roomService.findById(r.getNumberRoom());
                    if (room.isPresent()) {
                        r.setNumberRoom(room.get().getRoomNumber());
                    } else {
                        r.setNumberRoom(0);
                    }
                    v.setResident(r);
                }
            }
        }
        return new LinkedList<>(allVisits);
    }

    @Override
    public void delete(int visitId) {
        visitRepository.deleteById(visitId);
    }

    @Override
    public void update(int visitId, Visit v) {
        Optional<Visit> optVisit = visitRepository.findById(visitId);
        if (optVisit.isPresent()) {
            Visit visit = optVisit.get();
            visit.setName(v.getName());
            visit.setVisitDate(v.getVisitDate());
            visit.setVisitHour(v.getVisitHour());
            visit.setPhoneNumber(v.getPhoneNumber());
            visit.setEmail(v.getEmail());
            visit.setRelationship(v.getRelationship());
            visitRepository.save(visit);
        }
    }

    @Override
    public Visit getById(int visitId) {
        return visitRepository.findById(visitId).orElse(null);
    }

}
