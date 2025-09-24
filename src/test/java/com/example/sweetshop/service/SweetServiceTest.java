package com.example.sweetshop.service;

import com.example.sweetshop.dto.SweetDto;
import com.example.sweetshop.entity.Sweet;
import com.example.sweetshop.repository.SweetRepository;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SweetServiceTest {

    @Mock SweetRepository repo;
    @InjectMocks SweetService service;

    public SweetServiceTest() { MockitoAnnotations.openMocks(this); }

    @Test
    void addSweetShouldSave() {
        SweetDto dto = new SweetDto(null,"Ladoo","Traditional",50.0,10);
        when(repo.save(any(Sweet.class))).thenAnswer(i -> {
            Sweet s = i.getArgument(0); s.setId(1L); return s;
        });

        Sweet saved = service.addSweet(dto);

        assertNotNull(saved.getId());
        assertEquals("Ladoo", saved.getName());
        verify(repo).save(any(Sweet.class));
    }

    @Test
    void purchaseShouldDecreaseQuantity() {
        Sweet s = new Sweet();
        s.setId(1L); s.setName("Barfi"); s.setQuantity(5);
        when(repo.findById(1L)).thenReturn(Optional.of(s));

        Sweet updated = service.purchase(1L, 2);

        assertEquals(3, updated.getQuantity());
    }

    @Test
    void purchaseShouldFailWhenNotEnoughStock() {
        Sweet s = new Sweet();
        s.setId(1L); s.setQuantity(1);
        when(repo.findById(1L)).thenReturn(Optional.of(s));

        assertThrows(IllegalArgumentException.class, () -> service.purchase(1L, 5));
    }

    @Test
    void searchByNameShouldReturnMatches() {
        Sweet s = new Sweet();
        s.setId(1L); s.setName("Ladoo"); s.setCategory("Traditional");
        when(repo.findByNameContainingIgnoreCase("lad")).thenReturn(List.of(s));

        List<Sweet> results = service.searchByName("lad");

        assertEquals(1, results.size());
        assertEquals("Ladoo", results.get(0).getName());
    }

    @Test
    void updateSweetShouldChangeValues() {
        Sweet existing = new Sweet();
        existing.setId(1L); existing.setName("Ladoo"); existing.setQuantity(10);
        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(repo.save(any(Sweet.class))).thenAnswer(i -> i.getArgument(0));

        SweetDto dto = new SweetDto(1L,"Barfi","Milk",30.0,20);
        Sweet updated = service.updateSweet(1L, dto);

        assertEquals("Barfi", updated.getName());
        assertEquals(20, updated.getQuantity());
    }

    @Test
    void deleteSweetShouldRemoveEntity() {
        service.deleteSweet(1L);
        verify(repo, times(1)).deleteById(1L);
    }

    @Test
    void restockShouldIncreaseQuantity() {
        Sweet s = new Sweet();
        s.setId(1L); s.setQuantity(5);
        when(repo.findById(1L)).thenReturn(Optional.of(s));

        Sweet updated = service.restock(1L, 10);

        assertEquals(15, updated.getQuantity());
    }



}
