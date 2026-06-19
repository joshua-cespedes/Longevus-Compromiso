/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.repository;

import cr.ac.ucr.ie.Lonjevus.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author User
 */
public interface IScheduleRepository extends JpaRepository<Schedule, Integer>{
    
}
