package com.sumin.knowledgearchive.user;

import com.sumin.knowledgearchive.user.dto.CreateUserRequest;
import com.sumin.knowledgearchive.user.dto.LoginRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "User", description = "회원 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    // 전체 유저 조회
    @GetMapping
    public List<UserDomain> selectAllUser(){
        return userService.selectAllUser();
    }

    // 유저 생성(회원가입)
    @Operation(summary = "회원가입", description = "신규 회원 생성")
    @PostMapping
    public void insertUser(@Valid @RequestBody CreateUserRequest request){
        userService.insertUser(request);
    }

    //로그인
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인")
    @GetMapping("/login")
    public void loginUser(@RequestBody LoginRequest request){
        userService.loginUser(request);
    }

}
