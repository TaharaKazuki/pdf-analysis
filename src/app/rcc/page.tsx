'use client';
import { useRouter } from 'next/navigation';

export default function ClientComponent() {
  const router = useRouter();

  console.info('client');
  return (
    <div>
      クライアント
      <button onClick={() => router.push('/about')}>About</button>
    </div>
  );
}
