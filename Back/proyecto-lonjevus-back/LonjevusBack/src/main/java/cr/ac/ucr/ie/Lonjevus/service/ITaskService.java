/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Task;
import java.util.LinkedList;

/**
 *
 * @author User
 */
public interface ITaskService {
    void save (Task t);
    LinkedList<Task> findByCaregiverId(int id);
    void delete(int taskId);
    void update(int taskId, Task t);
    Task getById(int taskId);
    

}
