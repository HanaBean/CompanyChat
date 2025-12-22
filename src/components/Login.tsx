import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LoginBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background: ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 32px;
  font-weight: bold;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 14px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
  
  &::placeholder {
    color: #999;
  }
`;

const LoginButton = styled.button`
  padding: 14px;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
  
  &:hover {
    background: ${theme.colors.primaryHover};
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4757;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

const TestInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
`;

const TestTitle = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  font-size: 14px;
`;

const TestItem = styled.div`
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 4px;
`;

interface LoginProps {
  onLogin: (userId: string, userName: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      setError('아이디를 입력해주세요.');
      return;
    }
    
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    // 로그인 시뮬레이션 (1초 대기)
    setTimeout(() => {
      // 테스트용: 아이디를 그대로 이름으로 사용
      const userName = userId;
      onLogin(userId, userName);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <LoginContainer>
      <LoginBox>
        <LoginHeader>
          <Logo>💬</Logo>
          <Title>Hurom messenger</Title>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="userId">아이디</Label>
            <Input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디를 입력하세요"
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
            />
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </LoginButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </LoginForm>

        <TestInfo>
          <TestTitle>🧪 테스트 계정</TestTitle>
          <TestItem>• 아이디: 아무거나 입력 (예: 김철수, 박영희)</TestItem>
          <TestItem>• 비밀번호: 아무거나 입력</TestItem>
          <TestItem>• 입력한 아이디가 사용자 이름으로 표시됩니다</TestItem>
        </TestInfo>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;