package com.sumin.knowledgearchive.user.dto;

import com.sumin.knowledgearchive.user.UserDomain;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateUserRequest {
    private String email;
    private String password;

    public UserDomain toDomain(){
        UserDomain domain = new UserDomain();
        domain.setEmail(email);
        domain.setPassword(password);
        return domain;
    }
}
