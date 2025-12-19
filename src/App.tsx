import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import OrganizationChart, { Employee } from './components/OrganizationChart';
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
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [chats, setChats] = useState<Chat[]>(mockChats);

  const handleStartChat = (employee: Employee) => {
    // 기존 채팅이 있는지 확인
    const existingChat = chats.find(chat => chat.name === employee.name);
    
    if (existingChat) {
      // 기존 채팅이 있으면 선택
      setSelectedChat(existingChat);
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

  return (
    <AppContainer>
      <GlobalStyle />
      <Sidebar viewMode={viewMode} onViewModeChange={setViewMode} />
      <MainContent>
        {viewMode === 'chat' ? (
          <ChatList 
            chats={chats} 
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
          />
        ) : (
          <OrganizationChart onStartChat={handleStartChat} />
        )}
        <ChatWindow selectedChat={selectedChat} />
      </MainContent>
    </AppContainer>
  );
}

export default App;