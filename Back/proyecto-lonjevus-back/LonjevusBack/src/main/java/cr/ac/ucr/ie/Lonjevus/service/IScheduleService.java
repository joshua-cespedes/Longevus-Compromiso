/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Schedule;
import java.util.LinkedList;

/**
 *
 * @author User
 */
public interface IScheduleService {
    void save (Schedule shd);
    LinkedList<Schedule> getAll();
    void delete(int scheduleId);
    void update(int scheduleId, Schedule shd);
    Schedule getById(int scheduleId);
}
