package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import cr.ac.ucr.ie.Lonjevus.domain.ResidentContact;
import cr.ac.ucr.ie.Lonjevus.domain.ResidentPublicDTO;
import cr.ac.ucr.ie.Lonjevus.domain.Room;
import cr.ac.ucr.ie.Lonjevus.service.IResidentContactService;
import cr.ac.ucr.ie.Lonjevus.service.IResidentService;
import cr.ac.ucr.ie.Lonjevus.service.IRoomService;
import cr.ac.ucr.ie.Lonjevus.service.LocalStorageService;
import java.time.LocalDate;
import java.util.LinkedList;
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
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author User
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController

public class ResidentController {

    @Autowired
    private IResidentService service;

    @Autowired
    private IResidentContactService contactService;
    
    @Autowired
    private IRoomService roomService;
    private static LocalStorageService localS = new LocalStorageService();
    
    @PreAuthorize("hasAuthority('PERMISSION_RESIDENTES_VIEW')")
    @GetMapping("/residents")
    public List<Resident> getResidents() {
        return service.getList();
    }
    @PreAuthorize("hasAuthority('PERMISSION_RESIDENTES_CREATE')")
    @PostMapping("/addResident")
    @ResponseBody
    public String addResident(@RequestParam String identification, @RequestParam String name,
            @RequestParam String birthdate, @RequestParam String healthStatus,
            @RequestParam int numberRoom, @RequestParam(required = false) MultipartFile photo) {

        Resident resident = new Resident();
        resident.setIdentification(identification);
        resident.setName(name);
        resident.setBirthdate(LocalDate.parse(birthdate));
        resident.setHealthStatus(healthStatus);
        resident.setNumberRoom(numberRoom);
        resident.setIsActive(true);

        if (photo != null && !photo.isEmpty()) {
            String photoPath = localS.saveResidentPhoto(photo);
            resident.setPhoto(photoPath);

        } else {
            resident.setPhoto("foto.jpg");
        }

        service.save(resident);
        return "Residente listado";
    }
    @PreAuthorize("hasAuthority('PERMISSION_RESIDENTES_DELETE')")
    @DeleteMapping("/deleteResident")
    @ResponseBody
    public String deleteResident(@RequestParam int id) {
        service.delete(id);
        return "Residente eliminado";
    }
    @PreAuthorize("hasAuthority('PERMISSION_RESIDENTES_VIEW')")
    @GetMapping("/findResident")
    public Resident seachById(@RequestParam int id) {
        return service.getById(id);
    }
    @PreAuthorize("hasAuthority('PERMISSION_RESIDENTES_UPDATE')")
    @PostMapping("/updateResident")
    public String updateResident(@RequestParam int id, @RequestParam String identification, @RequestParam String name,
            @RequestParam String birthdate, @RequestParam String healthStatus,
            @RequestParam int numberRoom, @RequestParam(required = false) MultipartFile photo) {

        Resident resident = new Resident();
        resident.setId(id);
        resident.setIdentification(identification);
        resident.setName(name);
        resident.setBirthdate(LocalDate.parse(birthdate));
        resident.setHealthStatus(healthStatus);
        resident.setNumberRoom(numberRoom);

        if (photo != null && !photo.isEmpty()) {
            String photoPath = localS.saveResidentPhoto(photo);
            resident.setPhoto(photoPath);
        } else {
            Resident actual = service.getById(id);
            if (actual == null) {
                throw new RuntimeException("Residente no encontrado");
            }
            resident.setPhoto(actual.getPhoto());
        }

        service.update(id, resident);
        return "Residente Actualizado";
    }
    
    @PreAuthorize("hasAuthority('PERMISSION_CONTACTOS_VIEW')")
    @GetMapping("/getContacts")
    public List<ResidentContact> getContacts(@RequestParam int id) {
        return contactService.getList(id);
    }
    @PreAuthorize("hasAuthority('PERMISSION_CONTACTOS_CREATE')")
    @PostMapping("/addContact")
    public String addContact(@RequestBody ResidentContact r) {
        contactService.save(r);
        return "Contacto agregado";
    }
    @PreAuthorize("hasAuthority('PERMISSION_CONTACTOS_DELETE')")
    @DeleteMapping("/deleteContact")
    public String deleteContact(@RequestParam int id) {
        contactService.delete(id);
        return "Contacto eliminado";
    }
    @PreAuthorize("hasAuthority('PERMISSION_CONTACTOS_UPDATE')")
    @PostMapping("/updateContact")
    public String updateContact(@RequestBody ResidentContact r) {
        contactService.update(r.getId(), r);
        return "Contacto actualizado";
    }
    
    @GetMapping("/public-list")
    public List<ResidentPublicDTO> getPublicListOfResidents() {
        List<Resident> residents = service.getList();
        List<ResidentPublicDTO> list = new LinkedList<>();
        for(Resident r: residents){
            ResidentPublicDTO rp = new ResidentPublicDTO();
            Room room = roomService.getById(r.getNumberRoom());
            if(room!=null){
                rp.setNumberRoom(room.getRoomNumber()+"");
            }else{
                rp.setNumberRoom("N/D");
            }
            rp.setId(r.getId());
            rp.setName(r.getName());
            list.add(rp);
        }          
        return list;
    }
}
