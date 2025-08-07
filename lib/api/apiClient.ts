// 🌐 API 레이어 - 기본 HTTP 클라이언트 
// 관심사: HTTP 통신, 에러 처리, 응답 변환

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * 기본 API 클라이언트 설정
 */
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = '', defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  /**
   * GET 요청
   */
  async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, headers);
  }

  /**
   * POST 요청
   */
  async post<T>(
    endpoint: string, 
    body?: unknown, 
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, body, headers);
  }

  /**
   * PUT 요청
   */
  async put<T>(
    endpoint: string, 
    body?: unknown, 
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, body, headers);
  }

  /**
   * DELETE 요청
   */
  async delete<T>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, headers);
  }

  /**
   * 기본 HTTP 요청 메서드
   */
  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include', // 쿠키 포함
      });

      const data = await this.parseResponse<T>(response);

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * URL 생성
   */
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint; // 절대 URL인 경우
    }
    
    const cleanBase = this.baseURL.replace(/\/$/, '');
    const cleanEndpoint = endpoint.replace(/^\//, '');
    
    return cleanBase ? `${cleanBase}/${cleanEndpoint}` : `/${cleanEndpoint}`;
  }

  /**
   * 응답 파싱
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          errorMessage = await response.text() || errorMessage;
        }
      } catch {
        // 에러 파싱 실패 시 기본 메시지 사용
      }
      
      const apiError: ApiError = {
        message: errorMessage,
        status: response.status,
        code: response.status.toString(),
      };
      
      throw apiError;
    }

    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  /**
   * 에러 핸들링
   */
  private handleError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'message' in error) {
      return error as ApiError;
    }
    
    if (error instanceof TypeError) {
      return {
        message: '네트워크 연결 오류가 발생했습니다.',
        code: 'NETWORK_ERROR',
      };
    }
    
    return {
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * 기본 API 클라이언트 인스턴스
 */
export const apiClient = new ApiClient();

/**
 * 내부 API 엔드포인트용 클라이언트
 */
export const internalApiClient = new ApiClient('/api');