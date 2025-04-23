import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ブログ記事一覧',
  description: 'ブログです',
};

// dummy data
const articles = [
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' },
  { id: 3, title: 'Post 3' },
];

// 3秒後にデータを取得する
async function getArticles() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // throw new Error('データ取得に失敗しました');
  return articles;
}

export default async function BlogPage() {
  const articles = await getArticles();
  return (
    <div>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
}
