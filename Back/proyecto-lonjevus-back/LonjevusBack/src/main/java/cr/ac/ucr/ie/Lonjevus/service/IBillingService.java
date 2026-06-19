package cr.ac.ucr.ie.Lonjevus.service;

import cr.ac.ucr.ie.Lonjevus.domain.Billing;
import java.time.LocalDate;
import java.util.List;

public interface IBillingService {

    List<Billing> getAllActive();
    List<Billing> getAllInactive();
    Billing findById(Integer id);
    void save(Billing billing);
    void update(Integer id, Billing billing);
    void delete(Integer id);
    List<Billing> findByDate(LocalDate date);
    List<Billing> findByPeriod(String period);
    List<Billing> findByResident(Integer residentId);
    List<Billing> findByResidentAndDate(Integer residentId, LocalDate date);
    List<Billing> findActiveByInactiveResident();
    List<Billing> findByInactiveResidents();
}
