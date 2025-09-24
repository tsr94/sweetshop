package com.example.sweetshop.service;

import com.example.sweetshop.dto.AuthRequest;
import com.example.sweetshop.dto.AuthResponse;
import com.example.sweetshop.dto.RegisterRequest;
import com.example.sweetshop.entity.Users;
import com.example.sweetshop.exception.EmailAlreadyExistsException;
import com.example.sweetshop.repository.UserRepository;
import com.example.sweetshop.security.JwtUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public void register(RegisterRequest req){

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        Users u = new Users();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRole("ROLE_USER");
        userRepository.save(u);

    }

    private void validateRegisterRequest(RegisterRequest req) {
        if (req.getEmail() == null || req.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email must not be empty");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        if (req.getUsername() == null || req.getUsername().isEmpty()) {
            throw new IllegalArgumentException("Username must not be empty");
        }
        if (req.getPassword() == null || req.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password must not be empty");
        }
    }

    public AuthResponse login(AuthRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        String token = jwtUtils.generateToken(authentication.getName());
        return new AuthResponse(token);
    }
}
