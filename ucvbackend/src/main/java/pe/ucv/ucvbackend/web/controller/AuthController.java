package pe.ucv.ucvbackend.web.controller;

import pe.ucv.ucvbackend.domain.dto.AuthResponse;
import pe.ucv.ucvbackend.domain.dto.AuthenticationRequest;
import pe.ucv.ucvbackend.domain.dto.ChangePasswordRequest;
import pe.ucv.ucvbackend.domain.dto.RegisterRequest;
import pe.ucv.ucvbackend.domain.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ucv")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        logger.info("******************************************");
        logger.info("Register request accepted successfully.");
        logger.info("******************************************");
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthenticationRequest request) {
        logger.info("******************************************");
        logger.info("Authentication request accepted successfully.");
        logger.info("******************************************");
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<AuthResponse> changePassword(@RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(authService.changePassword(request));
}
}