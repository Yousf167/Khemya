package com.kheyma.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            final String jwt = authHeader.substring(7);
            
            // Validate token structure first
            if (jwt == null || jwt.trim().isEmpty()) {
                log.warn("Empty JWT token in request to: {}", request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }
            
            final String userEmail = jwtUtil.extractUsername(jwt);
            
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                    
                    if (jwtUtil.validateToken(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken = 
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );
                        authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        log.debug("Successfully authenticated user: {} for request: {}", userEmail, request.getRequestURI());
                    } else {
                        log.warn("Token validation failed for user: {} on request: {}", userEmail, request.getRequestURI());
                    }
                } catch (UsernameNotFoundException e) {
                    log.error("User not found for email: {} extracted from token. Request: {}", userEmail, request.getRequestURI());
                    SecurityContextHolder.clearContext();
                }
            } else {
                if (userEmail == null) {
                    log.warn("Could not extract username from JWT token. Request: {}", request.getRequestURI());
                }
            }
        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired for request: {}. Error: {}", request.getRequestURI(), e.getMessage());
            SecurityContextHolder.clearContext();
        } catch (MalformedJwtException e) {
            log.warn("Malformed JWT token for request: {}. Error: {}", request.getRequestURI(), e.getMessage());
            SecurityContextHolder.clearContext();
        } catch (SignatureException e) {
            log.error("JWT signature validation failed for request: {}. Error: {}", request.getRequestURI(), e.getMessage());
            SecurityContextHolder.clearContext();
        } catch (JwtException e) {
            log.error("JWT processing failed for request: {}. Error: {}", request.getRequestURI(), e.getMessage());
            SecurityContextHolder.clearContext();
        } catch (Exception e) {
            log.error("Unexpected error during JWT authentication for request: {}. Error: {}", 
                    request.getRequestURI(), e.getMessage(), e);
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }
}