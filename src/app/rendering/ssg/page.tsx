import Image from 'next/image';

export default async function SSGPage() {
  const res = await fetch('https://dog.ceo/api/breeds/image/random');

  const resJson = await res.json();
  const image = resJson.message;

  const timestamp = new Date().toISOString();

  return (
    <div>
      SSG ビルド時の固定:{timestamp}
      <Image src={image} alt="dog" width={300} height={300} />
    </div>
  );
}
