'use client';

import { FileText, Search, Zap } from 'lucide-react';

import ButtonGlowing from './ButtonGlowing';

const RINGS = [
  { width: 300, height: 300, opacity: 0.7 },
  { width: 500, height: 500, opacity: 0.5 },
  { width: 700, height: 700, opacity: 0.4 },
  { width: 900, height: 900, opacity: 0.3 },
  { width: 1200, height: 1200, opacity: 0.2 },
];

const ICONS = [
  {
    icon: FileText,
    desc: 'Analyze any PDF',
  },
  {
    icon: Search,
    desc: 'Extract Key Insights',
  },
  {
    icon: Zap,
    desc: 'Save Time',
  },
];

const Hero = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {RINGS.map((ring, index) => (
          <div
            key={index}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/20 shadow-[0_0_150px_inset] shadow-purple-200/10`}
            style={{
              width: ring.width,
              height: ring.height,
              opacity: ring.opacity,
            }}
          />
        ))}
      </div>
      <div className="z-10 px-4 text-center">
        <h1 className="mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
          PDF Analysis Tool
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-lg text-white/70 md:text-xl">
          Extract insights from your documents instantly with our AI-powered
          analysis tool
        </p>
        <ButtonGlowing text="Get Started" href="/pricing" />
      </div>
      {/* Feature icons */}
      <div className="z-10 mt-16 flex flex-wrap justify-center gap-8 px-4">
        {ICONS.map((icon, index) => (
          <div key={index} className="flex max-w-[150px] flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-400/10">
              <icon.icon className="h-6 w-6 text-purple-200" />
            </div>
            <p className="text-center text-sm text-white/80">{icon.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
