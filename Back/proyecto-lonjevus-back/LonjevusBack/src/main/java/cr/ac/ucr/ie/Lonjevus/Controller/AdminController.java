/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/springframework/Controller.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Admin;
import cr.ac.ucr.ie.Lonjevus.domain.Schedule;
import cr.ac.ucr.ie.Lonjevus.jpa.AdminServiceJPA;
import cr.ac.ucr.ie.Lonjevus.jpa.ScheduleServiceJPA;
import cr.ac.ucr.ie.Lonjevus.service.IAdminService;
import cr.ac.ucr.ie.Lonjevus.service.IScheduleService;
import cr.ac.ucr.ie.Lonjevus.service.LocalStorageService;
import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author User
 */
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    @Autowired
    private IAdminService adminService;
    @Autowired
    private IScheduleService scheduleService;
    @Autowired
    private LocalStorageService localStorageService;
    
    @PreAuthorize("hasAuthority('PERMISSION_ADMINISTRADORES_CREATE')")
    @PostMapping(value = "/addAdmin", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addAdmin(@RequestPart("adminData") Admin a,
            @RequestPart(value = "photo") MultipartFile photoFile) {
        try {
            Schedule shd = a.getSchedule();
            scheduleService.save(shd);
            if (photoFile != null && !photoFile.isEmpty()) {               
                String photoPath = localStorageService.saveAdminPhoto(photoFile);             
                a.setPhotoUrl(photoPath);
            }
            adminService.save(a);

            return ResponseEntity.ok("Administrador creado exitosamente");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear administrador");
        }
       
    }
    @PreAuthorize("hasAuthority('PERMISSION_ADMINISTRADORES_VIEW')")
    @GetMapping("/getAdmin/{id}")
    public ResponseEntity<?> getAdmin(@PathVariable int id) {
        try {
            Admin a = adminService.getById(id);
            if (a == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrador no encontrado con ID: " + id);
            }
            return ResponseEntity.ok(a);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener administrador: " + e.getMessage());
        }
    }
    @PreAuthorize("hasAuthority('PERMISSION_ADMINISTRADORES_UPDATE')")
    @PostMapping(value = "/updateAdmin/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateAdmin(@PathVariable int id, @RequestPart("adminData") Admin a,
            @RequestPart(value = "photo", required = false) MultipartFile photoFile) {
        try {
            Schedule shd = a.getSchedule();
            scheduleService.update(shd.getId(), shd);
            if (photoFile != null && !photoFile.isEmpty()) {               
                String photoPath = localStorageService.saveAdminPhoto(photoFile);
                a.setPhotoUrl(photoPath);
            }
            adminService.save(a);
            return ResponseEntity.ok("Administrador actualizado exitosamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear administrador");
        }
    }
    @PreAuthorize("hasAuthority('PERMISSION_ADMINISTRADORES_DELETE')")
    @DeleteMapping("/deleteAdmin/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable int id) {
        try {
            adminService.delete(id);
            return ResponseEntity.ok("Administrador eliminado exitosamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el administrador");
        }
    }
    public void prueba(){
        
    }

}
