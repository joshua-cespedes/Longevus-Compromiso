
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Room;
import java.util.List;

public interface IRoomService {
    
    void save(Room room);
    List<Room> getAllRooms();
    void delete(int roomId);
    Room getById(int roomId);
    boolean checkAndUpdateStatus(int roomId);
    
}
