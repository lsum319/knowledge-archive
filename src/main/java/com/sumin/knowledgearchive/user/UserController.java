package com.sumin.knowledgearchive.user;

import com.sumin.knowledgearchive.user.dto.CreateUserRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public List<UserDomain> selectAllUser() {
        return userService.selectAllUser();
    }
    
    // 이메일 중복 확인
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailDuplicate(@RequestParam("email") String email) {
        return ResponseEntity.ok(userService.existsByEmail(email));
    }

    // 유저 생성(회원가입)
    @Operation(summary = "회원가입", description = "신규 회원 생성")
    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Valid @RequestBody CreateUserRequest request){
        userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    //로그인
/*    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인")
    @GetMapping("/login")
    public void loginUser(@RequestBody LoginRequest request){
        userService.loginUser(request);
    }*/

}
