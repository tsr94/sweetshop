package com.example.sweetshop.service;

import com.example.sweetshop.dto.RegisterRequest;
import com.example.sweetshop.entity.Users;
import com.example.sweetshop.exception.EmailAlreadyExistsException;
import com.example.sweetshop.repository.UserRepository;
import com.example.sweetshop.security.JwtUtils;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.*;

class AuthServiceRegisterTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock AuthenticationManager authenticationManager;
    @Mock
    JwtUtils jwtUtils;

    @InjectMocks
    AuthService authService;

    public AuthServiceRegisterTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerShouldSaveUser() {
        RegisterRequest req = new RegisterRequest("alice", "alice@example.com", "password123","ADMIN");
        when(userRepository.existsByEmail(req.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(req.getPassword())).thenReturn("encoded-password");

        authService.register(req);

        ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);
        verify(userRepository, times(1)).save(captor.capture());
        Users saved = captor.getValue();
        assert saved.getEmail().equals("alice@example.com");
        assert saved.getPassword().equals("encoded-password");
        assert saved.getRole().equals("ROLE_USER");
    }

    @Test
    void registerShouldThrowWhenEmailExists() {
        RegisterRequest req = new RegisterRequest("bob", "bob@example.com", "pass","USER");
        when(userRepository.existsByEmail(req.getEmail())).thenReturn(true);

        try {
            authService.register(req);
            assert false; // should not reach
        } catch (EmailAlreadyExistsException ex) {
            assert ex.getMessage().contains("Email already exists");
        }
    }
}
