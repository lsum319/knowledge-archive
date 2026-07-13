package com.sumin.knowledgearchive.user;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDomain {
    private int id;
    private String email;
    private String password;
    private LocalDateTime createdAt;

}
