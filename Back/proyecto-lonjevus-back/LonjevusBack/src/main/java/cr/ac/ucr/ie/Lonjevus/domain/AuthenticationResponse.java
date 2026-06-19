/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.domain;

/**
 *
 * @author User
 */
public class AuthenticationResponse {
    private final String jwt;
    
    public AuthenticationResponse(String jwt){ 
        this.jwt = jwt;
    }
    public String getJwt() {
        return jwt;
    }
    
    
}
