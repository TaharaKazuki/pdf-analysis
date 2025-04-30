type Props = {
  text: string;
};

const FormatSummaryContent = ({ text }: Props) => {
  const paragraphs = text.split('\n').filter((p) => p.trim() !== '');

  return paragraphs.map((paragraph, index) => {
    if (paragraph.startsWith('# ')) {
      return (
        <h2
          key={index}
          className="mt-6 mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-bold text-transparent"
        >
          {paragraph.replace(/^# /, '')}
        </h2>
      );
    }

    if (paragraph.startsWith('## ')) {
      return (
        <h3
          key={index}
          className="mt-6 mb-3 border-b border-purple-500/20 pb-2 text-xl font-semibold text-purple-300"
        >
          {paragraph.replace(/^## /, '')}
        </h3>
      );
    }

    return (
      <p
        key={index}
        className="mb-4 leading-relaxed text-gray-300 transition-colors first-letter:text-lg first-letter:font-medium hover:text-white"
      >
        {paragraph}
      </p>
    );
  });
};

export default FormatSummaryContent;
