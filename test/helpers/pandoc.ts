import { spawnSync } from 'child_process';

/**
 * Whether a `pandoc` binary is available on the host running the tests.
 *
 * Tests that exercise the `markdownParser: 'pandoc'` code path spawn the real
 * `pandoc` executable. On machines without it installed (e.g. a typical
 * Windows dev box) those tests fail with `spawn pandoc ENOENT`, which is an
 * environment limitation, not a code defect. Guard such tests with
 * `itPandoc` / `describePandoc` so they run on CI (where pandoc is installed)
 * and are skipped elsewhere.
 */
let cached: boolean | null = null;
export function isPandocAvailable(): boolean {
  if (cached === null) {
    try {
      const result = spawnSync('pandoc', ['--version'], { stdio: 'ignore' });
      cached = !result.error && result.status === 0;
    } catch {
      cached = false;
    }
  }
  return cached;
}

/** `it`, but skipped when pandoc is not installed. */
export const itPandoc = isPandocAvailable() ? it : it.skip;

/** `describe`, but skipped when pandoc is not installed. */
export const describePandoc = isPandocAvailable() ? describe : describe.skip;
