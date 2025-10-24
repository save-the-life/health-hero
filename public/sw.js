// 서비스 워커 - 캐싱을 통한 성능 최적화
const CACHE_NAME = 'health-hero-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/game',
  '/intro',
  '/sounds/button-click.mp3',
  '/sounds/quiz-right.mp3',
  '/sounds/quiz-wrong.mp3',
  '/sounds/stage-clear.mp3',
  '/sounds/stage-failed.mp3',
  '/images/backgrounds/background-quiz.png',
  '/images/backgrounds/background-answer.png',
  '/images/backgrounds/background-wrong.png',
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('캐시 설치 중...');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('캐시 설치 완료');
        return self.skipWaiting();
      })
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('서비스 워커 활성화');
      return self.clients.claim();
    })
  );
});

// 페치 이벤트 - 네트워크 우선, 캐시 폴백
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 유효한 응답인 경우 캐시에 저장
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 반환
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // 캐시에도 없으면 기본 페이지 반환
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});
