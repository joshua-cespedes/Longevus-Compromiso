/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/springframework/Controller.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.Controller;

import cr.ac.ucr.ie.Lonjevus.Security.JwtUtils;
import cr.ac.ucr.ie.Lonjevus.domain.Admin;
import cr.ac.ucr.ie.Lonjevus.domain.AuthenticationRequest;
import cr.ac.ucr.ie.Lonjevus.domain.AuthenticationResponse;
import cr.ac.ucr.ie.Lonjevus.domain.Caregiver;
import cr.ac.ucr.ie.Lonjevus.jpa.UserDetailsJPA;
import cr.ac.ucr.ie.Lonjevus.repository.ICaregiverRepository;
import cr.ac.ucr.ie.Lonjevus.service.IAdminService;
import cr.ac.ucr.ie.Lonjevus.service.ICaregiverService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author User
 */
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private ICaregiverService caregiverService;
    @Autowired
    private IAdminService adminService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtil;
    private final UserDetailsJPA userDetailsService;

    public AuthenticationController(AuthenticationManager authenticationManager, JwtUtils jwtUtil, UserDetailsJPA userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword().trim())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        Map<String, Object> user = new HashMap<>();
        String email = userDetails.getUsername();
        Admin admin = adminService.findByEmail(email).orElse(null);
        if (admin != null) {
            user.put("id", admin.getId());
            user.put("identification", admin.getIdentification());
            user.put("name", admin.getName());
            user.put("salary", admin.getSalary());
            user.put("email", email);
            user.put("schedule", admin.getSchedule());
            user.put("officeContact", admin.getOfficeContact());
            user.put("photoUrl", admin.getPhotoUrl());
        } else {
            Caregiver caregiver = caregiverService.findByEmail(email).orElse(null);
            user.put("id", caregiver.getId());
            user.put("identification", caregiver.getIdentification());
            user.put("name", caregiver.getName());
            user.put("salary", caregiver.getSalary());
            user.put("photoUrl", caregiver.getPhotoUrl());
            user.put("email", email);
            user.put("schedule", caregiver.getSchedule());
            user.put("shift", caregiver.getShift());
        }

        Map<String, Object> response = new HashMap<>();

        response.put("jwt", jwt);
        response.put("email", userDetails.getUsername());
        List<String> authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        response.put("authorities", authorities);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/newPassword")        
    public ResponseEntity<String> updatePassword(@RequestParam String email,
            @RequestParam String newPassword) {
        try {
            Optional<Admin> adminOpt = adminService.findByEmail(email);
            if (adminOpt.isPresent()) {
                int id = adminOpt.get().getId();
                adminService.updatePassword(id, newPassword);
                return ResponseEntity.ok("Contraseña de administrador actualizada exitosamente");
            }

            Optional<Caregiver> caregiverOpt = caregiverService.findByEmail(email);
            if (caregiverOpt.isPresent()) {
                int id = caregiverOpt.get().getId();
                caregiverService.updatePassword(id, newPassword);
                return ResponseEntity.ok("Contraseña de cuidador actualizada exitosamente");
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró un usuario con el correo proporcionado");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la contraseña");
        }
    }
}
