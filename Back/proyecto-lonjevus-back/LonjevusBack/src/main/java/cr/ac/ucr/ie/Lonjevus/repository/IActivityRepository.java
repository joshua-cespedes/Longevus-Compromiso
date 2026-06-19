/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.Activity;
import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author JOSHUACALETCESPEDESG
 */
public interface IActivityRepository extends JpaRepository<Activity, Integer>{
    List<Activity> findByDate(LocalDate date);
    
    @Query("SELECT r FROM Activity a JOIN a.residents r WHERE a.id = :id")
    List<Resident> findResidentsByActivityId(@Param("id") Integer id);
}
