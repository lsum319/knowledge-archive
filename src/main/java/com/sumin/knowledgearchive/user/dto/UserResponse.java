package com.sumin.knowledgearchive.user.dto;

import com.sumin.knowledgearchive.user.UserDomain;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserResponse {
    @NotBlank
    private int id;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    public static UserResponse from(UserDomain domain) {
        if (domain == null) {
            System.out.println("db에 조회된 값이 없습니다.");
            return null;
        }
        UserResponse response = new UserResponse();
        response.setId(domain.getId());
        response.setEmail(domain.getEmail());
        return response;
    }
}
