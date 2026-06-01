/**
 * Enriches entries in parallel using multiple browser pages.
 */
async function enrichEntriesInParallel(context, entries, enrichFn, options = {}) {
  const concurrency = options.concurrency ?? 4;
  const logEvery = options.logEvery ?? 100;
  const boardLabel = options.boardLabel ?? "entries";
  let nextIndex = 0;
  let completed = 0;

  /**
   * Worker that processes entries until the queue is empty.
   */
  async function worker() {
    const page = await context.newPage();

    try {
      while (nextIndex < entries.length) {
        const index = nextIndex;
        nextIndex += 1;
        const entry = entries[index];

        try {
          await enrichFn(page, entry);
        } catch {
          // Keep index-card data when a detail page fails.
        }

        completed += 1;

        if (completed % logEvery === 0 || completed === entries.length) {
          console.log(`[${boardLabel}] enriched ${completed}/${entries.length}`);
        }
      }
    } finally {
      await page.close();
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, entries.length) }, worker),
  );
}

module.exports = { enrichEntriesInParallel };
