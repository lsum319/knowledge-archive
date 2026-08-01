package com.sumin.knowledgearchive.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 유효성 검증
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e){
        // 검증 실패 메시지 중 첫 번째 defaultMessage만 추출
        String errorMessage = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        ErrorResponse response = new ErrorResponse(errorMessage);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    // 중복 이메일
    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmailException(DuplicateEmailException e){
        ErrorResponse response = new ErrorResponse(e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    // 입력된 이메일과 일치하는 유저 없음
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException e) {
        ErrorResponse response = new ErrorResponse(e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
    
    // 비밀번호 틀림
    @ExceptionHandler(WrongPasswordException.class)
    public ResponseEntity<ErrorResponse> handleWrongPassword(WrongPasswordException e){
        ErrorResponse resppnses = new ErrorResponse(e.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(resppnses);
    }

}
