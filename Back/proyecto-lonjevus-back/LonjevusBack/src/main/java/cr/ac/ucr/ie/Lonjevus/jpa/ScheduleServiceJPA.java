/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Schedule;
import cr.ac.ucr.ie.Lonjevus.repository.IScheduleRepository;
import cr.ac.ucr.ie.Lonjevus.service.IScheduleService;
import java.util.LinkedList;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author User
 */
@Service
public class ScheduleServiceJPA implements IScheduleService {
    @Autowired
    private IScheduleRepository scheduleRepository;
    @Override
    public void save(Schedule shd) {
       scheduleRepository.save(shd);
    }

    @Override
    public LinkedList<Schedule> getAll() {
        return new LinkedList<>(scheduleRepository.findAll());
    }

    @Override
    public void delete(int scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }

    @Override
    public void update(int scheduleId, Schedule shd) {
        Optional <Schedule> optSchedule = scheduleRepository.findById(scheduleId);
        if(optSchedule.isPresent()){
            Schedule s = optSchedule.get();
            s.setDays(shd.getDays());
            s.setEntryTime1(s.getEntryTime1());
            s.setExitTime1(shd.getExitTime1());
             s.setEntryTime2(s.getEntryTime2());
            s.setExitTime2(shd.getExitTime2());
            scheduleRepository.save(s);
        }
    }

    @Override
    public Schedule getById(int scheduleId) {
         return scheduleRepository.findById(scheduleId).orElse(null);
    }
    
}
