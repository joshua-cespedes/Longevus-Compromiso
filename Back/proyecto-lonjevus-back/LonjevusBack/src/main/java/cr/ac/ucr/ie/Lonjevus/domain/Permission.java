
package cr.ac.ucr.ie.Lonjevus.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name="role_module_permissions")
@IdClass(PermissionId.class)
public class Permission {
    
    @Id
    @Column(name="role_id")
    private int roleId;
    
    @Id
    @Column(name="module")
    private String module; // En lugar de module_id
    
    private boolean canView;
    
    private boolean canCreate;
    
    private boolean canUpdate;
    
    private boolean canDelete;
    

    public Permission() {}

    public Permission(int roleId, String module, boolean canView, boolean canCreate, boolean canUpdate, boolean canDelete) {
        this.roleId = roleId;
        this.module = module;
        this.canView = canView;
        this.canCreate = canCreate;
        this.canUpdate = canUpdate;
        this.canDelete = canDelete;
    }

    public int getRoleId() { return roleId; }
    public void setRoleId(int roleId) { this.roleId = roleId; }

    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }

    public boolean isCanView() { return canView; }
    public void setCanView(boolean canView) { this.canView = canView; }

    public boolean isCanCreate() { return canCreate; }
    public void setCanCreate(boolean canCreate) { this.canCreate = canCreate; }

    public boolean isCanUpdate() { return canUpdate; }
    public void setCanUpdate(boolean canUpdate) { this.canUpdate = canUpdate; }

    public boolean isCanDelete() { return canDelete; }
    public void setCanDelete(boolean canDelete) { this.canDelete = canDelete; }
}