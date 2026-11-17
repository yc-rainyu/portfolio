import { execSync } from 'node:child_process';

function git(args: string): string | undefined {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || undefined;
  } catch {
    return undefined;
  }
}

export const buildInfo = {
  branch: process.env.VERCEL_GIT_COMMIT_REF ?? git('rev-parse --abbrev-ref HEAD') ?? '',
  commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? git('rev-parse HEAD') ?? '').slice(0, 7),
  builtAt: new Date(),
};
