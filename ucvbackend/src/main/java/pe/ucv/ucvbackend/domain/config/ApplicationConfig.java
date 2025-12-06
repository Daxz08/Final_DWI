package pe.ucv.ucvbackend.domain.config;

import pe.ucv.ucvbackend.domain.repository.UserRepository;
import pe.ucv.ucvbackend.domain.repository.EmployeeRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
public class ApplicationConfig {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public ApplicationConfig(UserRepository userRepository, EmployeeRepository employeeRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            var user = userRepository.findByEmail(username);
            if (user.isPresent()) {
                return user.get();
            }

            var employee = employeeRepository.findByEmail(username);
            if (employee.isPresent()) {
                return employee.get();
            }

            throw new UsernameNotFoundException("Usuario no encontrado: " + username);
        };
    }
}