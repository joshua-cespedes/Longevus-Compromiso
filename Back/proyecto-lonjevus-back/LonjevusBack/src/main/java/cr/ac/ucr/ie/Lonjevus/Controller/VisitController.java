/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import cr.ac.ucr.ie.Lonjevus.domain.Visit;
import cr.ac.ucr.ie.Lonjevus.service.IResidentService;
import cr.ac.ucr.ie.Lonjevus.service.IVisitService;
import java.sql.Time;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author User
 */
@RestController
@RequestMapping("visit")
@CrossOrigin(origins = "http://localhost:5173")
public class VisitController {
    @Autowired
    private IVisitService visitService;
    @Autowired
    private IResidentService residentService;
    
    @PreAuthorize("hasAuthority('PERMISSION_VISITAS_VIEW')")
    @GetMapping("/listVisitors")
    public Map getAll(){
        List<Visit> visitors = visitService.getAll();
         return Collections.singletonMap("data",visitors);
    }
    
    @PostMapping("/addVisit")
    public ResponseEntity<String> addVisit(@RequestBody Visit v){
        System.out.println("AQUI AL AGREGAR VISITA LLEGA " + v.getResident().getId());
        try{
            Resident resident = residentService.getById(v.getResident().getId());         
            v.setIsActive(true);
            v.setResident(resident);
            visitService.save(v);
            return ResponseEntity.ok("Visita agendada exitosamente");
            
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al agendar la visita");
        }
    }
    @PreAuthorize("hasAuthority('PERMISSION_VISITAS_UPDATE')")
    @PostMapping("/updateVisit/{id}")
    public ResponseEntity<String> updateVisit(@PathVariable int id,@RequestBody Visit v){
            try{                               
            Resident resident = residentService.getById(v.getResident().getId());
            v.setResident(resident);
            visitService.update(id, v);
        return ResponseEntity.ok("Visita actualizada exitosamente");
        
            
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la visita");
        }
        
    }
    @PreAuthorize("hasAuthority('PERMISSION_VISITAS_DELETE')")
    @DeleteMapping("/deleteVisit/{id}")
    public ResponseEntity<String> deleteVisit(@PathVariable int id){
        try {
            visitService.delete(id);
            return ResponseEntity.ok("Visita eliminada exitosamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la visita");
        }
    }
    @PreAuthorize("hasAuthority('PERMISSION_VISITAS_VIEW')")
    @GetMapping("/getVisitById/{id}")
    public Visit getVisitById(@PathVariable int id){
        Visit v = visitService.getById(id);
        return v;
    }
    
    
}
