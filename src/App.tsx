import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import OrganizationChart, { Employee } from './components/OrganizationChart';
import Login from './components/Login';
import { GlobalStyle } from './styles/GlobalStyle';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
}

interface User {
  id: string;
  name: string;
}

type ViewMode = 'chat' | 'organization';

const mockChats: Chat[] = [
  {
    id: '1',
    name: '김철수',
    lastMessage: '네, 알겠습니다. 내일 회의에서 뵙겠습니다.',
    timestamp: '오후 2:30',
    unreadCount: 0,
    isGroup: false
  },
  {
    id: '2',
    name: '개발팀',
    lastMessage: '이번 스프린트 계획 공유드립니다.',
    timestamp: '오후 1:15',
    unreadCount: 3,
    isGroup: true
  },
  {
    id: '3',
    name: '박영희',
    lastMessage: '문서 검토 완료했습니다.',
    timestamp: '오전 11:20',
    unreadCount: 1,
    isGroup: false
  }
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [chats, setChats] = useState<Chat[]>(mockChats);

  const handleLogin = (userId: string, userName: string) => {
    setUser({ id: userId, name: userName });
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedChat(null);
    setViewMode('chat');
  };

  const handleClearChatHistory = (chatId: string) => {
    // 해당 채팅의 메시지 내역을 삭제하는 로직은 ChatWindow에서 처리
    // 여기서는 마지막 메시지를 빈 문자열로 업데이트
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, lastMessage: '', unreadCount: 0 } : chat
    ));
  };

  const handleSelectChat = (chat: Chat) => {
    // 선택된 채팅의 읽지 않은 메시지 수를 0으로 설정
    setChats(prev => prev.map(c => 
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    ));
    setSelectedChat(chat);
  };

  const handleLeaveChat = (chatId: string) => {
    // 채팅 목록에서 해당 채팅 제거
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    
    // 현재 선택된 채팅이 삭제된 채팅이면 선택 해제
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
    }
  };

  const handleStartChat = (employee: Employee) => {
    // 기존 채팅이 있는지 확인
    const existingChat = chats.find(chat => chat.name === employee.name);
    
    if (existingChat) {
      // 기존 채팅이 있으면 선택
      handleSelectChat(existingChat);
    } else {
      // 새로운 채팅 생성
      const newChat: Chat = {
        id: `chat_${employee.id}`,
        name: employee.name,
        lastMessage: '',
        timestamp: '지금',
        unreadCount: 0,
        isGroup: false
      };
      
      setChats(prev => [newChat, ...prev]);
      setSelectedChat(newChat);
    }
    
    // 채팅 모드로 전환
    setViewMode('chat');
  };

  // 로그인하지 않은 경우 로그인 화면 표시
  if (!user) {
    return (
      <>
        <GlobalStyle />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <AppContainer>
      <GlobalStyle />
      <Sidebar 
        viewMode={viewMode} 
        onViewModeChange={setViewMode}
        user={user}
        onLogout={handleLogout}
      />
      <MainContent>
        {viewMode === 'chat' ? (
          <ChatList 
            chats={chats} 
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            currentUser={user}
            onLeaveChat={handleLeaveChat}
          />
        ) : (
          <OrganizationChart onStartChat={handleStartChat} />
        )}
        <ChatWindow selectedChat={selectedChat} currentUser={user} onClearChatHistory={handleClearChatHistory} />
      </MainContent>
    </AppContainer>
  );
}

export default App;