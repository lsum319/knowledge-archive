package com.sumin.knowledgearchive.user.dto;

import com.sumin.knowledgearchive.user.UserDomain;
import lombok.Data;

@Data
public class UserResponse {

    private int id;
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
