package com.sumin.knowledgearchive.security;

import com.sumin.knowledgearchive.user.UserDomain;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {
    private final UserDomain userDomain;

    public CustomUserDetails(UserDomain userDomain) {
        this.userDomain = userDomain;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    public int getUserId() {
        return userDomain.getId();
    }

    @Override
    public String getPassword() {
        return userDomain.getPassword();
    }

    @Override
    public String getUsername() {
        return userDomain.getEmail();
    }
}
