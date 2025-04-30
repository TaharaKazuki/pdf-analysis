import { NextRequest, NextResponse } from 'next/server';

import { API, PDF_PROCESSING } from '@/lib/constant';
import { ApiError, handleApiError } from '@/lib/error';
import { rateLimiter } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    await rateLimiter(request);

    const body = await request.json().catch(() => {});
    const { text } = body;

    if (!text || typeof text !== 'string') {
      throw new ApiError(
        400,
        'Invalid input: text is required and must be a string'
      );
    }

    if (text.length === 0) {
      throw new ApiError(400, 'Invalid input: text cannot be empty');
    }
    const processedText = text.substring(0, PDF_PROCESSING.MAX_TEXT_LENGTH);

    const response = await fetch(
      `${API.GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
                    以下のドキュメントを分析し、次のフォーマットでエレガントなナラティブ要約を作成してください。

                    # ドキュメント概要
                    ドキュメントの本質を捉えた、簡潔な2文の概要を書いてください。  
                    主題、目的、範囲に焦点を当ててください。

                    ## 内容要約
                    ドキュメントの主要な議論や発見を説明する、最大3文の流れるような1段落を書いてください。  
                    箇条書きは避け、明瞭かつ魅力的な言葉で最も重要な情報に絞ってください。

                    ## 分析
                    1段落、最大3文で、ドキュメントの方法論、アプローチ、視点を分析してください。
                    顕著な強み、制限、独自の視点について論じ、理解を深めるためのデータや引用があれば含めてください。

                    ## 結論
                    ドキュメントの意義と主な要点を要約する思慮深い結びの段落を、最大2文で書いてください。
                    読者がこのドキュメントから何を記憶すべきかを示してください。

                    全体を通して、見出しを明確にし、段落構成を整え、プロフェッショナルかつ簡潔な言葉遣いでお願いします。

                    ドキュメント内容：
                    ${processedText}
                  `,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => {});

      throw new ApiError(
        response.status,
        errorData.error?.message ||
          `Failed to analyze document: ${response.statusText}`,
        errorData
      );
    }

    const data = await response.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new ApiError(500, 'Invalid response from AI service');
    }

    return NextResponse.json({
      summary: data.candidates[0].content.parts[0].text,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
