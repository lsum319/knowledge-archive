package com.sumin.knowledgearchive.user;

import com.sumin.knowledgearchive.user.dto.CreateUserRequest;
import com.sumin.knowledgearchive.user.dto.LoginRequest;
import com.sumin.knowledgearchive.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    public List<UserDomain> selectAllUser(){
        return userMapper.selectAllUser();
    }

    //회원가입
    public void insertUser(CreateUserRequest request){
        userMapper.insertUser(request.toDomain());
    }

    //로그인
    public UserResponse loginUser(LoginRequest request){
        // 유저가 입력한 email이 db에 존재하는지 조회하고
        // 존재하면 비밀번호 확인, 존재하지 않으면 가입되지 않은 유저임을 리턴

        UserDomain userDomain = userMapper.selectUserByEmail(request.getEmail());

        // 1. 가입여부 확인
        if(userDomain==null) {
            throw new RuntimeException("가입되지 않은 이메일입니다.");
        }

        // 2. 비밀번호 일치 확인
        if(!userDomain.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 비밀번호 일치하면 로그인 성공
        return UserResponse.from(userDomain);
    }
}
