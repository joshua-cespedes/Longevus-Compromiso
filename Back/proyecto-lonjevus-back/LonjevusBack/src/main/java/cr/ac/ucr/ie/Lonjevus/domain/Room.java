
package cr.ac.ucr.ie.Lonjevus.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;


@Entity
@Table(name = "room") 
@SQLDelete(sql = "UPDATE room SET isActive = 0 WHERE id = ?")
@Where(clause = "isActive = 1")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "statusRoom", nullable = false)
    private String statusRoom;

    @Column(name = "roomType", nullable = false)
    private String roomType;

    @Column(name = "bedCount", nullable = false)
    private int bedCount;

    @Column(name = "isActive", nullable = false)
    private boolean isActive;

    @Column(name = "roomNumber", nullable = false)
    private int roomNumber;

    public Room(int id, String statusRoom, String roomType, int bedCount, boolean isActive, int roomNumber) {
        this.id = id;
        this.statusRoom = statusRoom;
        this.roomType = roomType;
        this.bedCount = bedCount;
        this.isActive = isActive;
        this.roomNumber = roomNumber;
    }
    
    public Room(){}
    
    
    // Getters y setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStatusRoom() {
        return statusRoom;
    }

    public void setStatusRoom(String statusRoom) {
        this.statusRoom = statusRoom;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public int getBedCount() {
        return bedCount;
    }

    public void setBedCount(int bedCount) {
        this.bedCount = bedCount;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public int getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(int roomNumber) {
        this.roomNumber = roomNumber;
    }
}
