import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.includes('.')) {
    console.log('ミドルウェアのテスト');
  }
  return NextResponse.next(); // リクエストを次の処理へ進める
}

// ミドルウェアが適用されるパスを指定
export const config = {
  matcher: [
    /*
     * 除外するパス:
     * - 静的ファイル (/_next/, /images/ など)
     * - api routes (/api/)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
