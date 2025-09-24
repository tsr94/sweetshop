package com.example.sweetshop.service;

import com.example.sweetshop.dto.AuthRequest;
import com.example.sweetshop.dto.AuthResponse;
import com.example.sweetshop.security.JwtUtils;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceLoginTest {

    @Mock AuthenticationManager authenticationManager;
    @Mock
    JwtUtils jwtUtils;
    @Mock org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    @Mock com.example.sweetshop.repository.UserRepository userRepository;

    @InjectMocks
    AuthService authService;

    public AuthServiceLoginTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void loginShouldReturnToken() {
        AuthRequest req = new AuthRequest("alice@example.com", "password123");
        Authentication authMock = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authMock);
        when(authMock.getName()).thenReturn("alice@example.com");
        when(jwtUtils.generateToken("alice@example.com")).thenReturn("jwt-token-123");

        AuthResponse resp = authService.login(req);
        assert resp != null;
        assert "jwt-token-123".equals(resp.getToken());
    }

    @Test
    void loginShouldFailWhenBadCredentials() {
        AuthRequest req = new AuthRequest("alice@example.com", "wrong");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad creds"));

        try {
            authService.login(req);
            assert false;
        } catch (BadCredentialsException ex) {
            assert ex.getMessage().contains("Bad creds");
        }
    }
}
