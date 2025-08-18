interface Heading {
  level: number;
  text: string;
  slug: string;
}

interface Props {
  headings: Heading[];
}

const Toc = ({ headings }: Props) => {
  if (!headings || headings.length === 0) {
    return null;
  }

  return (
    <nav className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Table of Contents</h2>
      <ul>
        {headings.map((heading) => (
          <li key={heading.slug} style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}>
            <a href={`#${heading.slug}`} className="hover:underline">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Toc;
