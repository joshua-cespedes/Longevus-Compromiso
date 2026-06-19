/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Task;
import cr.ac.ucr.ie.Lonjevus.repository.ITaskRepository;
import cr.ac.ucr.ie.Lonjevus.service.ITaskService;
import java.util.LinkedList;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author User
 */
@Service
public class TaskServiceJPA implements ITaskService {
    @Autowired
    private ITaskRepository taskRepository;
    
    @Override
    public void save(Task t) {
         taskRepository.save(t);
    }

//    @Override
//    public LinkedList<Task> getAll() {
//      return new LinkedList<>(taskRepository.findAll());
//    }

    @Override
    public void delete(int taskId) {
       taskRepository.deleteById(taskId);
    }

    @Override
    public void update(int taskId, Task t) {
       Optional<Task> optTask = taskRepository.findById(taskId);
        if (optTask.isPresent()) {
            Task task = optTask.get();
            task.setDescription(t.getDescription());
            taskRepository.save(task);
        }
    }

    @Override
    public Task getById(int taskId) {
       return taskRepository.findById(taskId).orElse(null);
    }

    
    public LinkedList<Task> findByCaregiverId(int caregiverId) {
         return taskRepository.findByCaregiverId(caregiverId);
    }
    
}
