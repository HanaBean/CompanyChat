import React from 'react';
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
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChat, onSelectChat }) => {
  return (
    <ChatListContainer>
      <Header>
        <Title>채팅</Title>
        <SearchBox placeholder="대화 검색" />
      </Header>
      <ChatListContent>
        {chats.map(chat => (
          <ChatItem
            key={chat.id}
            isSelected={selectedChat?.id === chat.id}
            onClick={() => onSelectChat(chat)}
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
    </ChatListContainer>
  );
};

export default ChatList;