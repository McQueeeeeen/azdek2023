'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import ApiHealthIndicator from '@/components/admin/api-health-indicator';

export default function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {children}
      {mounted && <Toaster richColors position="bottom-right" style={{ zIndex: 9999 }} />}
      {mounted && process.env.NODE_ENV !== 'production' && (
        <div className="fixed bottom-4 left-4 z-[9999] bg-white rounded-full px-3 py-1.5 shadow-md border border-line">
          <ApiHealthIndicator />
        </div>
      )}
    </>
  );
}
