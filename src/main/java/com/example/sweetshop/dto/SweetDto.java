package com.example.sweetshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SweetDto {
    private Long id;
    private String name;
    private String category;
    private Double price;
    private Integer quantity;


}
