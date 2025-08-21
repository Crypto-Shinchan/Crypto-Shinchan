'use client';

export default function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0b0b10]"
    >
      {/* オーロラのぼかしブロブ（3枚） */}
      <span className="absolute -left-1/4 -top-1/4 h-[80vmax] w-[80vmax] rounded-full
                       bg-[radial-gradient(circle_at_center,rgba(247,147,26,.55),transparent_60%)]
                       blur-3xl opacity-40 mix-blend-screen
                       will-change-transform animate-[aurora_36s_linear_infinite]
                       motion-reduce:animate-none" />
      <span className="absolute -right-1/3 top-1/4 h-[70vmax] w-[70vmax] rounded-full
                       bg-[radial-gradient(circle_at_center,rgba(255,193,7,.55),transparent_60%)]
                       blur-3xl opacity-35 mix-blend-screen
                       will-change-transform animate-[aurora_28s_linear_infinite]
                       motion-reduce:animate-none" />
      <span className="absolute left-1/3 bottom-[-20%] h-[65vmax] w-[65vmax] rounded-full
                       bg-[radial-gradient(circle_at_center,rgba(255,255,255,.2),transparent_60%)]
                       blur-3xl opacity-30 mix-blend-screen
                       will-change-transform animate-[aurora_32s_linear_infinite]
                       motion-reduce:animate-none" />

      {/* シマー（斜めに走る光） */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none
                   animate-[shimmer_7s_linear_infinite] motion-reduce:animate-none"
        style={{
          backgroundImage:
            'linear-gradient(-75deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.06) 45%, rgba(255,255,255,0) 60%)',
          backgroundSize: '200% 100%',
        }}
      />

      {/* かすかな粒子（チラつき） */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-screen
                   animate-[twinkle_4s_ease-in-out_infinite] motion-reduce:animate-none"
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
