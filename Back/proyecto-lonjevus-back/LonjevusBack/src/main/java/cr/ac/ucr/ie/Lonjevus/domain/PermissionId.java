
package cr.ac.ucr.ie.Lonjevus.domain;

import java.io.Serializable;
import java.util.Objects;

public class PermissionId implements Serializable {
    private int roleId;
    private String module;

    public PermissionId() {}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PermissionId)) return false;
        PermissionId that = (PermissionId) o;
        return roleId == that.roleId && Objects.equals(module, that.module);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roleId, module);
    }
}
