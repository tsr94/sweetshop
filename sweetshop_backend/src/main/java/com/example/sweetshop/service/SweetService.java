package com.example.sweetshop.service;

import com.example.sweetshop.dto.SweetDto;
import com.example.sweetshop.entity.Sweet;
import com.example.sweetshop.exception.InsufficientStockException;
import com.example.sweetshop.exception.SweetNotFoundException;
import com.example.sweetshop.mapper.SweetMapper;
import com.example.sweetshop.repository.SweetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SweetService {
    private final SweetRepository repo;

    public SweetService(SweetRepository repo) {
        this.repo = repo;
    }

    public Sweet addSweet(SweetDto dto) {
        Sweet s = new Sweet();
        s.setName(dto.getName());
        s.setCategory(dto.getCategory());
        s.setPrice(dto.getPrice());
        s.setQuantity(dto.getQuantity());
        return repo.save(s);
    }

    public List<Sweet> listAll() { return repo.findAll(); }

    public List<Sweet> searchByName(String name) { return repo.findByNameContainingIgnoreCase(name); }

    public List<Sweet> searchByCategory(String category) { return repo.findByCategoryIgnoreCase(category); }

    public List<Sweet> searchByPriceRange(Double min, Double max) { return repo.findByPriceBetween(min, max); }

    public Sweet updateSweet(Long id, SweetDto dto) {
        Sweet s = repo.findById(id).orElseThrow(() -> new  SweetNotFoundException(id));
        SweetMapper.updateEntityFromDto(s,dto);
        return repo.save(s);
    }

    public void deleteSweet(Long id) {
        Sweet s = repo.findById(id).orElseThrow(() -> new SweetNotFoundException(id));
        repo.deleteById(id);
    }

    @Transactional
    public Sweet purchase(Long id, int qty) {
        if(qty <= 0){
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        Sweet s = repo.findById(id).orElseThrow(() -> new SweetNotFoundException(id));
        if (s.getQuantity() < qty) throw new InsufficientStockException(s.getName(),s.getQuantity(),qty);
        s.setQuantity(s.getQuantity() - qty);
        return s;
    }

    @Transactional
    public Sweet restock(Long id, int qty) {
        Sweet s = repo.findById(id).orElseThrow(() -> new RuntimeException("Sweet not found"));
        s.setQuantity(s.getQuantity() + qty);
        return s;
    }
}
