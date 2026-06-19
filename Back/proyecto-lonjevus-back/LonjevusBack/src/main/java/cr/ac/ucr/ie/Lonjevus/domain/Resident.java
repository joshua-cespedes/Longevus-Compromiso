package cr.ac.ucr.ie.Lonjevus.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Where;
import org.springframework.format.annotation.DateTimeFormat;

/**
 *
 * @author JOSHUACALETCESPEDESG
 */
@Entity
@Table(name = "resident")
//@Where(clause = "isActive = 1")
public class Resident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "identification")
    private String identification;
    @Column(name = "name")
    private String name;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "birthdate")
    private LocalDate birthdate;
    @Formula("TIMESTAMPDIFF(YEAR, birthdate, CURDATE())")
    private Integer age;
    @Column(name = "healthStatus")
    private String healthStatus;
    @Column(name = "numberRoom")
    private Integer numberRoom;
    @Column(name = "photo")
    private String photo;
    @Column(name = "isActive")
    private Boolean isActive;

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ResidentContact> contacts = new LinkedList<>();

    
    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    //@JsonManagedReference
    @JsonIgnore 
    private List<Visit> visits = new LinkedList<>();


    @ManyToMany(mappedBy = "residents")
    private List<Activity> activities = new LinkedList<>();


    public Resident() {
    }

    public Resident(String identification, String name, Integer age, String healthStatus, Integer roomNumber, String photo, boolean isActive) {
        this.identification = identification;
        this.name = name;
        //this.age = age;
        this.healthStatus = healthStatus;
        this.numberRoom = roomNumber;
        this.photo = photo;
        this.isActive = isActive;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getIdentification() {
        return identification;
    }

    public void setIdentification(String identification) {
        this.identification = identification;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public Integer getNumberRoom() {
        return numberRoom;
    }

    public void setNumberRoom(Integer numberRoom) {
        this.numberRoom = numberRoom;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    
    public List<ResidentContact> getContacts() {
        return contacts;
    }

    public void setContacts(List<ResidentContact> contacts) {
        this.contacts = contacts;
    }


    public List<Visit> getVisits() {
        return visits;
    }

    public void setVisits(List<Visit> visits) {
        this.visits = visits;
    }
    
    

}
