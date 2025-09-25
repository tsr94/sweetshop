package com.example.sweetshop.controller;

import com.example.sweetshop.dto.SweetDto;
import com.example.sweetshop.entity.Sweet;
import com.example.sweetshop.mapper.SweetMapper;
import com.example.sweetshop.service.SweetService;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class SweetControllerTest {

    @Mock private SweetService service;

    @InjectMocks private SweetController controller;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void listAllShouldReturnDtos() {
        Sweet s = new Sweet();
        s.setId(1L);
        s.setName("Ladoo");
        s.setCategory("Traditional");
        s.setPrice(50.0);
        s.setQuantity(10);

        when(service.listAll()).thenReturn(List.of(s));

        List<SweetDto> response = controller.listAll();

        assertEquals(1, response.size());
        SweetDto dto = response.get(0);
        assertEquals(1L, dto.getId());
        assertEquals("Ladoo", dto.getName());
        assertEquals("Traditional", dto.getCategory());
        assertEquals(50.0, dto.getPrice());
        assertEquals(10, dto.getQuantity());
    }

    @Test
    void addSweetShouldReturnDto() {
        Sweet s = new Sweet();
        s.setId(1L);
        s.setName("Barfi");
        s.setCategory("Milk");
        s.setPrice(30.0);
        s.setQuantity(5);

        SweetDto inputDto = new SweetDto(null, "Barfi", "Milk", 30.0, 5);
        when(service.addSweet(any(SweetDto.class))).thenReturn(s);

        ResponseEntity<SweetDto> resp = controller.addSweet(inputDto);

        assertEquals(200, resp.getStatusCodeValue());
        SweetDto body = resp.getBody();
        assertNotNull(body);
        assertEquals(1L, body.getId());
        assertEquals("Barfi", body.getName());
        assertEquals(5, body.getQuantity());
    }
}