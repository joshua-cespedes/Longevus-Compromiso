/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/springframework/Controller.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.Controller;


import cr.ac.ucr.ie.Lonjevus.domain.Schedule;
import org.springframework.http.ResponseEntity;
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
@RestController
@RequestMapping("/schedule")
public class ScheduleController {
    //private static ScheduleService service = new ScheduleService();
//    
//   @GetMapping("/getSchedule/{id}")
//    public Schedule getScheduleById(@PathVariable int id) {
//        return service.getScheduleById(id);
//    }
//    
//    @PostMapping("/saveSchedule")
//    public ResponseEntity<Void> saveSchedule(@RequestBody Schedule sch){
//        service.addSchedule(sch);
//        return ResponseEntity.ok().build();
//    }
//    
//     @DeleteMapping("/deleteSchedule/{id}")
//    public ResponseEntity<Void> deleteSchedule(@PathVariable int id){
//        service.deleteSchedule(id);
//        return ResponseEntity.ok().build();
//    }
//    
//    @PostMapping("/updateSchedule")
//    public ResponseEntity<Void> updateSchedule(@RequestBody Schedule sch){
//        service.updateSchedule(sch);
//        return ResponseEntity.ok().build();
//    }
}
