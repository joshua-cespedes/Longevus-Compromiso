package cr.ac.ucr.ie.Lonjevus.jpa;

import cr.ac.ucr.ie.Lonjevus.domain.Admin;
import cr.ac.ucr.ie.Lonjevus.domain.Billing;
import cr.ac.ucr.ie.Lonjevus.domain.Resident;
import cr.ac.ucr.ie.Lonjevus.repository.IAdminRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IBillingRepository;
import cr.ac.ucr.ie.Lonjevus.repository.IResidentRepository;
import cr.ac.ucr.ie.Lonjevus.service.IBillingService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BillingServiceJPA implements IBillingService {

    @Autowired
    private IBillingRepository repository;

    @Autowired
    private IAdminRepository adminRepository;

    @Autowired
    private IResidentRepository residentRepository;

    @Override
    public List<Billing> getAllActive() {
        return repository.findAllByIsActiveTrue();
    }

    @Override
    public List<Billing> getAllInactive() {
        return repository.findAllByIsActiveFalse();
    }

    @Override
    public Billing findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
    }

    @Override
    @Transactional
    public void save(Billing billing) {
        billing.setIsActive(true);

        long count = repository.count() + 1;
        String datePart = billing.getDate().toString().replaceAll("-", "");
        String consecutive = String.format("%04d-%s", count, datePart);
        billing.setConsecutive(consecutive);

        Admin admin = adminRepository.findById(billing.getAdministrator().getId())
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));
        Resident resident = residentRepository.findById(billing.getResident().getId())
                .orElseThrow(() -> new RuntimeException("Residente no encontrado"));

        billing.setAdministrator(admin);
        billing.setResident(resident);

        repository.save(billing);
    }

    @Override
    @Transactional
    public void update(Integer id, Billing updatedBilling) {
        Billing existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));

        existing.setAmount(updatedBilling.getAmount());
        existing.setDate(updatedBilling.getDate());
        existing.setPeriod(updatedBilling.getPeriod());
        existing.setPaymentMethod(updatedBilling.getPaymentMethod());
        existing.setIsActive(updatedBilling.getIsActive());

        Admin admin = adminRepository.findById(updatedBilling.getAdministrator().getId())
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));
        Resident resident = residentRepository.findById(updatedBilling.getResident().getId())
                .orElseThrow(() -> new RuntimeException("Residente no encontrado"));

        existing.setAdministrator(admin);
        existing.setResident(resident);

        repository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Billing billing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));

        billing.setIsActive(false);
        repository.save(billing);
    }

    @Override
    public List<Billing> findByDate(LocalDate date) {
        return repository.findByDate(date);
    }

    @Override
    public List<Billing> findByPeriod(String period) {
        return repository.findByPeriodContainingIgnoreCase(period);
    }

    @Override
    public List<Billing> findByResident(Integer residentId) {
        return repository.findByResidentIdAndIsActiveTrue(residentId);
    }

    @Override
    public List<Billing> findByResidentAndDate(Integer residentId, LocalDate date) {
        return repository.findByResidentIdAndDate(residentId, date);
    }

    @Override
    public List<Billing> findActiveByInactiveResident() {
        return repository.findByIsActiveTrueAndResidentIsActiveFalse();
    }

    @Override
    public List<Billing> findByInactiveResidents() {
        return repository.findByResidentIsActiveFalse();
    }

}
