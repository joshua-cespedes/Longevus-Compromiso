
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
@Table(name = "unit")
@SQLDelete(sql = "UPDATE unit SET isActive = 0 WHERE id = ?")
@Where(clause = "isActive = 1")
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "unit_type")
    private String unitType;

    @Column(name = "isActive")
    private boolean isActive;

    public Unit() {}
    

    public Unit(Integer id, String unitType,boolean isActive) {
        this.id = id;
        this.unitType = unitType;
        this.isActive = isActive;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUnitType() {
        return unitType;
    }

    public void setUnitType(String unitType) {
        this.unitType = unitType;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }
    
    
    

    
}
