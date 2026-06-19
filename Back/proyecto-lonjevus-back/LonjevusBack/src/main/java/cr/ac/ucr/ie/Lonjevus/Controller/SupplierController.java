package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.domain.Supplier;
import cr.ac.ucr.ie.Lonjevus.service.IProductService;
import cr.ac.ucr.ie.Lonjevus.service.ISupplierService;
import cr.ac.ucr.ie.Lonjevus.service.LocalStorageService;
import java.util.Collections;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("suppliers")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {
    

    private final LocalStorageService localStorageService;

    @Autowired
    public SupplierController(LocalStorageService localStorageService) {
        this.localStorageService = localStorageService;
    }
    
    @Autowired
    private ISupplierService service;
    
    @Autowired
    private IProductService productService;

    @PreAuthorize("hasAuthority('PERMISSION_PROVEEDORES_VIEW')")
    @RequestMapping("/list")
    public Map getList() {
        return Collections.singletonMap("suppliers", service.getAllSuppliers());
    }
    @PreAuthorize("hasAuthority('PERMISSION_PROVEEDORES_CREATE')")
    @PostMapping(path = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> saveSupplier(
            @RequestParam("name") String name,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("email") String email,
            @RequestParam("address") String address,
            @RequestParam("isActive") boolean isActive,
            //@RequestParam("photo") MultipartFile photo,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {       
        Supplier supplier = new Supplier();
        supplier.setName(name);
        supplier.setPhoneNumber(phoneNumber);
        supplier.setEmail(email);
        supplier.setAddress(address);
        supplier.setIsActive(isActive);
        String photoPath = localStorageService.save(photo);
        supplier.setPhoto(photoPath);
        service.save(supplier);
        //SupplierService.addSupplier(supplier);
        return getList();
    }
    @PreAuthorize("hasAuthority('PERMISSION_PROVEEDORES_DELETE')")
    @DeleteMapping("/delete")
    public Map deleteSupplier(@RequestParam int id) {
        service.delete(id);
        return getList();
    }
    @PreAuthorize("hasAuthority('PERMISSION_PROVEEDORES_VIEW')")
    @GetMapping("/getById")
    public Supplier getSupplierById(@RequestParam int id) {
        return service.getById(id);
    }
    @PreAuthorize("hasAuthority('PERMISSION_PROVEEDORES_UPDATE')")
    @PostMapping("/update")
    public Map updateSupplier(@RequestParam int id,
            @RequestParam("name") String name,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("email") String email,
            @RequestParam("address") String address,
            @RequestParam("isActive") boolean isActive,
            //@RequestParam("photo") MultipartFile photo)
            @RequestParam(value = "photo", required = false) MultipartFile photo){
        
            Supplier supplier = new Supplier();
            supplier.setId(id);
            supplier.setName(name);
            supplier.setPhoneNumber(phoneNumber);
            supplier.setEmail(email);
            supplier.setAddress(address);
            supplier.setIsActive(isActive);
            if (photo!=null){
              String photoPath = localStorageService.save(photo);
              supplier.setPhoto(photoPath);
            }else{
              supplier.setPhoto(service.getById(id).getPhoto());
            }
            
        service.save(supplier);
        //SupplierService.updateSupplier(supplier);
        return getList();
    }
    
    @PreAuthorize("hasAuthority('PERMISSION_PROVEEDORES_DELETE')")
    @GetMapping("/getQuantityProductsBySupplier")
    public int getProductsById(@RequestParam int id){
        
        return productService.countBySupplierId(id);
       
    }
    
}
