package com.example.sweetshop.controller;

import com.example.sweetshop.dto.SweetDto;
import com.example.sweetshop.entity.Sweet;
import com.example.sweetshop.mapper.SweetMapper;
import com.example.sweetshop.service.SweetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/sweets")
public class SweetController {
    private final SweetService service;
    public SweetController(SweetService service) { this.service = service; }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetDto> addSweet(@Valid @RequestBody SweetDto dto) {
        Sweet created = service.addSweet(dto);
        return ResponseEntity.ok(SweetMapper.toDto(created));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<SweetDto> listAll() {
        return service.listAll()
                .stream()
                .map(SweetMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public List<SweetDto> search(@RequestParam(required = false) String name,
                              @RequestParam(required = false) String category,
                              @RequestParam(required = false) Double minPrice,
                              @RequestParam(required = false) Double maxPrice) {
        List<Sweet> results;
        if (name != null) results = service.searchByName(name);
        else if (category != null) results = service.searchByCategory(category);
        else if (minPrice != null && maxPrice != null) results = service.searchByPriceRange(minPrice, maxPrice);
        else results =service.listAll();

        return results.stream()
                .map(SweetMapper::toDto)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetDto> update(@PathVariable Long id, @Valid @RequestBody SweetDto dto) {
        Sweet updated = service.updateSweet(id, dto);
        return ResponseEntity.ok(SweetMapper.toDto(updated));
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteSweet(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/purchase")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SweetDto> purchase(@PathVariable Long id, @RequestParam int qty) {
        Sweet purchased = service.purchase(id, qty);
        return ResponseEntity.ok(SweetMapper.toDto(purchased));
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetDto> restock(@PathVariable Long id, @RequestParam int qty) {
        Sweet restocked = service.restock(id, qty);
        return ResponseEntity.ok(SweetMapper.toDto(restocked));
    }
}
