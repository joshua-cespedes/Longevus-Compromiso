/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/springframework/Controller.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Task;
import cr.ac.ucr.ie.Lonjevus.service.ITaskService;
import java.util.Collections;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author User
 */

@RequestMapping("task")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {
   @Autowired
   private ITaskService service;
    @PreAuthorize("hasAuthority('PERMISSION_TAREAS_CREATE')")
    @PostMapping("/saveTask")
    public ResponseEntity<String> saveTask(@RequestBody Task t) {
        service.save(t);
        return ResponseEntity.ok("Tarea guardada");
    }
    @PreAuthorize("hasAuthority('PERMISSION_TAREAS_UPDATE')")
    @PostMapping("/updateTask/{id}")
    public ResponseEntity<String> updateTask(@PathVariable int id, @RequestBody Task t){
        service.update(id, t);
        return ResponseEntity.ok("Tarea actualizada");
    }
    @PreAuthorize("hasAuthority('PERMISSION_TAREAS_DELETE')")
    @DeleteMapping("/deleteTask/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable int id){
        service.delete(id);
        return ResponseEntity.ok("Tarea eliminada");
    }
    @PreAuthorize("hasAuthority('PERMISSION_TAREAS_VIEW')")
    @GetMapping("/getById/{id}")
    public Task getById(@PathVariable int id){
        return service.getById(id);
        
    } 
    @PreAuthorize("hasAuthority('PERMISSION_TAREAS_VIEW')")
    @GetMapping("/listTaskByCaregiver/{id}") 
    public Map getList(@PathVariable int id){
        return Collections.singletonMap("data", service.findByCaregiverId(id));
    }
    
}
