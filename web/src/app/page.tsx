// web/app/page.tsx
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/blog'); // ルートを /blog に寄せる（任意で /home でもOK）
}