#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const REPO = "Malnati/xadrez";
const UNSET = [
  "GH_TOKEN",
  "GITHUB_TOKEN",
  "GITHUB_PAT",
  "GH_ENTERPRISE_TOKEN",
  "GITHUB_ENTERPRISE_TOKEN",
  "ANEETY_FULL_PERMISSIONS",
  "GH_PAT_PROJECTS",
  "MBRA_FULL",
];
const VALIDATION = [
  "node scripts/codex/validate-plan-links.mjs",
  "pnpm test",
  "pnpm typecheck",
  "pnpm build",
];

function sanitizedEnv() {
  const env = { ...process.env };
  if (process.env.GITHUB_ACTIONS === "true") return env;
  for (const key of UNSET) delete env[key];
  return env;
}

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    shell: options.shell ?? false,
    env: options.sanitized ? sanitizedEnv() : process.env,
  });
  if (result.status !== 0)
    throw new Error(
      `${cmd} ${Array.isArray(args) ? args.join(" ") : args} failed: ${result.stderr || result.stdout}`.trim(),
    );
  return result.stdout.trim();
}

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const confirm = process.argv.includes("--confirm");
  const pr = argValue("--pr", null);
  if (!pr) {
    console.error(
      "usage: auto-merge-pr.mjs --dry-run --pr <number> OR --confirm --pr <number>",
    );
    process.exit(64);
  }
  const details = JSON.parse(
    run(
      "gh",
      [
        "pr",
        "view",
        pr,
        "--repo",
        REPO,
        "--json",
        "number,url,mergeable,mergeStateStatus,isDraft,state,statusCheckRollup",
      ],
      { sanitized: true },
    ),
  );
  const summary = {
    pr: details.url,
    state: details.state,
    isDraft: details.isDraft,
    mergeable: details.mergeable,
    mergeStateStatus: details.mergeStateStatus,
    validation: VALIDATION,
  };
  if (dryRun) {
    console.log(
      JSON.stringify(
        { action: "dry-run-auto-merge-check", ...summary },
        null,
        2,
      ),
    );
    return;
  }
  if (!confirm) throw new Error("refusing merge without --confirm");
  if (details.isDraft) throw new Error("refusing merge: PR is draft");
  if (details.state !== "OPEN")
    throw new Error(`refusing merge: PR state is ${details.state}`);
  if (details.mergeable === "CONFLICTING")
    throw new Error("refusing merge: GitHub reports conflicts");
  for (const command of VALIDATION) run(command, [], { shell: true });
  run(
    "gh",
    ["pr", "merge", pr, "--repo", REPO, "--squash", "--delete-branch"],
    { sanitized: true },
  );
  console.log(JSON.stringify({ merged: details.url }, null, 2));
}

main();
