package cr.ac.ucr.ie.Lonjevus.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "resident_condition")
@SQLDelete(sql = "UPDATE resident_condition SET isActive = 0 WHERE id = ?")
@Where(clause = "isActive = 1")
public class ResidentCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "residentId", nullable = false)
    @JsonIgnoreProperties({"contacts", "visits", "activities"})
    private Resident resident;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "conditionId", nullable = false)
    private Condition condition;

    @Column(name = "diagnosedDate")
    private LocalDate diagnosedDate;

    private String notes;

    @Column(name = "isActive")
    private boolean isActive;

    public ResidentCondition() {}

    public ResidentCondition(Integer id, Resident resident, Condition condition, LocalDate diagnosedDate, String notes, boolean isActive) {
        this.id = id;
        this.resident = resident;
        this.condition = condition;
        this.diagnosedDate = diagnosedDate;
        this.notes = notes;
        this.isActive = isActive;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Resident getResident() { return resident; }
    public void setResident(Resident resident) { this.resident = resident; }

    public Condition getCondition() { return condition; }
    public void setCondition(Condition condition) { this.condition = condition; }

    public LocalDate getDiagnosedDate() { return diagnosedDate; }
    public void setDiagnosedDate(LocalDate diagnosedDate) { this.diagnosedDate = diagnosedDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public boolean isIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }
}
