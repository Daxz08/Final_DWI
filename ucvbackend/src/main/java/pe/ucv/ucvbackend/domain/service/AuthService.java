package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.dto.AuthResponse;
import pe.ucv.ucvbackend.domain.dto.AuthenticationRequest;
import pe.ucv.ucvbackend.domain.dto.ChangePasswordRequest;
import pe.ucv.ucvbackend.domain.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse authenticate(AuthenticationRequest request);
    AuthResponse changePassword(ChangePasswordRequest request);}