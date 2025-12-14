package com.kheyma.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {
    
    // Pointcut for all repository methods
    @Pointcut("execution(* com.kheyma.repository.*.*(..))")
    public void repositoryMethods() {}
    
    // Pointcut for all service methods
    @Pointcut("execution(* com.kheyma.service.*.*(..))")
    public void serviceMethods() {}
    
    // Pointcut for all controller methods
    @Pointcut("execution(* com.kheyma.controller.*.*(..))")
    public void controllerMethods() {}
    
    // Before advice for all service methods
    @Before("serviceMethods()")
    public void logBeforeServiceMethod(JoinPoint joinPoint) {
        log.info(">>> Entering method: {} with arguments: {}",
                joinPoint.getSignature().toShortString(),
                Arrays.toString(joinPoint.getArgs()));
    }
    
    // After returning advice for all service methods
    @AfterReturning(pointcut = "serviceMethods()", returning = "result")
    public void logAfterServiceMethod(JoinPoint joinPoint, Object result) {
        log.info("<<< Method {} executed successfully. Returned: {}",
                joinPoint.getSignature().toShortString(),
                result != null ? result.getClass().getSimpleName() : "null");
    }
    
    // After throwing advice for all service methods
    @AfterThrowing(pointcut = "serviceMethods()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
        log.error("!!! Exception in method: {} with message: {}",
                joinPoint.getSignature().toShortString(),
                exception.getMessage());
    }
    
    // Around advice for measuring execution time
    @Around("serviceMethods() || controllerMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        Object result = joinPoint.proceed();
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        log.info("⏱ Method {} executed in {} ms",
                joinPoint.getSignature().toShortString(),
                executionTime);
        
        return result;
    }
    
    // Custom annotation for audit logging
    @Around("@annotation(com.kheyma.aspect.Auditable)")
    public Object auditLog(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        String user = getCurrentUser();
        LocalDateTime timestamp = LocalDateTime.now();
        
        log.info("🔍 AUDIT: User '{}' invoked {} at {}",
                user, methodName, timestamp);
        
        Object result = joinPoint.proceed();
        
        log.info("🔍 AUDIT: Method {} completed successfully for user '{}'",
                methodName, user);
        
        return result;
    }
    
    private String getCurrentUser() {
        try {
            return org.springframework.security.core.context.SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();
        } catch (Exception e) {
            return "anonymous";
        }
    }
}