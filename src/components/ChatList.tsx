import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const ChatListContainer = styled.div`
  width: 300px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
`;

const WelcomeMessage = styled.div`
  color: #333;
  padding: 12px 0;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border-bottom: 2px solid ${theme.colors.primary};
  position: relative;
  
  &::before {
    content: '👋';
    margin-right: 8px;
  }
`;

const UserName = styled.span`
  font-weight: 700;
  color: #000;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const ChatListContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChatItem = styled.div<{ isSelected: boolean }>`
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  background-color: ${props => props.isSelected ? theme.colors.primaryLight : 'transparent'};
  
  &:hover {
    background-color: ${props => props.isSelected ? theme.colors.primaryLight : '#f5f5f5'};
  }
`;

const ChatItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const ChatName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #999;
`;

const ChatPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: #666;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ContextMenu = styled.div<{ x: number; y: number; show: boolean }>`
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  display: ${props => props.show ? 'block' : 'none'};
  min-width: 150px;
`;

const ContextMenuItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  color: #ff4757;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:first-child {
    border-radius: 4px 4px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 4px 4px;
  }
`;

const UnreadBadge = styled.div`
  background-color: ${theme.colors.danger};
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 11px;
  min-width: 18px;
  text-align: center;
  margin-left: 8px;
`;

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  currentUser: { id: string; name: string };
  onLeaveChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChat, onSelectChat, currentUser, onLeaveChat }) => {
  const [contextMenu, setContextMenu] = useState<{ show: boolean; x: number; y: number; chatId: string }>({
    show: false,
    x: 0,
    y: 0,
    chatId: ''
  });

  const handleContextMenu = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      chatId: chatId
    });
  };

  const handleLeaveChat = () => {
    onLeaveChat(contextMenu.chatId);
    setContextMenu({ show: false, x: 0, y: 0, chatId: '' });
  };

  const handleGlobalClick = () => {
    setContextMenu({ show: false, x: 0, y: 0, chatId: '' });
  };

  React.useEffect(() => {
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <ChatListContainer>
      <Header>
        <WelcomeMessage>
          <UserName>{currentUser.name}</UserName>님 환영합니다!
        </WelcomeMessage>
        <Title>채팅</Title>
        <SearchBox placeholder="대화 검색" />
      </Header>
      <ChatListContent>
        {chats.map(chat => (
          <ChatItem
            key={chat.id}
            isSelected={selectedChat?.id === chat.id}
            onClick={() => onSelectChat(chat)}
            onContextMenu={(e) => handleContextMenu(e, chat.id)}
          >
            <ChatItemHeader>
              <ChatName>{chat.name}</ChatName>
              <Timestamp>{chat.timestamp}</Timestamp>
            </ChatItemHeader>
            <ChatPreview>
              <LastMessage>{chat.lastMessage}</LastMessage>
              {chat.unreadCount > 0 && (
                <UnreadBadge>{chat.unreadCount}</UnreadBadge>
              )}
            </ChatPreview>
          </ChatItem>
        ))}
      </ChatListContent>
      
      {contextMenu.show && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} show={contextMenu.show}>
          <ContextMenuItem onClick={handleLeaveChat}>
            대화방 나가기
          </ContextMenuItem>
        </ContextMenu>
      )}
    </ChatListContainer>
  );
};

export default ChatList;