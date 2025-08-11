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
    
    // 데이터를 크기순으로 정렬하고 위치 계산
    const sortedData = [...data]
      .sort((a, b) => b.size - a.size)
      .map((d, index) => ({
        ...d,
        x: 0, // 초기값, 나중에 계산
        y: 0,
        rotate: 0 // 각도 제거
      }));
    
    setWords(sortedData);
    setIsLoading(false);
  }, [data, width, height]);

  useEffect(() => {
    if (!svgRef.current || !words.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // 기존 요소 제거

    // 태그 스타일로 레이아웃 계산
    let currentX = 20;
    let currentY = 40;
    let maxHeight = 0;
    
    const tagElements = svg
      .selectAll<SVGGElement, CloudWord>('g.tag-group')
      .data(words)
      .enter()
      .append('g')
      .attr('class', 'tag-group')
      .style('cursor', onWordClick ? 'pointer' : 'default')
      .style('opacity', 0);

    tagElements.each(function(d, i) {
      const group = d3.select(this);
      
      // 태그 크기 계산 (텍스트 크기 기반)
      const fontSize = Math.max(14, Math.min(32, d.size * 0.8));
      const padding = fontSize * 0.6;
      const tagWidth = d.text.length * fontSize * 0.6 + padding * 2;
      const tagHeight = fontSize + padding;
      
      // 다음 줄로 넘어갈지 확인
      if (currentX + tagWidth > width - 20) {
        currentX = 20;
        currentY += maxHeight + 15;
        maxHeight = 0;
      }
      
      maxHeight = Math.max(maxHeight, tagHeight);
      
      // 둥근 사각형 배경
      group
        .append('rect')
        .attr('x', currentX)
        .attr('y', currentY)
        .attr('width', tagWidth)
        .attr('height', tagHeight)
        .attr('rx', tagHeight / 2) // 완전히 둥근 형태
        .style('fill', d => {
          const color = d3.color(d.color);
          if (color) {
            color.opacity = 0.15;
            return color.toString();
          }
          return d.color;
        })
        .style('stroke', d => d.color)
        .style('stroke-width', '2')
        .style('stroke-opacity', 0.4)
        .style('filter', 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))');
      
      // 텍스트
      group
        .append('text')
        .attr('x', currentX + tagWidth / 2)
        .attr('y', currentY + tagHeight / 2)
        .style('font-family', 'Inter, system-ui, sans-serif')
        .style('font-weight', '600')
        .style('font-size', `${fontSize}px`)
        .style('fill', d => d.color)
        .style('user-select', 'none')
        .style('text-shadow', '0 1px 2px rgba(0,0,0,0.1)')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(d => d.text);
      
      currentX += tagWidth + 10;
    });

    // 클릭 이벤트 및 호버 효과
    if (onWordClick) {
      tagElements
        .on('click', function(_: unknown, d: CloudWord) {
          onWordClick(d);
        })
        .on('mouseenter', function(this: SVGGElement) {
          const group = d3.select(this);
          group.select('rect')
            .transition()
            .duration(200)
            .style('fill-opacity', 0.25)
            .style('stroke-opacity', 0.8)
            .style('filter', 'drop-shadow(0 5px 10px rgba(0,0,0,0.15))')
            .style('transform', 'translateY(-2px)');
          
          group.select('text')
            .transition()
            .duration(200)
            .style('font-weight', '700');
        })
        .on('mouseleave', function(this: SVGGElement) {
          const group = d3.select(this);
          group.select('rect')
            .transition()
            .duration(200)
            .style('fill-opacity', 0.15)
            .style('stroke-opacity', 0.4)
            .style('filter', 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))')
            .style('transform', 'translateY(0px)');
          
          group.select('text')
            .transition()
            .duration(200)
            .style('font-weight', '600');
        });
    }

    // 툴팁을 위한 title 추가
    tagElements.append('title')
      .text(d => `${d.text}\n빈도: ${d.frequency}회\n중요도: ${d.tfidf.toFixed(2)}\n카테고리: ${getCategoryLabel(d.category)}`);

    // 애니메이션
    tagElements
      .transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .style('opacity', 1);

  }, [words, width, height, onWordClick]);

  // 카테고리 레이블 변환 (코드 리뷰 특화)
  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      'critical': '심각한 이슈',
      'security': '보안',
      'quality': '코드 품질', 
      'performance': '성능',
      'architecture': '아키텍처',
      'testing': '테스트',
      'improvement': '개선사항',
      'positive': '긍정적',
      'tech': '기술스택',
      'general': '일반',
    };
    return labels[category] || category;
  };

  if (!data.length) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            ☁️ 키워드 클라우드
          </h3>
        </div>
        
        <div className="flex items-center justify-center p-12" style={{ minHeight: height }}>
          <div className="text-center">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              아직 키워드가 없어요
            </h3>
            <p className="text-gray-600 mb-4 max-w-sm">
              분석할 수 있는 키워드가 발견되지 않았습니다.<br/>
              PR을 선택하고 분석을 실행해보세요!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
              💡 더 많은 PR을 분석하면 키워드가 나타날 거예요
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-primary-100">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          ☁️ 키워드 클라우드
          <span className="text-sm font-normal text-gray-600">({data.length}개 키워드)</span>
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          리뷰에서 자주 언급된 키워드들을 시각화했어요
        </p>
      </div>

      <div className="relative">
        {isLoading && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-10"
            style={{ width, height: height + 40 }}
          >
            <div className="text-center">
              <div className="animate-spin w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">워드클라우드 생성 중...</p>
              <p className="text-sm text-gray-500 mt-1">잠시만 기다려주세요 ✨</p>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="w-full rounded-xl"
            style={{ 
              background: `
                radial-gradient(circle at 30% 20%, rgba(93, 95, 239, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                linear-gradient(135deg, #fafbff 0%, #f0f4ff 50%, #e0e7ff 100%)
              `,
              filter: 'drop-shadow(0 8px 32px rgba(93, 95, 239, 0.12))',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)'
            }}
          />
        </div>
        
        {/* 범례 */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
              🏷️ 카테고리별 키워드
            </h4>
            <div className="flex flex-wrap gap-2">
        {Object.entries({
          'critical': '🚨 심각한 이슈',
          'security': '🔒 보안',
          'quality': '🧹 코드 품질', 
          'performance': '⚡ 성능',
          'architecture': '🏗️ 아키텍처',
          'testing': '🧪 테스트',
          'improvement': '🔧 개선사항',
          'positive': '✅ 긍정적',
          'tech': '💻 기술스택',
          'general': '📝 일반',
        }).map(([category, label]) => {
          const hasWords = data.some(word => word.category === category);
          if (!hasWords) return null;
          
          return (
            <div key={category} className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-100 text-sm hover:shadow-md transition-shadow">
              <div 
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: data.find(w => w.category === category)?.color }}
              />
              <span className="text-gray-700 font-medium">{label}</span>
            </div>
          );
            })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}