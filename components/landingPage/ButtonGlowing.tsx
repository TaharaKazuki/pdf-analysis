import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

type ButtonGlowingProps = {
  text: string;
  href?: string;
};

const ButtonGlowing = ({ text, href = '#' }: ButtonGlowingProps) => {
  return (
    <div className="flex items-center justify-center p-4">
      <Link
        href={href}
        className="group relative inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white transition-all hover:bg-white/5"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] opacity-70 blur-sm transition-all group-hover:opacity-100" />
        <span className="absolute inset-0.5 rounded-full bg-black/50" />
        <span className="relative flex items-center gap-2 p-2 text-center font-medium">
          {text}
          <ChevronRight className="size-6 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </div>
  );
};

export default ButtonGlowing;
