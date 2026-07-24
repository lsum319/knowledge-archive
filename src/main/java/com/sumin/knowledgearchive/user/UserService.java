package com.sumin.knowledgearchive.user;

import com.sumin.knowledgearchive.user.dto.CreateUserRequest;
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

    public void insertUser(CreateUserRequest request){
        userMapper.insertUser(request.toDomain());
    }

}
