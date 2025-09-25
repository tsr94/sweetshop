package com.example.sweetshop.mapper;

import com.example.sweetshop.dto.SweetDto;
import com.example.sweetshop.entity.Sweet;

public class SweetMapper {

    public static SweetDto toDto(Sweet s){
        return new SweetDto(s.getId(), s.getName(),s.getCategory(), s.getPrice(), s.getQuantity());
    }

    public static Sweet toEntity(SweetDto dto){
        Sweet s = new Sweet();
        s.setId(dto.getId());
        s.setName(dto.getName());
        s.setCategory(dto.getCategory());
        s.setPrice(dto.getPrice());
        s.setQuantity(dto.getQuantity());
        return s;
    }

    public static void updateEntityFromDto(Sweet s, SweetDto dto){
        s.setName(dto.getName());
        s.setCategory(dto.getCategory());
        s.setPrice(dto.getPrice());
        s.setQuantity(dto.getQuantity());
    }
}
