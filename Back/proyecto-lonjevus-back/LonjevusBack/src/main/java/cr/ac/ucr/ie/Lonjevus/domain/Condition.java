package cr.ac.ucr.ie.Lonjevus.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "`condition`")
@SQLDelete(sql = "UPDATE `condition` SET isActive = 0 WHERE id = ?")
@Where(clause = "isActive = 1")
public class Condition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String description;

    private String severity;

    @Column(name = "isActive")
    private boolean isActive;

    @OneToMany(mappedBy = "condition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ResidentCondition> residentConditions;

    @OneToMany(mappedBy = "condition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ProductCondition> productConditions;

    public Condition() {}

    public Condition(Integer id, String name, String description, String severity, boolean isActive) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.severity = severity;
        this.isActive = isActive;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public boolean isIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }

    public List<ResidentCondition> getResidentConditions() { return residentConditions; }
    public void setResidentConditions(List<ResidentCondition> residentConditions) { this.residentConditions = residentConditions; }

    public List<ProductCondition> getProductConditions() { return productConditions; }
    public void setProductConditions(List<ProductCondition> productConditions) { this.productConditions = productConditions; }
}
