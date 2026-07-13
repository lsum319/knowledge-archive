package com.sumin.knowledgearchive.user;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {

    //전체 유저 조회
    List<UserDomain> selectAllUser();
}
