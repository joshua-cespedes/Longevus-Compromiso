
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Room;
import cr.ac.ucr.ie.Lonjevus.repository.IRoomRepository;
import cr.ac.ucr.ie.Lonjevus.service.IResidentService;
import cr.ac.ucr.ie.Lonjevus.service.IRoomService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoomServiceJPA implements IRoomService  {
    
    @Autowired
    private IRoomRepository repo;
    
    @Autowired
    private IResidentService residentRepo;
    
    @Override
    public void save(Room room) {
        repo.save(room);
    }

    @Override
    public List<Room> getAllRooms() {
       return repo.findAll();
    }

    @Override
    public void delete(int roomId) {
        repo.deleteById(roomId);
    }

    @Override
    public Room getById(int roomId) {
        return repo.findById(roomId).orElse(null);
    }
    
    @Override
    @Transactional
    public boolean checkAndUpdateStatus(int roomId) {
        long ocuppied = residentRepo.countByNumberRoom(roomId);
        
        //long ocuppied = 6;

        Room room = repo.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Room no encontrada: " + roomId));

        // si se llenó, actualizar estado
        if (ocuppied >= room.getBedCount()) {
            room.setStatusRoom("No Disponible");  
            repo.save(room);
            return true;  
        }
        room.setStatusRoom("Disponible");
        repo.save(room);
        return false;     
    }
    
    
    
}
