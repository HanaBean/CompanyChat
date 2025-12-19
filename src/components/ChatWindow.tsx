import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const ChatWindowContainer = styled.div<{ splitView?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: ${props => props.splitView ? 'row' : 'column'};
  background-color: #ffffff;
`;

const ChatSection = styled.div<{ splitView?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  ${props => props.splitView && `
    border-right: 1px solid #e0e0e0;
    max-width: 60%;
  `}
`;

const ImageViewSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  min-width: 40%;
`;

const ImageViewHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ImageViewContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: #000;
  overflow: hidden;
`;

const FullSizeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
`;

const CloseButton = styled.button`
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #e8e8e8;
  }
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

const ChatHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ChatActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f8f9fa;
`;

const MessageGroup = styled.div`
  margin-bottom: 20px;
`;

const Message = styled.div<{ isMine: boolean }>`
  display: flex;
  justify-content: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  margin-bottom: 8px;
`;

const MessageBubble = styled.div<{ isMine: boolean; isRead?: boolean }>`
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 18px;
  background-color: ${props => {
    if (!props.isMine) return '#ffffff';
    return props.isRead ? '#ffffff' : theme.colors.primary;
  }};
  color: ${props => {
    if (!props.isMine) return '#333';
    return props.isRead ? '#333' : 'white';
  }};
  font-size: 14px;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: ${props => props.isRead && props.isMine ? '1px solid #e0e0e0' : 'none'};
`;

const MessageImage = styled.img`
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 5px;
  cursor: pointer;
`;

const PasteIndicator = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${theme.colors.primary};
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
`;

const MessageInfo = styled.div<{ isMine: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  justify-content: ${props => props.isMine ? 'flex-end' : 'flex-start'};
`;

const MessageTime = styled.span`
  font-size: 11px;
  color: #999;
`;

const SenderName = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`;

const InputContainer = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  background-color: #ffffff;
  position: relative;
`;

const PreviewContainer = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  border: 2px dashed ${theme.colors.primary};
  border-radius: 8px;
  background-color: #f8f9fa;
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const PreviewTitle = styled.h4`
  font-size: 14px;
  color: #333;
  margin: 0;
`;

const PreviewItemsGrid = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const PreviewItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
`;

const PreviewItemNumber = styled.div`
  position: absolute;
  top: -3px;
  left: -3px;
  width: 20px;
  height: 20px;
  background: ${theme.colors.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  z-index: 2;
`;

const PreviewItemDelete = styled.button`
  position: absolute;
  top: -3px;
  right: -3px;
  width: 20px;
  height: 20px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  z-index: 2;
  
  &:hover {
    background: #ff3742;
  }
`;

const PreviewActions = styled.div`
  display: flex;
  gap: 8px;
`;

const PreviewButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 4px 12px;
  border: 1px solid ${props => props.variant === 'primary' ? theme.colors.primary : '#ddd'};
  background: ${props => props.variant === 'primary' ? theme.colors.primary : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#666'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? theme.colors.primaryHover : '#f5f5f5'};
  }
`;

const PreviewImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
`;

const PreviewFile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${theme.colors.primary};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #333;
`;

const FileSize = styled.div`
  font-size: 12px;
  color: #666;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;
`;

const ModalButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.variant === 'primary' ? theme.colors.primary : '#ddd'};
  background: ${props => props.variant === 'primary' ? theme.colors.primary : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#666'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? theme.colors.primaryHover : '#f5f5f5'};
  }
`;

const DragOverlay = styled.div<{ isDragOver: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(139, 195, 74, 0.1);
  border: 2px dashed ${theme.colors.primary};
  display: ${props => props.isDragOver ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  font-size: 18px;
  color: ${theme.colors.primary};
  font-weight: bold;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  resize: none;
  font-size: 14px;
  line-height: 1.4;
  max-height: 100px;
  outline: none;
  
  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const FileButton = styled.button`
  padding: 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isMine: boolean;
  image?: string;
  type?: 'text' | 'image' | 'file';
  fileName?: string;
  fileSize?: number;
  fileData?: string;
  isRead?: boolean;
}

interface PreviewItem {
  id: string;
  type: 'image' | 'file';
  data: string;
  fileName?: string;
  fileSize?: number;
}

interface ChatWindowProps {
  selectedChat: Chat | null;
}

const mockMessages: { [chatId: string]: Message[] } = {
  '1': [
    {
      id: '1',
      text: '안녕하세요! 오늘 회의 자료 준비는 어떻게 되고 있나요?',
      sender: '김철수',
      timestamp: '오후 1:30',
      isMine: false
    },
    {
      id: '2',
      text: '네, 거의 완료되었습니다. 2시까지 공유드리겠습니다.',
      sender: '나',
      timestamp: '오후 1:32',
      isMine: true
    },
    {
      id: '3',
      text: '감사합니다. 그럼 회의실에서 뵙겠습니다.',
      sender: '김철수',
      timestamp: '오후 1:35',
      isMine: false
    }
  ],
  '2': [
    {
      id: '4',
      text: '이번 스프린트 계획 공유드립니다.',
      sender: '이팀장',
      timestamp: '오후 1:15',
      isMine: false
    },
    {
      id: '5',
      text: '확인했습니다. 질문이 있으면 말씀드리겠습니다.',
      sender: '나',
      timestamp: '오후 1:20',
      isMine: true
    }
  ]
};

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ [chatId: string]: Message[] }>(mockMessages);
  const [showPasteIndicator, setShowPasteIndicator] = useState(false);
  const [previewItemsByChat, setPreviewItemsByChat] = useState<{ [chatId: string]: PreviewItem[] }>({});
  const [showFileModal, setShowFileModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ show: boolean; x: number; y: number; data: any }>({
    show: false,
    x: 0,
    y: 0,
    data: null
  });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 현재 선택된 채팅의 미리보기 아이템들
  const currentPreviewItems = selectedChat ? (previewItemsByChat[selectedChat.id] || []) : [];

  const handleSendMessage = () => {
    if (!selectedChat) return;
    
    const hasText = message.trim();
    const hasPreview = currentPreviewItems.length > 0;
    
    // 텍스트나 미리보기 중 하나라도 있어야 전송
    if (!hasText && !hasPreview) return;
    
    const chatId = selectedChat.id;
    
    // 텍스트 메시지 전송
    if (hasText) {
      const textMessage: Message = {
        id: `msg_${Date.now()}`,
        text: message.trim(),
        sender: '나',
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        isMine: true,
        type: 'text',
        isRead: false
      };

      setChatMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), textMessage]
      }));
      
      // 3초 후 읽음 처리
      setTimeout(() => {
        setChatMessages(prev => ({
          ...prev,
          [chatId]: prev[chatId]?.map(msg => 
            msg.id === textMessage.id ? { ...msg, isRead: true } : msg
          ) || []
        }));
      }, 3000);
    }
    
    // 미리보기 이미지들 전송
    if (hasPreview) {
      currentPreviewItems.forEach(item => {
        if (item.type === 'image') {
          handleSendImage(item.data);
        }
      });
      
      // 미리보기 아이템들 제거
      setPreviewItemsByChat(prev => ({
        ...prev,
        [chatId]: []
      }));
    }
    
    // 입력창 초기화
    setMessage('');
  };

  const handleSendImage = (imageData: string) => {
    if (selectedChat) {
      const chatId = selectedChat.id; // 채팅 ID를 미리 저장
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        text: '',
        sender: '나',
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        isMine: true,
        image: imageData,
        type: 'image',
        isRead: false
      };

      setChatMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage]
      }));

      // 3초 후 읽음 처리
      setTimeout(() => {
        setChatMessages(prev => ({
          ...prev,
          [chatId]: prev[chatId]?.map(msg => 
            msg.id === newMessage.id ? { ...msg, isRead: true } : msg
          ) || []
        }));
      }, 3000);
    }
  };

  const handleSendFile = (file: File) => {
    if (selectedChat) {
      const chatId = selectedChat.id; // 채팅 ID를 미리 저장
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target?.result as string;
        const newMessage: Message = {
          id: `msg_${Date.now()}`,
          text: '',
          sender: '나',
          timestamp: new Date().toLocaleTimeString('ko-KR', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          isMine: true,
          type: 'file',
          fileName: file.name,
          fileSize: file.size,
          fileData: fileData,
          isRead: false
        };

        setChatMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), newMessage]
        }));

        // 3초 후 읽음 처리
        setTimeout(() => {
          setChatMessages(prev => ({
            ...prev,
            [chatId]: prev[chatId]?.map(msg => 
              msg.id === newMessage.id ? { ...msg, isRead: true } : msg
            ) || []
          }));
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 이미지 처리 - 미리보기로 추가
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageData = event.target?.result as string;
            const previewItem: PreviewItem = {
              id: `preview_${Date.now()}`,
              type: 'image',
              data: imageData
            };
            if (selectedChat) {
              setPreviewItemsByChat(prev => ({
                ...prev,
                [selectedChat.id]: [...(prev[selectedChat.id] || []), previewItem]
              }));
            }
          };
          reader.readAsDataURL(file);
        }
        return;
      }
      
      // 텍스트 처리 (기본 동작 허용)
      if (item.type === 'text/plain') {
        setShowPasteIndicator(true);
        setTimeout(() => setShowPasteIndicator(false), 1000);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          handleSendImage(imageData);
        };
        reader.readAsDataURL(file);
      }
      // 파일 입력 초기화
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      setPendingFile(file);
      setShowFileModal(true);
    }
  };

  const handleConfirmFileSend = () => {
    if (pendingFile) {
      handleSendFile(pendingFile);
      setPendingFile(null);
      setShowFileModal(false);
    }
  };

  const handleCancelFileSend = () => {
    setPendingFile(null);
    setShowFileModal(false);
  };

  const handleSendPreviewItem = (previewItem: PreviewItem) => {
    if (previewItem.type === 'image') {
      handleSendImage(previewItem.data);
    }
    if (selectedChat) {
      setPreviewItemsByChat(prev => ({
        ...prev,
        [selectedChat.id]: (prev[selectedChat.id] || []).filter(item => item.id !== previewItem.id)
      }));
    }
  };

  const handleSendAllPreviewItems = () => {
    if (!selectedChat) return;
    
    // 현재 채팅의 모든 미리보기 아이템을 한 번에 전송
    currentPreviewItems.forEach(item => {
      if (item.type === 'image') {
        handleSendImage(item.data);
      }
    });
    // 현재 채팅의 모든 미리보기 아이템 제거
    setPreviewItemsByChat(prev => ({
      ...prev,
      [selectedChat.id]: []
    }));
  };

  const handleRemovePreviewItem = (previewId: string) => {
    if (selectedChat) {
      setPreviewItemsByChat(prev => ({
        ...prev,
        [selectedChat.id]: (prev[selectedChat.id] || []).filter(item => item.id !== previewId)
      }));
    }
  };

  const handleImageClick = (imageData: string) => {
    setSelectedImage(imageData);
    setSplitView(true);
  };

  const handleCloseSplitView = () => {
    setSplitView(false);
    setSelectedImage(null);
  };

  const handleContextMenu = (e: React.MouseEvent, data: any) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      data: data
    });
  };

  const handleDownload = (data: string, fileName?: string, type?: 'image' | 'file') => {
    const link = document.createElement('a');
    link.href = data;
    
    if (type === 'image') {
      link.download = fileName || `image_${Date.now()}.png`;
    } else if (type === 'file') {
      link.download = fileName || `file_${Date.now()}`;
    } else {
      // data URL에서 확장자 추출 시도
      const mimeMatch = data.match(/data:([^;]+)/);
      const extension = mimeMatch ? mimeMatch[1].split('/')[1] : 'png';
      link.download = fileName || `download_${Date.now()}.${extension}`;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setContextMenu({ show: false, x: 0, y: 0, data: null });
  };

  const handleFileClick = (fileData: string, fileName: string) => {
    handleDownload(fileData, fileName, 'file');
  };

  const handleCopyToClipboard = async (data: string, type: 'image' | 'file') => {
    try {
      if (type === 'image') {
        // 이미지를 클립보드에 복사
        const response = await fetch(data);
        const blob = await response.blob();
        
        if (navigator.clipboard && window.ClipboardItem) {
          const clipboardItem = new ClipboardItem({
            [blob.type]: blob
          });
          await navigator.clipboard.write([clipboardItem]);
        } else {
          // 폴백: 이미지 URL을 텍스트로 복사
          await navigator.clipboard.writeText(data);
        }
      } else {
        // 파일의 경우 데이터 URL을 텍스트로 복사
        await navigator.clipboard.writeText(data);
      }
      
      // 성공 알림 (선택사항)
      console.log('클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      // 폴백: 텍스트로 복사 시도
      try {
        await navigator.clipboard.writeText(data);
      } catch (fallbackErr) {
        console.error('폴백 복사도 실패:', fallbackErr);
      }
    }
    
    setContextMenu({ show: false, x: 0, y: 0, data: null });
  };

  // 키보드 단축키로 붙여넣기 감지 및 컨텍스트 메뉴 닫기
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && inputRef.current === document.activeElement) {
        setShowPasteIndicator(true);
        setTimeout(() => setShowPasteIndicator(false), 1000);
      }
    };

    const handleGlobalClick = () => {
      setContextMenu({ show: false, x: 0, y: 0, data: null });
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  if (!selectedChat) {
    return (
      <ChatWindowContainer>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: '#999',
          fontSize: '16px'
        }}>
          대화를 선택해주세요
        </div>
      </ChatWindowContainer>
    );
  }

  return (
    <ChatWindowContainer 
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      splitView={splitView}
    >
      <DragOverlay isDragOver={isDragOver}>
        📁 파일을 여기에 놓으세요
      </DragOverlay>
      
      <ChatSection splitView={splitView}>
      
      <ChatHeader>
        <ChatTitle>{selectedChat.name}</ChatTitle>
        <ChatActions>
          <ActionButton>초대</ActionButton>
          <ActionButton>설정</ActionButton>
        </ChatActions>
      </ChatHeader>
      
      <MessagesContainer>
        <MessageGroup>
          {(chatMessages[selectedChat.id] || []).length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#999', 
              marginTop: '50px',
              fontSize: '14px'
            }}>
              {selectedChat.name}님과의 대화를 시작해보세요.
            </div>
          ) : (
            (chatMessages[selectedChat.id] || []).map(msg => (
              <div key={msg.id}>
                <Message isMine={msg.isMine}>
                  <MessageBubble isMine={msg.isMine} isRead={msg.isRead}>
                    {msg.type === 'image' && msg.image ? (
                      <MessageImage 
                        src={msg.image} 
                        alt="첨부 이미지"
                        onClick={() => handleImageClick(msg.image!)}
                        onContextMenu={(e) => handleContextMenu(e, { type: 'image', data: msg.image, fileName: `image_${msg.id}.png` })}
                      />
                    ) : msg.type === 'file' ? (
                      <PreviewFile 
                        onClick={() => handleFileClick(msg.fileData!, msg.fileName!)}
                        onContextMenu={(e) => handleContextMenu(e, { type: 'file', data: msg.fileData, fileName: msg.fileName })}
                        style={{ cursor: 'pointer' }}
                      >
                        <FileIcon>{getFileExtension(msg.fileName || '')}</FileIcon>
                        <FileInfo>
                          <FileName>{msg.fileName}</FileName>
                          <FileSize>{formatFileSize(msg.fileSize || 0)}</FileSize>
                        </FileInfo>
                      </PreviewFile>
                    ) : (
                      msg.text
                    )}
                  </MessageBubble>
                </Message>
                <MessageInfo isMine={msg.isMine}>
                  {!msg.isMine && <SenderName>{msg.sender}</SenderName>}
                  <MessageTime>{msg.timestamp}</MessageTime>
                  {msg.isMine && (
                    <MessageTime>{msg.isRead ? '읽음' : '안읽음'}</MessageTime>
                  )}
                </MessageInfo>
              </div>
            ))
          )}
        </MessageGroup>
      </MessagesContainer>
      
      <InputContainer>
        {showPasteIndicator && (
          <PasteIndicator>
            클립보드에서 붙여넣기 중...
          </PasteIndicator>
        )}
        
        {currentPreviewItems.length > 0 && (
          <PreviewContainer>
            <PreviewHeader>
              <PreviewTitle>미리보기 ({currentPreviewItems.length}개)</PreviewTitle>
              <PreviewActions>
                <PreviewButton 
                  variant="primary"
                  onClick={handleSendAllPreviewItems}
                >
                  모두 전송
                </PreviewButton>
                <PreviewButton 
                  variant="secondary"
                  onClick={() => {
                    if (selectedChat) {
                      setPreviewItemsByChat(prev => ({
                        ...prev,
                        [selectedChat.id]: []
                      }));
                    }
                  }}
                >
                  모두 취소
                </PreviewButton>
              </PreviewActions>
            </PreviewHeader>
            <PreviewItemsGrid>
              {currentPreviewItems.map((item, index) => (
                <PreviewItemWrapper key={item.id}>
                  <PreviewItemNumber>{index + 1}</PreviewItemNumber>
                  <PreviewItemDelete 
                    onClick={() => handleRemovePreviewItem(item.id)}
                    title="삭제"
                  >
                    ×
                  </PreviewItemDelete>
                  {item.type === 'image' && (
                    <PreviewImage src={item.data} alt={`미리보기 ${index + 1}`} />
                  )}
                </PreviewItemWrapper>
              ))}
            </PreviewItemsGrid>
          </PreviewContainer>
        )}
        
        <InputWrapper>
          <FileButton 
            title="파일 첨부"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            📎
          </FileButton>
          <input
            id="file-input"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <MessageInput
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="메시지를 입력하세요... (파일 드래그 또는 Ctrl+V로 붙여넣기)"
            rows={1}
          />
          <SendButton 
            onClick={handleSendMessage}
            disabled={!message.trim() && currentPreviewItems.length === 0}
          >
            전송
          </SendButton>
        </InputWrapper>
      </InputContainer>

      {showFileModal && pendingFile && (
        <Modal>
          <ModalContent>
            <ModalTitle>파일 전송</ModalTitle>
            <PreviewFile>
              <FileIcon>{getFileExtension(pendingFile.name)}</FileIcon>
              <FileInfo>
                <FileName>{pendingFile.name}</FileName>
                <FileSize>{formatFileSize(pendingFile.size)}</FileSize>
              </FileInfo>
            </PreviewFile>
            <p style={{ margin: '15px 0', color: '#666', fontSize: '14px' }}>
              이 파일을 전송하시겠습니까?
            </p>
            <ModalActions>
              <ModalButton variant="secondary" onClick={handleCancelFileSend}>
                취소
              </ModalButton>
              <ModalButton variant="primary" onClick={handleConfirmFileSend}>
                전송
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
      </ChatSection>

      {splitView && selectedImage && (
        <ImageViewSection>
          <ImageViewHeader>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>이미지 보기</h3>
            <CloseButton onClick={handleCloseSplitView}>
              닫기
            </CloseButton>
          </ImageViewHeader>
          <ImageViewContent>
            <FullSizeImage 
              src={selectedImage} 
              alt="확대된 이미지"
              onContextMenu={(e) => handleContextMenu(e, { type: 'image', data: selectedImage, fileName: `image_${Date.now()}.png` })}
            />
          </ImageViewContent>
        </ImageViewSection>
      )}

      {contextMenu.show && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} show={contextMenu.show}>
          <ContextMenuItem onClick={() => handleCopyToClipboard(contextMenu.data.data, contextMenu.data.type)}>
            복사
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleDownload(contextMenu.data.data, contextMenu.data.fileName, contextMenu.data.type)}>
            다운로드
          </ContextMenuItem>
          {contextMenu.data.type === 'image' && (
            <ContextMenuItem onClick={() => window.open(contextMenu.data.data, '_blank')}>
              새 창에서 열기
            </ContextMenuItem>
          )}
        </ContextMenu>
      )}
    </ChatWindowContainer>
  );
};

export default ChatWindow;