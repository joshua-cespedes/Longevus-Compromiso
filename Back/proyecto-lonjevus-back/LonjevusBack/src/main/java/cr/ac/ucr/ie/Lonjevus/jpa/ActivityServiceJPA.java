/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Activity;
import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import cr.ac.ucr.ie.Lonjevus.repository.IActivityRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IResidentRepository;
import cr.ac.ucr.ie.Lonjevus.service.IActivityService;
import java.time.LocalDate;
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
public class ActivityServiceJPA implements IActivityService {

    @Autowired
    private IActivityRepository activityRepository;

    @Autowired
    private IResidentRepository residentRepository;

    @Override
    public void save(Activity a) {
        activityRepository.save(a);
    }

    @Override
    public List<Activity> getAll() {
        LinkedList<Activity> list = new LinkedList<>();

        for (Activity a : activityRepository.findAll()) {
            if (a.getIsActive() == true) {
                list.add(a);
            }
        }

        for (Activity a : list) {
            if (a.getCaregiver() != null) {
                a.getCaregiver().getId();
            }
        }

        return list;
    }

    @Override
    public void delete(int id) {
        Activity activity = activityRepository.findById(id).orElse(null);

        activity.setIsActive(false);
        activityRepository.save(activity);
    }

    @Override
    public void update(int id, Activity a) {
        Optional<Activity> optActivity = activityRepository.findById(id);
        if (optActivity.isPresent()) {
            Activity activity = optActivity.get();

            activity.setName(a.getName());
            activity.setDescription(a.getDescription());
            activity.setType(a.getType());
            activity.setDate(a.getDate());
            activity.setStartTime(a.getStartTime());
            activity.setEndTime(a.getEndTime());
            activity.setLocation(a.getLocation());
            activity.setStatus(a.getStatus());

            if (a.getCaregiver() != null) {
                activity.setCaregiver(a.getCaregiver());
            }

            activityRepository.save(activity);
        }
    }

    @Override
    public Activity getById(int id) {
        Activity activity = activityRepository.findById(id).orElse(null);
        
        if(activity.getIsActive())
            return activityRepository.findById(id).orElse(null);
        else
            return null;
    }

    @Override
    public void addResidentToActivity(int idResident, int idActivity) {

        Resident resident = residentRepository.findById(idResident).orElse(null);

        Activity activity = activityRepository.findById(idActivity).orElse(null);

        activity.getResidents().add(resident);
        activityRepository.save(activity);
    }

    @Override
    public void deleteResidentFromActivity(int idResident, int idActivity) {
        Resident resident = residentRepository.findById(idResident).orElse(null);

        Activity activity = activityRepository.findById(idActivity).orElse(null);

        activity.getResidents().remove(resident);
        activityRepository.save(activity);
    }

    @Override
    public List<Activity> getByDate(LocalDate date) {
        List<Activity> activities = activityRepository.findByDate(date);
        LinkedList<Activity> actives = new LinkedList<>();

        for (Activity a : activities) {
            if (Boolean.TRUE.equals(a.getIsActive())) {
                if (a.getCaregiver() != null) {
                    a.getCaregiver().getId();
                }
                actives.add(a);
            }
        }

        return actives;
    }

    @Override
    public List<Resident> getResidentsFromActivity(Integer id) {
        List<Resident> list = new LinkedList<>();
        
        for(Resident resident: activityRepository.findResidentsByActivityId(id)){
            if(resident.isIsActive())
                list.add(resident);
        }
        
        return list;
        
    }
}
