'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { WordCloudData } from '@/hooks/useWordCloud';

interface WordCloudProps {
  data: WordCloudData[];
  width?: number;
  height?: number;
  onWordClick?: (word: WordCloudData) => void;
  className?: string;
}

interface CloudWord extends WordCloudData {
  x?: number;
  y?: number;
  rotate?: number;
}

export function WordCloud({ 
  data, 
  width = 800, 
  height = 400, 
  onWordClick,
  className = ''
}: WordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<CloudWord[]>([]);

  useEffect(() => {
    if (!data.length) return;

    setIsLoading(true);

    // 워드클라우드 레이아웃 생성
    const layout = cloud<CloudWord>()
      .size([width, height])
      .words(data.map(d => ({ ...d })))
      .padding(5)
      .rotate(() => (Math.random() - 0.5) * 60) // -30도 ~ +30도 랜덤 회전
      .font('Inter, system-ui, sans-serif')
      .fontSize(d => d.size)
      .spiral('archimedean')
      .on('end', (words: CloudWord[]) => {
        setWords(words);
        setIsLoading(false);
      });

    layout.start();

    // 컴포넌트 언마운트시 정리
    return () => {
      layout.stop();
    };
  }, [data, width, height]);

  useEffect(() => {
    if (!svgRef.current || !words.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // 기존 요소 제거

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // 단어들 렌더링
    const textElements = g
      .selectAll<SVGTextElement, CloudWord>('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-family', 'Inter, system-ui, sans-serif')
      .style('font-weight', '600')
      .style('font-size', d => `${d.size}px`)
      .style('fill', d => d.color)
      .style('cursor', onWordClick ? 'pointer' : 'default')
      .style('user-select', 'none')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .text(d => d.text)
      .style('opacity', 0);

    // 클릭 이벤트 및 호버 효과 (transition 전에 추가)
    if (onWordClick) {
      textElements
        .on('click', function(_: unknown, d: CloudWord) {
          onWordClick(d);
        })
        .on('mouseenter', function(this: SVGTextElement) {
          d3.select(this)
            .style('opacity', 0.7)
            .style('font-weight', '700');
        })
        .on('mouseleave', function(this: SVGTextElement) {
          d3.select(this)
            .style('opacity', 1)
            .style('font-weight', '600');
        });
    }

    // 툴팁을 위한 title 추가
    textElements.append('title')
      .text(d => `${d.text}\n빈도: ${d.frequency}회\nTF-IDF: ${d.tfidf.toFixed(3)}\n카테고리: ${getCategoryLabel(d.category)}`);

    // 애니메이션 (이벤트 핸들러 추가 후)
    textElements
      .transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .style('opacity', 1);

  }, [words, width, height, onWordClick]);

  // 카테고리 레이블 변환
  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      'code-quality': '코드품질',
      'performance': '성능',
      'bug-fix': '버그수정',
      'architecture': '아키텍처',
      'testing': '테스트',
      'documentation': '문서화',
      'security': '보안',
      'ui-ux': 'UI/UX',
      'general': '일반',
    };
    return labels[category] || category;
  };

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-h3 text-gray-900 mb-2">
            키워드가 없습니다
          </h3>
          <p className="text-gray-600">
            분석할 수 있는 키워드가 발견되지 않았습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-white/80 z-10"
          style={{ width, height }}
        >
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">워드클라우드 생성 중...</p>
          </div>
        </div>
      )}
      
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border rounded-lg"
        style={{ background: '#fafafa' }}
      />
      
      {/* 범례 */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {Object.entries({
          'code-quality': '🧹 코드품질',
          'performance': '⚡ 성능', 
          'bug-fix': '🐛 버그수정',
          'architecture': '🏗️ 아키텍처',
          'testing': '🧪 테스트',
          'documentation': '📚 문서화',
          'security': '🔒 보안',
          'ui-ux': '🎨 UI/UX',
          'general': '📝 일반',
        }).map(([category, label]) => {
          const hasWords = data.some(word => word.category === category);
          if (!hasWords) return null;
          
          return (
            <div key={category} className="flex items-center gap-1 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: data.find(w => w.category === category)?.color }}
              />
              <span className="text-gray-700">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}