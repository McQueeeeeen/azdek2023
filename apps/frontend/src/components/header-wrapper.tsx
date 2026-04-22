'use client';

import { usePathname } from 'next/navigation';
import AdzekHeader from './adzek-header';

// Pages that have their own built-in header (homepage)
const PAGES_WITH_OWN_HEADER = ['/'];

export default function HeaderWrapper() {
  const pathname = usePathname();
  if (PAGES_WITH_OWN_HEADER.includes(pathname)) return null;
  return <AdzekHeader />;
}
