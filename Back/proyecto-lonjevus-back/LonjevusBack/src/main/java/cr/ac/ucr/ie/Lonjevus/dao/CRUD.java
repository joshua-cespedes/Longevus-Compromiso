package cr.ac.ucr.ie.Lonjevus.dao;

import java.util.LinkedList;

    public interface CRUD<T> {
    public LinkedList<T> getAll();
    public void add(T t);
    public void update(T t);
    public void deleteById(Integer x);
    public T findById(Integer y);

    }

    

