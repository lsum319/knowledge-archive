package com.sumin.knowledgearchive.user.dto;

import com.sumin.knowledgearchive.user.UserDomain;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;

    public UserDomain toDomain() {
        UserDomain domain = new UserDomain();
        domain.setEmail(email);
        domain.setPassword(password);
        return domain;
    }
}
