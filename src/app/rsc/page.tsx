import Link from 'next/link';

import ClientComponent from '@/components/ClientComponent';

export default function ServerComponent() {
  console.info('server');
  return (
    <div>
      サーバー
      <ClientComponent />
      <Link href="/about">about</Link>
    </div>
  );
}
