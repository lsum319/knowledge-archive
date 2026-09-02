package com.sumin.knowledgearchive.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

// 사용자 정보를 가져오기 위한 클래스
public class SecurityUtils {

    public static int getCurrentUserId() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        return userDetails.getUserId();
    }
}
