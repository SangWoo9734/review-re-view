/**
 * 기술 스택별 공식 브랜드 색상 매핑
 * 주요 기술의 공식 로고/브랜드 가이드라인에서 추출한 색상들
 */

export interface TechStackInfo {
  name: string;
  color: string;
  backgroundColor?: string; // 옅은 배경색
  icon?: string; // 이모지 아이콘
}

/**
 * 기술 스택별 공식 색상 매핑
 * 색상은 각 기술의 공식 브랜드 가이드라인에서 추출
 */
export const TECH_STACK_COLORS: Record<string, TechStackInfo> = {
  // Frontend Frameworks & Libraries
  'JavaScript': {
    name: 'JavaScript',
    color: '#F7DF1E',
    backgroundColor: '#FFF9C4',
    icon: '🟨'
  },
  'TypeScript': {
    name: 'TypeScript', 
    color: '#3178C6',
    backgroundColor: '#E0F2FE',
    icon: '🔷'
  },
  'React': {
    name: 'React',
    color: '#61DAFB',
    backgroundColor: '#E0F8FF',
    icon: '⚛️'
  },
  'Vue': {
    name: 'Vue.js',
    color: '#4FC08D',
    backgroundColor: '#ECFDF5',
    icon: '💚'
  },
  'Angular': {
    name: 'Angular',
    color: '#DD0031',
    backgroundColor: '#FEE2E2',
    icon: '🅰️'
  },
  'Svelte': {
    name: 'Svelte',
    color: '#FF3E00',
    backgroundColor: '#FEF2F2',
    icon: '🧡'
  },
  'Next.js': {
    name: 'Next.js',
    color: '#000000',
    backgroundColor: '#F3F4F6',
    icon: '▲'
  },
  'Nuxt.js': {
    name: 'Nuxt.js',
    color: '#00DC82',
    backgroundColor: '#ECFDF5',
    icon: '💚'
  },

  // Backend & Runtime
  'Node.js': {
    name: 'Node.js',
    color: '#339933',
    backgroundColor: '#F0FDF4',
    icon: '🟢'
  },
  'Python': {
    name: 'Python',
    color: '#3776AB',
    backgroundColor: '#DBEAFE',
    icon: '🐍'
  },
  'Java': {
    name: 'Java',
    color: '#ED8B00',
    backgroundColor: '#FEF3C7',
    icon: '☕'
  },
  'Go': {
    name: 'Go',
    color: '#00ADD8',
    backgroundColor: '#E0F8FF',
    icon: '🔵'
  },
  'Rust': {
    name: 'Rust',
    color: '#000000',
    backgroundColor: '#F3F4F6',
    icon: '🦀'
  },
  'PHP': {
    name: 'PHP',
    color: '#777BB4',
    backgroundColor: '#F3F4F6',
    icon: '🐘'
  },
  'C#': {
    name: 'C#',
    color: '#239120',
    backgroundColor: '#F0FDF4',
    icon: '🟢'
  },
  'Ruby': {
    name: 'Ruby',
    color: '#CC342D',
    backgroundColor: '#FEE2E2',
    icon: '💎'
  },

  // Databases
  'MySQL': {
    name: 'MySQL',
    color: '#4479A1',
    backgroundColor: '#DBEAFE',
    icon: '🐬'
  },
  'PostgreSQL': {
    name: 'PostgreSQL',
    color: '#336791',
    backgroundColor: '#DBEAFE',
    icon: '🐘'
  },
  'MongoDB': {
    name: 'MongoDB',
    color: '#47A248',
    backgroundColor: '#F0FDF4',
    icon: '🍃'
  },
  'Redis': {
    name: 'Redis',
    color: '#DC382D',
    backgroundColor: '#FEE2E2',
    icon: '🔴'
  },
  'SQLite': {
    name: 'SQLite',
    color: '#003B57',
    backgroundColor: '#F1F5F9',
    icon: '📦'
  },

  // CSS & Styling
  'CSS': {
    name: 'CSS',
    color: '#1572B6',
    backgroundColor: '#DBEAFE',
    icon: '🎨'
  },
  'Sass': {
    name: 'Sass',
    color: '#CF649A',
    backgroundColor: '#FCE7F3',
    icon: '🎀'
  },
  'Tailwind CSS': {
    name: 'Tailwind CSS',
    color: '#06B6D4',
    backgroundColor: '#E0F8FF',
    icon: '🌊'
  },
  'styled-components': {
    name: 'styled-components',
    color: '#DB7093',
    backgroundColor: '#FCE7F3',
    icon: '💅'
  },

  // Build Tools & Package Managers
  'Webpack': {
    name: 'Webpack',
    color: '#8DD6F9',
    backgroundColor: '#E0F8FF',
    icon: '📦'
  },
  'Vite': {
    name: 'Vite',
    color: '#646CFF',
    backgroundColor: '#E5E7EB',
    icon: '⚡'
  },
  'npm': {
    name: 'npm',
    color: '#CB3837',
    backgroundColor: '#FEE2E2',
    icon: '📦'
  },
  'Yarn': {
    name: 'Yarn',
    color: '#2C8EBB',
    backgroundColor: '#E0F2FE',
    icon: '🧶'
  },
  'pnpm': {
    name: 'pnpm',
    color: '#F69220',
    backgroundColor: '#FEF3C7',
    icon: '📦'
  },

  // Cloud & DevOps
  'Docker': {
    name: 'Docker',
    color: '#2496ED',
    backgroundColor: '#DBEAFE',
    icon: '🐳'
  },
  'Kubernetes': {
    name: 'Kubernetes',
    color: '#326CE5',
    backgroundColor: '#DBEAFE',
    icon: '☸️'
  },
  'AWS': {
    name: 'AWS',
    color: '#FF9900',
    backgroundColor: '#FEF3C7',
    icon: '☁️'
  },
  'GCP': {
    name: 'Google Cloud',
    color: '#4285F4',
    backgroundColor: '#DBEAFE',
    icon: '☁️'
  },
  'Azure': {
    name: 'Microsoft Azure',
    color: '#0078D4',
    backgroundColor: '#DBEAFE',
    icon: '☁️'
  },

  // Testing
  'Jest': {
    name: 'Jest',
    color: '#C21325',
    backgroundColor: '#FEE2E2',
    icon: '🃏'
  },
  'Cypress': {
    name: 'Cypress',
    color: '#17202C',
    backgroundColor: '#F3F4F6',
    icon: '🌲'
  },
  'Playwright': {
    name: 'Playwright',
    color: '#2EAD33',
    backgroundColor: '#F0FDF4',
    icon: '🎭'
  },

  // Mobile
  'React Native': {
    name: 'React Native',
    color: '#61DAFB',
    backgroundColor: '#E0F8FF',
    icon: '📱'
  },
  'Flutter': {
    name: 'Flutter',
    color: '#02569B',
    backgroundColor: '#DBEAFE',
    icon: '🦋'
  },
  'Swift': {
    name: 'Swift',
    color: '#FA7343',
    backgroundColor: '#FED7AA',
    icon: '🍎'
  },
  'Kotlin': {
    name: 'Kotlin',
    color: '#7F52FF',
    backgroundColor: '#E5E7EB',
    icon: '🟣'
  },

  // 기본값 (인식되지 않는 기술)
  'Unknown': {
    name: 'Unknown',
    color: '#6B7280',
    backgroundColor: '#F9FAFB',
    icon: '❓'
  }
};

/**
 * 기술 스택 색상 관리 서비스
 */
export class TechStackColorService {
  /**
   * 기술 이름으로 색상 정보 가져오기
   * 대소문자 구분 없이, 여러 형태의 이름 지원
   */
  static getTechInfo(techName: string): TechStackInfo {
    if (!techName) {
      return TECH_STACK_COLORS.Unknown;
    }

    // 정규화: 소문자로 변환하고 공백/특수문자 제거
    const normalized = techName.toLowerCase().replace(/[.\-_\s]/g, '');
    
    // 직접 매칭 시도
    const directMatch = Object.entries(TECH_STACK_COLORS).find(([key, _]) => 
      key.toLowerCase().replace(/[.\-_\s]/g, '') === normalized
    );
    
    if (directMatch) {
      return directMatch[1];
    }

    // 부분 매칭 시도 (예: "reactjs" -> "react")
    const partialMatch = Object.entries(TECH_STACK_COLORS).find(([key, _]) => {
      const keyNormalized = key.toLowerCase().replace(/[.\-_\s]/g, '');
      return normalized.includes(keyNormalized) || keyNormalized.includes(normalized);
    });

    if (partialMatch) {
      return partialMatch[1];
    }

    // 특별한 경우들 처리
    const specialCases: Record<string, string> = {
      'js': 'JavaScript',
      'ts': 'TypeScript',
      'reactjs': 'React',
      'vuejs': 'Vue',
      'nodejs': 'Node.js',
      'nextjs': 'Next.js',
      'nuxtjs': 'Nuxt.js',
      'styledcomponents': 'styled-components',
      'tailwindcss': 'Tailwind CSS',
      'postgresql': 'PostgreSQL',
      'mysql': 'MySQL',
      'mongodb': 'MongoDB',
      'reactnative': 'React Native'
    };

    const specialCase = specialCases[normalized];
    if (specialCase && TECH_STACK_COLORS[specialCase]) {
      return TECH_STACK_COLORS[specialCase];
    }

    return TECH_STACK_COLORS.Unknown;
  }

  /**
   * 기술 스택 색상만 가져오기
   */
  static getTechColor(techName: string): string {
    return this.getTechInfo(techName).color;
  }

  /**
   * 기술 스택 배경색만 가져오기
   */
  static getTechBackgroundColor(techName: string): string {
    const info = this.getTechInfo(techName);
    return info.backgroundColor || info.color + '20'; // 20% 투명도
  }

  /**
   * 기술 스택 아이콘만 가져오기
   */
  static getTechIcon(techName: string): string {
    return this.getTechInfo(techName).icon || '💻';
  }

  /**
   * 인기 기술 스택 목록 가져오기 (자주 사용되는 것들)
   */
  static getPopularTechStacks(): string[] {
    return [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Next.js',
      'Node.js', 'Python', 'Java', 'Go', 'Rust',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
      'Tailwind CSS', 'Docker', 'AWS', 'Jest'
    ];
  }

  /**
   * 모든 기술 스택 목록 가져오기 (Unknown 제외)
   */
  static getAllTechStacks(): string[] {
    return Object.keys(TECH_STACK_COLORS).filter(key => key !== 'Unknown');
  }

  /**
   * 색상이 어두운지 판단 (텍스트 색상 결정용)
   */
  static isDarkColor(color: string): boolean {
    // hex 색상을 RGB로 변환
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // 밝기 계산 (가중평균)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }

  /**
   * 기술 스택에 적절한 텍스트 색상 가져오기
   */
  static getTextColor(techName: string): string {
    const color = this.getTechColor(techName);
    return this.isDarkColor(color) ? '#FFFFFF' : '#000000';
  }
}