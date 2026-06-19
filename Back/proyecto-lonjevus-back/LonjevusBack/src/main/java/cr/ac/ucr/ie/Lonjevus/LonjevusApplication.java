package cr.ac.ucr.ie.Lonjevus;

import cr.ac.ucr.ie.Lonjevus.domain.Admin;
import cr.ac.ucr.ie.Lonjevus.repository.IAdminRepository;
import java.lang.reflect.Field;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class LonjevusApplication {

	public static void main(String[] args) {
		SpringApplication.run(LonjevusApplication.class, args);
	}
}
