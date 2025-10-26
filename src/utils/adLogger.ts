// 광고 관련 로그를 localStorage에 저장하는 유틸리티

const LOG_KEY = 'ad_logs';
const MAX_LOGS = 200; // 최대 200개 로그 유지

export interface AdLogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  data?: unknown;
}

export const adLogger = {
  // 로그 추가
  log: (type: AdLogEntry['type'], message: string, data?: unknown) => {
    if (typeof window === 'undefined') return;

    try {
      const entry: AdLogEntry = {
        timestamp: new Date().toISOString(),
        type,
        message,
        data,
      };

      // 기존 로그 가져오기
      const existingLogs = adLogger.getLogs();
      
      // 새 로그 추가
      const newLogs = [entry, ...existingLogs].slice(0, MAX_LOGS);
      
      // localStorage에 저장
      localStorage.setItem(LOG_KEY, JSON.stringify(newLogs));
      
      // 콘솔에도 출력 (디버깅용)
      const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '📋';
      console.log(`${emoji} [AdLogger]`, message, data || '');
    } catch (error) {
      console.error('Failed to save log to localStorage:', error);
    }
  },

  // 로그 가져오기
  getLogs: (): AdLogEntry[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const logsJson = localStorage.getItem(LOG_KEY);
      if (!logsJson) return [];
      return JSON.parse(logsJson);
    } catch (error) {
      console.error('Failed to retrieve logs from localStorage:', error);
      return [];
    }
  },

  // 로그 초기화
  clearLogs: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOG_KEY);
    console.log('📋 [AdLogger] 로그 초기화 완료');
  },

  // 로그 조회 (디버깅용)
  printLogs: () => {
    const logs = adLogger.getLogs();
    console.log('📋 [AdLogger] 저장된 로그:', logs);
    return logs;
  },

  // 최근 N개 로그만 가져오기
  getRecentLogs: (count: number = 50): AdLogEntry[] => {
    return adLogger.getLogs().slice(0, count);
  },
};

