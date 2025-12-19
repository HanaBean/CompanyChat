import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const OrgContainer = styled.div`
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

const OrgContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Department = styled.div`
  margin-bottom: 10px;
`;

const DepartmentHeader = styled.div`
  padding: 12px 20px;
  background-color: #f0f0f0;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #e8e8e8;
  }
`;

const ExpandIcon = styled.span<{ expanded: boolean }>`
  margin-right: 8px;
  transform: ${props => props.expanded ? 'rotate(90deg)' : 'rotate(0deg)'};
  transition: transform 0.2s;
`;

const EmployeeList = styled.div<{ expanded: boolean }>`
  display: ${props => props.expanded ? 'block' : 'none'};
`;

const EmployeeItem = styled.div`
  padding: 10px 20px 10px 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const StatusIndicator = styled.div<{ status: 'online' | 'away' | 'offline' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: ${props => {
    switch (props.status) {
      case 'online': return theme.colors.status.online;
      case 'away': return theme.colors.status.away;
      case 'offline': return theme.colors.status.offline;
      default: return theme.colors.status.offline;
    }
  }};
`;

const EmployeeInfo = styled.div`
  flex: 1;
`;

const EmployeeName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const EmployeePosition = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`;

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  status: 'online' | 'away' | 'offline';
  email: string;
}

interface DepartmentData {
  name: string;
  employees: Employee[];
}

interface OrganizationChartProps {
  onStartChat: (employee: Employee) => void;
}

const mockOrgData: DepartmentData[] = [
  {
    name: '경영진',
    employees: [
      {
        id: 'ceo001',
        name: '김대표',
        position: '대표이사',
        department: '경영진',
        status: 'online',
        email: 'ceo@company.com'
      },
      {
        id: 'cto001',
        name: '박CTO',
        position: 'CTO',
        department: '경영진',
        status: 'away',
        email: 'cto@company.com'
      }
    ]
  },
  {
    name: '개발팀',
    employees: [
      {
        id: 'dev001',
        name: '이팀장',
        position: '개발팀장',
        department: '개발팀',
        status: 'online',
        email: 'dev.lead@company.com'
      },
      {
        id: 'dev002',
        name: '김개발',
        position: '시니어 개발자',
        department: '개발팀',
        status: 'online',
        email: 'kim.dev@company.com'
      },
      {
        id: 'dev003',
        name: '최프론트',
        position: '프론트엔드 개발자',
        department: '개발팀',
        status: 'away',
        email: 'choi.front@company.com'
      },
      {
        id: 'dev004',
        name: '정백엔드',
        position: '백엔드 개발자',
        department: '개발팀',
        status: 'online',
        email: 'jung.back@company.com'
      }
    ]
  },
  {
    name: '디자인팀',
    employees: [
      {
        id: 'design001',
        name: '한디자인',
        position: '디자인팀장',
        department: '디자인팀',
        status: 'online',
        email: 'han.design@company.com'
      },
      {
        id: 'design002',
        name: '송UI',
        position: 'UI/UX 디자이너',
        department: '디자인팀',
        status: 'offline',
        email: 'song.ui@company.com'
      }
    ]
  },
  {
    name: '기획팀',
    employees: [
      {
        id: 'plan001',
        name: '조기획',
        position: '기획팀장',
        department: '기획팀',
        status: 'away',
        email: 'jo.plan@company.com'
      },
      {
        id: 'plan002',
        name: '윤PM',
        position: '프로덕트 매니저',
        department: '기획팀',
        status: 'online',
        email: 'yoon.pm@company.com'
      }
    ]
  },
  {
    name: '인사팀',
    employees: [
      {
        id: 'hr001',
        name: '강인사',
        position: '인사팀장',
        department: '인사팀',
        status: 'online',
        email: 'kang.hr@company.com'
      }
    ]
  }
];

const OrganizationChart: React.FC<OrganizationChartProps> = ({ onStartChat }) => {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['개발팀']));
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDepartment = (deptName: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptName)) {
      newExpanded.delete(deptName);
    } else {
      newExpanded.add(deptName);
    }
    setExpandedDepts(newExpanded);
  };

  const handleEmployeeDoubleClick = (employee: Employee) => {
    onStartChat(employee);
  };

  const filteredOrgData = mockOrgData.map(dept => ({
    ...dept,
    employees: dept.employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(dept => dept.employees.length > 0);

  return (
    <OrgContainer>
      <Header>
        <Title>조직도</Title>
        <SearchBox 
          placeholder="직원 검색" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>
      <OrgContent>
        {filteredOrgData.map(dept => (
          <Department key={dept.name}>
            <DepartmentHeader onClick={() => toggleDepartment(dept.name)}>
              <ExpandIcon expanded={expandedDepts.has(dept.name)}>▶</ExpandIcon>
              {dept.name} ({dept.employees.length})
            </DepartmentHeader>
            <EmployeeList expanded={expandedDepts.has(dept.name)}>
              {dept.employees.map(employee => (
                <EmployeeItem
                  key={employee.id}
                  onDoubleClick={() => handleEmployeeDoubleClick(employee)}
                  title="더블클릭하여 대화 시작"
                >
                  <StatusIndicator status={employee.status} />
                  <EmployeeInfo>
                    <EmployeeName>{employee.name}</EmployeeName>
                    <EmployeePosition>{employee.position}</EmployeePosition>
                  </EmployeeInfo>
                </EmployeeItem>
              ))}
            </EmployeeList>
          </Department>
        ))}
      </OrgContent>
    </OrgContainer>
  );
};

export default OrganizationChart;