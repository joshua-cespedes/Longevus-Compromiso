/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Activity;
import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import cr.ac.ucr.ie.Lonjevus.service.IActivityService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author JOSHUACALETCESPEDESG
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ActivityController {

    @Autowired
    private IActivityService service;
    
    @PreAuthorize("hasAuthority('PERMISSION_ACTIVIDADES_VIEW')")
    @GetMapping("/activities")
    public List<Activity> getActivities() {
        return service.getAll();
    }
    @PreAuthorize("hasAuthority('PERMISSION_ACTIVIDADES_CREATE')")
    @PostMapping("/addActivity")
    @ResponseBody
    public String addActivity(@RequestBody Activity a) {
        a.setIsActive(true);
        service.save(a);
        return "Actividad agregada";
    }
    @PreAuthorize("hasAuthority('PERMISSION_ACTIVIDADES_DELETE')")
    @DeleteMapping("/deleteActivity")
    public String deleteActivity(@RequestParam Integer id) {
        service.delete(id);
        return "actividad eliminada";
    }
    @PreAuthorize("hasAuthority('PERMISSION_ACTIVIDADES_UPDATE')")
    @GetMapping("/findActivity")
    public Activity getActivityByDate(@RequestParam int id){
        return service.getById(id);
    }

    @PostMapping("/updateActivity")
    public String updateActivity(@RequestBody Activity activity) {
        service.update(activity.getId(), activity);
        return ("Actividad actualizada .");
    }
    @PreAuthorize("hasAuthority('PERMISSION_ACTIVIDADES_CREATE')") //TABLA RESIDENT_ACTIVITY
    @PostMapping("/addResidentToActivity")
    public String addResidentToActivity(@RequestParam int activityId, @RequestParam int residentId) {

        service.addResidentToActivity(residentId, activityId);
        return ("Residente agregado a la actividad");
    }
    @PreAuthorize("hasAuthority('PERMISSION_ACTIVIDADES_DELETE')")
    @DeleteMapping("/deleteResidentFromActivity")
    public String deleteResidentFromActivity(@RequestParam int activityId, @RequestParam int residentId) {

        service.deleteResidentFromActivity(residentId, activityId);
        return ("Residente eliminado a la actividad");
    }
    @PreAuthorize("hasAuthority('PERMISSION_ACTIVIDADES_VIEW')")
    @GetMapping("/getActivitiesByDate")
    public List<Activity> getActivitiesByDate(@RequestParam LocalDate date){
        return service.getByDate(date);
    }
    
    @PreAuthorize("hasAuthority('PERMISSION_ACTIVIDADES_VIEW')")
    @GetMapping("/getResidentsFromActivity")
    public List<Resident> getResidentsFromActivity (@RequestParam int id){
        return service.getResidentsFromActivity(id);
    }
}
