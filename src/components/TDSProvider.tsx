"use client";

import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
import { useEffect, useState } from 'react';

export function TDSProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 서버 사이드에서는 Provider 없이 렌더링
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <TDSMobileAITProvider>
      {children}
    </TDSMobileAITProvider>
  );
}

