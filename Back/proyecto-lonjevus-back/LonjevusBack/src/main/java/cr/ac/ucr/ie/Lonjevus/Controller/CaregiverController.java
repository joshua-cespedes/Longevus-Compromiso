/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/springframework/Controller.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Caregiver;
import cr.ac.ucr.ie.Lonjevus.domain.Role;
import cr.ac.ucr.ie.Lonjevus.domain.Schedule;
import cr.ac.ucr.ie.Lonjevus.service.ICaregiverService;
import cr.ac.ucr.ie.Lonjevus.service.IRoleService;
import cr.ac.ucr.ie.Lonjevus.service.IScheduleService;
import cr.ac.ucr.ie.Lonjevus.service.LocalStorageService;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author User
 */
@RestController
@RequestMapping("/caregiver")
@CrossOrigin(origins = "http://localhost:5173")
public class CaregiverController {
    @Autowired
    private ICaregiverService caregiverService;
    @Autowired
    private IScheduleService scheduleService;
    @Autowired
    private LocalStorageService localStorageService;
    @Autowired
    private IRoleService roleService;
    
    @PreAuthorize("hasAuthority('PERMISSION_CUIDADORES_VIEW')")
    @GetMapping("/listCaregiver")
    public Map getAll() {
        List<Caregiver> caregivers = caregiverService.getAll(); 
        return Collections.singletonMap("data", caregivers);
    }
    @PreAuthorize("hasAuthority('PERMISSION_CUIDADORES_CREATE')")
    @PostMapping(value = "/addCaregiver", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addCaregiver(@RequestPart("caregiverData") Caregiver caregiver,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {
        try {
            if (caregiver.getSchedule() != null && caregiver.getSchedule().getId() == 0) {
                scheduleService.save(caregiver.getSchedule());
            }
            
            if (photoFile != null && !photoFile.isEmpty()) {               
                String photoPath = localStorageService.saveCaregiverPhoto(photoFile);               
                caregiver.setPhotoUrl(photoPath);
            }
            if(caregiver.getRol()==null){
                Role rol = roleService.getById(2);
                caregiver.setRol(rol);
            }
            caregiverService.save(caregiver);
            return ResponseEntity.ok("Cuidador creado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear trabajador");
        }
    }
    @PreAuthorize("hasAuthority('PERMISSION_CUIDADORES_UPDATE')")
    @PostMapping(value = "/updateCaregiver/{id}",  consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateCaregiver(@RequestPart("caregiverData") Caregiver c,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {
        try{
            Schedule shd = c.getSchedule();
             scheduleService.update(shd.getId(), shd);
             if (photoFile != null && !photoFile.isEmpty()) {               
                String photoPath = localStorageService.saveCaregiverPhoto(photoFile);
                 System.out.println("Foto nueva" + photoPath);
                c.setPhotoUrl(photoPath);
            }
            caregiverService.update(c.getId(), c);
             return ResponseEntity.ok("Trabajador actualizado exitosamente");
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear trabajador");
        }
        
         
    }
    @PreAuthorize("hasAuthority('PERMISSION_CUIDADORES_DELETE')")
    @DeleteMapping("/deleteCaregiver/{id}")
    public ResponseEntity<String> deleteCaregiver(@PathVariable int id) {
         try {
             System.out.println("ID QUE LLEGA A ELIMINAR" + id);
            caregiverService.delete(id);
            return ResponseEntity.ok("Trabajador eliminado exitosamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el trabajador");
        }
    }
    @PreAuthorize("hasAuthority('PERMISSION_CUIDADORES_VIEW')")
    @GetMapping("getcaregiverById/{id}")
    public Caregiver getById(@PathVariable int id) {
        Caregiver c = caregiverService.getById(id);
              
        return c;
    }
}
