'use client';

export default function AuroraBackground() {
  if (process.env.NEXT_PUBLIC_LHCI === '1' || process.env.OFFLINE_BUILD === '1') {
    // Skip heavy animated background during CI/LHCI/offline builds to avoid paint cost
    return null
  }
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden mix-blend-multiply dark:mix-blend-screen"
    >
      {/* オレンジ／ゴールドのブロブ */}
      <span
        className="absolute -left-1/4 -top-1/4 h-[80vmax] w-[80vmax] rounded-full blur-3xl opacity-40 dark:opacity-45 mix-blend-multiply dark:mix-blend-screen will-change-transform animate-aurora-slow motion-reduce:animate-none"
        style={{ background: 'radial-gradient(circle at center, rgba(247,147,26,.55), transparent 60%)' }} // Orange
      />
      <span
        className="absolute -right-1/3 top-1/4 h-[70vmax] w-[70vmax] rounded-full blur-3xl opacity-35 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen will-change-transform animate-aurora-med motion-reduce:animate-none"
        style={{ background: 'radial-gradient(circle at center, rgba(255,193,7,.55), transparent 60%)' }}  // Gold/Yellow
      />
      <span
        className="absolute left-1/3 -bottom-[20%] h-[65vmax] w-[65vmax] rounded-full blur-3xl opacity-30 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen will-change-transform animate-aurora-fast motion-reduce:animate-none"
        style={{ background: 'radial-gradient(circle at center, rgba(255,159,67,.50), transparent 60%)' }} // Amber系
      />

      {/* シマー（斜めの光沢） */}
      <div
        className="absolute inset-0 opacity-15 dark:opacity-45 pointer-events-none animate-shimmer motion-reduce:animate-none"
        style={{
          backgroundImage:
            'linear-gradient(-75deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.08) 45%, rgba(255,255,255,0) 60%)',
          backgroundSize: '200% 100%',
        }}
      />

      {/* 粒子のきらめき */}
      <div
        className="absolute inset-0 opacity-15 dark:opacity-25 mix-blend-multiply dark:mix-blend-screen animate-twinkle motion-reduce:animate-none"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.35) 50%, transparent 60%),\
             radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,.25) 50%, transparent 60%),\
             radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,.2) 50%, transparent 60%)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
        }}
      />
    </div>
  );
}
