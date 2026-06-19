/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

/**
 *
 * @author User
 */
@Entity
@Table(name = "administrator")
@SQLDelete(sql = "UPDATE administrator SET isActive = 0 WHERE id = ?")
@Where(clause = "isActive = 1")
public class Admin extends Person {

    @Column(name = "officeContact")
    private String officeContact;


    public Admin() {

    }

    public String getOfficeContact() {
        return officeContact;
    }

    public void setOficeContact(String oficeContact) {
        this.officeContact = oficeContact;
    }

}
