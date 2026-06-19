/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cr.ac.ucr.ie.Lonjevus.Connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author User
 */
public class ConnectionDB {

    private static final String DATABASE = "longevusdb";
    private static final String USER = "root";
    private static final String PASSWORD = "";
    private static final String HOST = "localhost";
    private static final int PORT = 3399;
    private static final String URL ="jdbc:mysql://"+HOST+":"+PORT+"/"+DATABASE;
    
    private static Connection connect;
    
    public static Connection getConnection() throws SQLException{
        try{
            Class.forName("com.mysql.cj.jdbc.Driver");
            
        }catch(ClassNotFoundException e){
            System.err.println("Ha ocurrido un error al intentar obtener la clase " + e.getMessage());
        }
        
        try{
            connect = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Se ha establecido la conexion a la DB");
            
        }catch(SQLException e){
            System.err.println("Ha ocurrido un error al intentar conectarse a la base de datos " + e.getMessage());
        }
        return connect;
    }
}
