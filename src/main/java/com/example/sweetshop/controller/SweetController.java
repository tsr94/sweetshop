package com.example.sweetshop.controller;

import com.example.sweetshop.dto.SweetDto;
import com.example.sweetshop.entity.Sweet;
import com.example.sweetshop.service.SweetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {
    private final SweetService service;
    public SweetController(SweetService service) { this.service = service; }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Sweet> addSweet(@RequestBody SweetDto dto) {
        return ResponseEntity.ok(service.addSweet(dto));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Sweet> listAll() { return service.listAll(); }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public List<Sweet> search(@RequestParam(required = false) String name,
                              @RequestParam(required = false) String category,
                              @RequestParam(required = false) Double minPrice,
                              @RequestParam(required = false) Double maxPrice) {
        if (name != null) return service.searchByName(name);
        if (category != null) return service.searchByCategory(category);
        if (minPrice != null && maxPrice != null) return service.searchByPriceRange(minPrice, maxPrice);
        return service.listAll();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Sweet update(@PathVariable Long id, @RequestBody SweetDto dto) {
        return service.updateSweet(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteSweet(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/purchase")
    @PreAuthorize("isAuthenticated()")
    public Sweet purchase(@PathVariable Long id, @RequestParam int qty) {
        return service.purchase(id, qty);
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public Sweet restock(@PathVariable Long id, @RequestParam int qty) {
        return service.restock(id, qty);
    }
}
