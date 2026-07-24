package com.sumin.knowledgearchive.user;

import com.sumin.knowledgearchive.user.dto.CreateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // 유저 생성(회원가입
    @PostMapping
    public void insertUser(@RequestBody CreateUserRequest request){
        userService.insertUser(request);
    }

}
