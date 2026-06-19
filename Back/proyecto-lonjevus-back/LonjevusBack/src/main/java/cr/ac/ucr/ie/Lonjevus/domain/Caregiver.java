/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

/**
 *
 * @author User
 */
@Entity
@Table(name = "caregiver")
@SQLDelete(sql = "UPDATE caregiver SET isActive = 0 WHERE id = ?")
@Where(clause = "isActive = 1")
public class Caregiver extends Person {
    
    @Column(name = "shift")
    private String Shift;

    public Caregiver() {
    }

    public String getShift() {
        return Shift;
    }

    public void setShift(String Shift) {
        this.Shift = Shift;
    }   
}
