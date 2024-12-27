'use client'

import { NoSSRWrapper } from '@/components';
import Home from './Home';

export default function Page() {
  return (
    <NoSSRWrapper>
      <Home />
    </NoSSRWrapper>
  );
}
