package com.sumin.knowledgearchive.security;

import com.sumin.knowledgearchive.user.UserDomain;
import com.sumin.knowledgearchive.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserMapper userMapper;

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 아이디(email)로 db에서 해당 유저 정보 조회해옴
        UserDomain userDomain = userMapper.selectUserByEmail(email);
        if (userDomain == null) {
            throw new UsernameNotFoundException("가입되지 않은 이메일입니다.");
        }
        return new CustomUserDetails(userDomain);
    }
}
