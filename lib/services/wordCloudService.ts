// 🏢 비즈니스 로직 레이어 - 워드클라우드 데이터 변환 서비스
// 관심사: 키워드 데이터 변환, 시각화 로직, 카테고리 필터링

import type { AnalysisResult, KeywordData } from '@/lib/textAnalysis';

/**
 * 워드클라우드 데이터 구조
 */
export interface WordCloudData {
  text: string;
  size: number;
  color: string;
  category: string;
  frequency: number;
  tfidf: number;
}

/**
 * 워드클라우드 변환 결과
 */
export interface WordCloudTransformResult {
  wordCloudData: WordCloudData[];
  maxFrequency: number;
  totalKeywords: number;
  tfidfRange: {
    min: number;
    max: number;
  };
}

/**
 * 워드클라우드 필터링 결과
 */
export interface FilteredWordCloudResult {
  wordCloudData: WordCloudData[];
  availableCategories: string[];
  filteredCount: number;
}

/**
 * 워드클라우드 도메인 서비스
 */
export class WordCloudService {
  /**
   * 폰트 크기 범위 설정
   */
  private static readonly FONT_SIZE = {
    MIN: 12,
    MAX: 48,
    RANGE: 36 // MAX - MIN
  };

  /**
   * 카테고리별 색상 매핑
   */
  private static readonly CATEGORY_COLORS: Record<string, string> = {
    'code-quality': '#45b7d1',
    'performance': '#ff6b6b',
    'bug-fix': '#ef4444',
    'architecture': '#4ecdc4',
    'testing': '#10b981',
    'documentation': '#6b7280',
    'security': '#8b5cf6',
    'ui-ux': '#f59e0b',
    'general': '#94a3b8',
  };

  /**
   * 분석 결과를 워드클라우드 데이터로 변환
   */
  static transformAnalysisToWordCloud(
    analysisResult: AnalysisResult | null
  ): WordCloudTransformResult {
    if (!analysisResult || !analysisResult.keywords.length) {
      return {
        wordCloudData: [],
        maxFrequency: 0,
        totalKeywords: 0,
        tfidfRange: { min: 0, max: 0 }
      };
    }

    const keywords = analysisResult.keywords;
    const maxFrequency = Math.max(...keywords.map(k => k.frequency));
    const tfidfRange = this.calculateTFIDFRange(keywords);

    const wordCloudData = keywords.map(keyword => 
      this.createWordCloudItem(keyword, tfidfRange)
    );

    return {
      wordCloudData,
      maxFrequency,
      totalKeywords: keywords.length,
      tfidfRange
    };
  }

  /**
   * TF-IDF 범위 계산
   */
  private static calculateTFIDFRange(keywords: KeywordData[]) {
    const tfidfValues = keywords.map(k => k.tfidf);
    return {
      min: Math.min(...tfidfValues),
      max: Math.max(...tfidfValues)
    };
  }

  /**
   * 개별 워드클라우드 아이템 생성
   */
  private static createWordCloudItem(
    keyword: KeywordData,
    tfidfRange: { min: number; max: number }
  ): WordCloudData {
    const normalizedTFIDF = this.normalizeTFIDF(
      keyword.tfidf,
      tfidfRange.max,
      tfidfRange.min
    );
    
    const fontSize = this.calculateFontSize(normalizedTFIDF);
    const color = this.getCategoryColor(keyword.category);

    return {
      text: keyword.keyword,
      size: Math.round(fontSize),
      color,
      category: keyword.category,
      frequency: keyword.frequency,
      tfidf: keyword.tfidf,
    };
  }

  /**
   * TF-IDF 값 정규화 (0~1 범위)
   */
  private static normalizeTFIDF(value: number, max: number, min: number): number {
    if (max <= min) return 0.5;
    return (value - min) / (max - min);
  }

  /**
   * 폰트 크기 계산
   */
  private static calculateFontSize(normalizedValue: number): number {
    const fontSize = this.FONT_SIZE.MIN + (normalizedValue * this.FONT_SIZE.RANGE);
    return Math.max(this.FONT_SIZE.MIN, Math.min(this.FONT_SIZE.MAX, fontSize));
  }

  /**
   * 카테고리별 색상 반환
   */
  private static getCategoryColor(category: string): string {
    return this.CATEGORY_COLORS[category] || this.CATEGORY_COLORS.general;
  }

  /**
   * 카테고리로 워드클라우드 필터링
   */
  static filterWordCloudByCategories(
    wordCloudData: WordCloudData[],
    selectedCategories: string[]
  ): FilteredWordCloudResult {
    // 사용 가능한 카테고리 목록 추출
    const availableCategories = Array.from(
      new Set(wordCloudData.map(item => item.category))
    ).sort();

    // 카테고리 필터링 (선택된 카테고리가 없으면 모두 표시)
    const filteredData = selectedCategories.length > 0
      ? wordCloudData.filter(item => selectedCategories.includes(item.category))
      : wordCloudData;

    return {
      wordCloudData: filteredData,
      availableCategories,
      filteredCount: filteredData.length
    };
  }

  /**
   * 빈도수 기준으로 상위 키워드 추출
   */
  static getTopWordsByFrequency(
    wordCloudData: WordCloudData[],
    limit: number = 10
  ): WordCloudData[] {
    return [...wordCloudData]
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  /**
   * TF-IDF 기준으로 상위 키워드 추출
   */
  static getTopWordsByTFIDF(
    wordCloudData: WordCloudData[],
    limit: number = 10
  ): WordCloudData[] {
    return [...wordCloudData]
      .sort((a, b) => b.tfidf - a.tfidf)
      .slice(0, limit);
  }

  /**
   * 카테고리별 키워드 그룹핑
   */
  static groupWordsByCategory(
    wordCloudData: WordCloudData[]
  ): Record<string, WordCloudData[]> {
    return wordCloudData.reduce((groups, word) => {
      const category = word.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(word);
      return groups;
    }, {} as Record<string, WordCloudData[]>);
  }

  /**
   * 워드클라우드 통계 계산
   */
  static calculateWordCloudStats(wordCloudData: WordCloudData[]) {
    if (wordCloudData.length === 0) {
      return {
        totalWords: 0,
        avgFrequency: 0,
        avgTFIDF: 0,
        categoryDistribution: {},
        frequencyDistribution: { high: 0, medium: 0, low: 0 }
      };
    }

    const totalFrequency = wordCloudData.reduce((sum, word) => sum + word.frequency, 0);
    const totalTFIDF = wordCloudData.reduce((sum, word) => sum + word.tfidf, 0);
    const avgFrequency = totalFrequency / wordCloudData.length;

    // 카테고리별 분포
    const categoryDistribution = wordCloudData.reduce((dist, word) => {
      dist[word.category] = (dist[word.category] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);

    // 빈도수별 분포 (high: 10+, medium: 3-9, low: 1-2)
    const frequencyDistribution = wordCloudData.reduce((dist, word) => {
      if (word.frequency >= 10) dist.high++;
      else if (word.frequency >= 3) dist.medium++;
      else dist.low++;
      return dist;
    }, { high: 0, medium: 0, low: 0 });

    return {
      totalWords: wordCloudData.length,
      avgFrequency: Math.round(avgFrequency * 10) / 10,
      avgTFIDF: Math.round((totalTFIDF / wordCloudData.length) * 1000) / 1000,
      categoryDistribution,
      frequencyDistribution
    };
  }

  /**
   * 키워드 검색
   */
  static searchKeywords(
    wordCloudData: WordCloudData[],
    searchTerm: string
  ): WordCloudData[] {
    const normalizedTerm = searchTerm.toLowerCase().trim();
    if (!normalizedTerm) return wordCloudData;

    return wordCloudData.filter(word =>
      word.text.toLowerCase().includes(normalizedTerm)
    );
  }

  /**
   * 카테고리 색상 매핑 반환
   */
  static getCategoryColors(): Record<string, string> {
    return { ...this.CATEGORY_COLORS };
  }
}