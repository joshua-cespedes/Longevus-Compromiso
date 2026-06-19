
package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Room;
import cr.ac.ucr.ie.Lonjevus.service.IRoomService;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("rooms")
public class RoomController {

    @Autowired
    private IRoomService service;
    
    //@Autowired
    //private IResidentRepository residentRepo;

    @PreAuthorize("hasAuthority('PERMISSION_HABITACIONES_VIEW')")
    @GetMapping("/list")
    public Map<String, Object> getList() {
        return Collections.singletonMap("rooms", service.getAllRooms());
    }

    @PreAuthorize("hasAuthority('PERMISSION_HABITACIONES_CREATE')")
    @PostMapping(path = "/save")
    public Map<String, Object> saveRoom(@RequestBody Room room) {
        service.save(room);
        return getList();
    }
    @PreAuthorize("hasAuthority('PERMISSION_HABITACIONES_DELETE')")
    @DeleteMapping("/delete")
    public Map<String, Object> deleteRoom(@RequestParam int id) {
        service.delete(id);
        return getList();
    }

    @PreAuthorize("hasAuthority('PERMISSION_HABITACIONES_VIEW')")
    @GetMapping("/getById")
    public Room getRoomById(@RequestParam int id) {
        return service.getById(id);
    }

   @PreAuthorize("hasAuthority('PERMISSION_HABITACIONES_UPDATE')")
    @PostMapping(path = "/update")
    public Map<String, Object> updateRoom(@RequestBody Room room) {
        service.save(room);
        return getList();
    }
    
    @PostMapping("/checkStatusRoom")
    public ResponseEntity<Map<String, Object>> checkStatusRoom(@RequestParam("id") int roomId) {
        boolean changed = service.checkAndUpdateStatus(roomId);
        
        Map<String, Object> body = new HashMap<>();
        body.put("changed", changed);
        body.put("rooms", service.getAllRooms());
        return ResponseEntity.ok(body);
    }
}
