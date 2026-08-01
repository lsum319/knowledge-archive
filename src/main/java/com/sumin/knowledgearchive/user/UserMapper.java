package com.sumin.knowledgearchive.user;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {

    //전체 유저 조회
    List<UserDomain> selectAllUser();

    //유저 생성
    int insertUser(UserDomain domain);

    //같은 email가진 유저 조회
    UserDomain selectUserByEmail(String email);

}
