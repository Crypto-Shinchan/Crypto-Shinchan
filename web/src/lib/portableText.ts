import { PortableTextBlock } from '@portabletext/types';
import Slugger from 'github-slugger';

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export function extractHeadings(blocks: PortableTextBlock[]): Heading[] {
  if (!blocks) {
    return [];
  }

  const slugger = new Slugger();

  return blocks
    .filter(block => block._type === 'block' && block.style && /^h[1-6]$/.test(block.style))
    .map(block => {
      const text = block.children
        .map(child => (child._type === 'span' ? child.text : ''))
        .join('');
      const level = Number(block.style!.replace('h', ''));
      
      slugger.reset();
      const id = slugger.slug(text);

      return { level, text, id };
    });
}
