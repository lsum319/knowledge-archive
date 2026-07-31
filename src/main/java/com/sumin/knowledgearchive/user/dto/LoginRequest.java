package com.sumin.knowledgearchive.user.dto;

import com.sumin.knowledgearchive.user.UserDomain;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 5, max = 15, message = "비밀번호는 5자 이상 15자 이하로 입력해주세요.")
    private String password;

    public UserDomain toDomain() {
        UserDomain domain = new UserDomain();
        domain.setEmail(email);
        domain.setPassword(password);
        return domain;
    }
}
