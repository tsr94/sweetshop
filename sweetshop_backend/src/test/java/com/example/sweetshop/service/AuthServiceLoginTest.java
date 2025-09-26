package com.example.sweetshop.service;

import com.example.sweetshop.dto.AuthRequest;
import com.example.sweetshop.dto.LoginResponse;
import com.example.sweetshop.entity.Users;
import com.example.sweetshop.security.JwtUtils;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceLoginTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Mock
    private com.example.sweetshop.repository.UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    void loginShouldReturnToken() {
        // Arrange
        AuthRequest req = new AuthRequest("alice@example.com", "password123");
        Authentication authMock = mock(Authentication.class);
        Users user = new Users();
        user.setUsername("alice");
        user.setEmail("alice@example.com");
        user.setRole("USER");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authMock);
        when(authMock.getName()).thenReturn("alice@example.com");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(jwtUtils.generateToken("alice@example.com")).thenReturn("jwt-token-123");

        // Act
        LoginResponse resp = authService.login(req);

        // Assert
        assert resp != null;
        assert "jwt-token-123".equals(resp.getToken());
        assert "alice".equals(resp.getUsername());
        assert "alice@example.com".equals(resp.getEmail());
        assert "USER".equals(resp.getRole());
    }

    @Test
    void loginShouldFailWhenBadCredentials() {
        // Arrange
        AuthRequest req = new AuthRequest("alice@example.com", "wrong");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad creds"));

        // Act & Assert
        try {
            authService.login(req);
            assert false : "Expected BadCredentialsException to be thrown";
        } catch (BadCredentialsException ex) {
            assert ex.getMessage().contains("Bad creds");
        }
    }

    @Test
    void loginShouldHandleUserNotFoundAfterAuthentication() {
        // Arrange
        AuthRequest req = new AuthRequest("alice@example.com", "password123");
        Authentication authMock = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authMock);
        when(authMock.getName()).thenReturn("alice@example.com");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        try {
            authService.login(req);
            assert false : "Expected RuntimeException to be thrown when user not found";
        } catch (RuntimeException ex) {
            assert ex.getMessage().contains("User not found for email: alice@example.com");
        }
    }
}