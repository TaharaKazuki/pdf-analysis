'use client';

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';

import { PDF_PROCESSING } from './constant';

// クライアントサイドでのみworkerを設定
if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = PDF_PROCESSING.WORKER_SRC;
}

/**
 * PDFファイルからテキストを抽出する
 * @param file PDFファイル
 * @returns 抽出されたテキスト
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error('ファイルが提供されていません');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    // 各ページのテキスト抽出処理を並行して実行
    const pagePromises = Array.from(
      { length: numPages },
      async (_, pageIndex) => {
        const pageNum = pageIndex + 1;
        const page = await pdf.getPage(pageNum);
        const content = (await page.getTextContent()) as TextContent;

        // テキスト項目のみを抽出して結合
        return content.items
          .map((item) => ('str' in item ? (item as TextItem).str : ''))
          .join(' '); // 単語間にスペースを追加
      }
    );

    // すべてのページのテキストを取得して結合
    const pageTexts = await Promise.all(pagePromises);
    return pageTexts.join('\n\n'); // ページ間に空行を追加
  } catch (error) {
    console.error('PDF抽出エラー:', error);

    if (error instanceof Error) {
      throw new Error(`PDFからテキストの抽出に失敗しました: ${error.message}`);
    }

    throw new Error('PDFからテキストの抽出に失敗しました');
  }
};
