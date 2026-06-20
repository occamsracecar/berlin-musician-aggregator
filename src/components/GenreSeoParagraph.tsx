type GenreSeoParagraphProps = {
  heading: string;
  text: string;
};

/**
 * SEO text block shown below genre listing results.
 */
export function GenreSeoParagraph({ heading, text }: GenreSeoParagraphProps) {
  return (
    <section
      aria-labelledby="genre-seo-heading"
      className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 sm:p-8"
    >
      <h2
        id="genre-seo-heading"
        className="text-base font-semibold text-zinc-900"
      >
        {heading}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{text}</p>
    </section>
  );
}
