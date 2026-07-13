package com.sumin.knowledgearchive.user;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private int id;
    private String email;
    private String password;
    private LocalDateTime createdAt;
}
