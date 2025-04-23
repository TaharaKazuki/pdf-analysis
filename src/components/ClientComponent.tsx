'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  console.info('client component');

  return <div onClick={() => setCount(count + 1)}>Count:{count}</div>;
}
