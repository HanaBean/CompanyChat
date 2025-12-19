# 사내메신저 (Company Messenger)

React + Electron 기반의 사내용 메신저 애플리케이션입니다.

## 주요 기능

- 🗨️ **1:1 및 그룹 채팅**: 개인 및 그룹 대화 지원
- 👥 **조직도**: 회사 조직도를 통한 직원 검색 및 대화 시작
- 📎 **파일 전송**: 드래그 앤 드롭으로 파일 및 이미지 전송
- 📋 **클립보드 지원**: Ctrl+V로 이미지 및 파일 붙여넣기
- ✅ **읽음 확인**: 메시지 읽음 상태 표시
- 🖼️ **이미지 뷰어**: 전송된 이미지 확대 보기
- 📥 **파일 다운로드**: 우클릭 메뉴를 통한 파일 저장

## 기술 스택

- **Frontend**: React 18, TypeScript, Styled-components
- **Desktop**: Electron 27
- **Build**: electron-builder (NSIS 설치파일 생성)

## 설치 및 실행

### 개발 환경 실행
```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# Electron 앱 실행 (별도 터미널)
npm run electron-dev
```

### 설치파일 생성
```bash
# React 앱 빌드
npm run build

# Windows 설치파일 생성
npm run build-installer
```

생성된 설치파일: `dist/사내메신저 Setup 1.0.0.exe`

## 프로젝트 구조

```
src/
├── components/
│   ├── ChatWindow.tsx      # 채팅 창
│   ├── ChatList.tsx        # 채팅 목록
│   ├── Sidebar.tsx         # 사이드바
│   └── OrganizationChart.tsx # 조직도
├── styles/
│   ├── GlobalStyle.ts      # 전역 스타일
│   └── theme.ts           # 테마 설정
└── App.tsx                # 메인 앱 컴포넌트

public/
└── electron.js            # Electron 메인 프로세스
```

## 사용법

1. **설치파일 실행**: `사내메신저 Setup 1.0.0.exe` 더블클릭
2. **설치 진행**: "다음" 버튼 클릭하여 설치 완료
3. **앱 실행**: 바탕화면 바로가기 또는 시작메뉴에서 실행
4. **채팅 시작**: 조직도에서 직원 더블클릭하여 대화 시작

## 라이선스

MIT License