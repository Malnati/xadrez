#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const REPO = "Malnati/xadrez";
const PROJECT_OWNER = "Malnati";
const PROJECT_NUMBER = "14";
const PROJECT_WRAPPER = "/Users/mal/.codex/bin/mbra-projects-gh";
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

function sanitizedEnv() {
  const env = { ...process.env };
  if (process.env.GITHUB_ACTIONS === "true") return env;
  for (const key of UNSET) delete env[key];
  return env;
}

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    env: options.sanitized ? sanitizedEnv() : process.env,
  });
  if (result.status !== 0)
    throw new Error(
      `${cmd} ${args.join(" ")} failed: ${result.stderr || result.stdout}`.trim(),
    );
  return result.stdout.trim();
}

function currentBranch() {
  return run("git", ["branch", "--show-current"]);
}

function existingPr() {
  const branch = currentBranch();
  const result = spawnSync(
    "gh",
    [
      "pr",
      "list",
      "--repo",
      REPO,
      "--head",
      branch,
      "--state",
      "open",
      "--json",
      "number,url,body,title",
    ],
    { encoding: "utf8", env: sanitizedEnv() },
  );
  if (result.status !== 0) return null;
  const prs = JSON.parse(result.stdout);
  return prs[0] ?? null;
}

function issueUrls() {
  const files = fs
    .readdirSync(".plan/issues")
    .filter((name) => name.endsWith(".md"))
    .sort();
  const byNumber = new Map();
  for (const name of files) {
    const text = fs.readFileSync(`.plan/issues/${name}`, "utf8");
    for (const match of text.matchAll(
      /https:\/\/github\.com\/Malnati\/xadrez\/issues\/(\d+)/g,
    )) {
      if (!byNumber.has(match[1]))
        byNumber.set(match[1], {
          number: match[1],
          url: match[0],
          file: `.plan/issues/${name}`,
        });
    }
  }
  return [...byNumber.values()].sort(
    (a, b) => Number(a.number) - Number(b.number),
  );
}

function updatePrViaRest(number, title, markdownBody) {
  const payloadFile = path.join(
    os.tmpdir(),
    `xadrez-pr-payload-${Date.now()}.json`,
  );
  fs.writeFileSync(payloadFile, JSON.stringify({ title, body: markdownBody }));
  try {
    run(
      "gh",
      [
        "api",
        "-X",
        "PATCH",
        `repos/${REPO}/pulls/${number}`,
        "--input",
        payloadFile,
      ],
      { sanitized: true },
    );
  } finally {
    fs.rmSync(payloadFile, { force: true });
  }
}

function addProjectItem(url) {
  try {
    addProjectItem(url);
  } catch (error) {
    const message = String(error?.message ?? error);
    if (!/already|exists|duplicate/i.test(message)) throw error;
  }
}

function body() {
  const issues = issueUrls();
  const closing = issues.map((issue) => `Closes #${issue.number}`).join("\n");
  const issueList = issues
    .map((issue) => `- Issue #${issue.number}: ${issue.file}`)
    .join("\n");
  return `## Documento detalhado\n\n${issueList}\n\n## Marco\n\n- .plan/marcos/marco-01-governanca-plan-project14.md\n- .plan/marcos/marco-02-automacao-codex-governanca.md\n\n## Project 14\n\n- https://github.com/users/Malnati/projects/14/\n- ProjectV2 sincronizado exclusivamente via /Users/mal/.codex/bin/mbra-projects-gh.\n\n## Validação esperada\n\n- git diff --check\n- node scripts/codex/validate-plan-links.mjs\n- node scripts/codex/validate-plan-links.mjs --self-test\n- pnpm test\n- pnpm typecheck\n- pnpm build\n\n${closing}\n`;
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const branch = currentBranch();
  const pr = existingPr();
  const nextBody = body();
  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          action: pr ? "update-pr" : "create-pr",
          branch,
          pr: pr?.url ?? null,
          bodyPreview: nextBody.slice(0, 400),
          projectWrapper: PROJECT_WRAPPER,
        },
        null,
        2,
      ),
    );
    return;
  }
  const bodyFile = `${os.tmpdir()}/xadrez-pr-${Date.now()}.md`;
  fs.writeFileSync(bodyFile, nextBody);
  let url = pr?.url;
  if (pr) {
    try {
      run(
        "gh",
        [
          "pr",
          "edit",
          String(pr.number),
          "--repo",
          REPO,
          "--title",
          "docs: add codex governance automation",
          "--body-file",
          bodyFile,
        ],
        { sanitized: true },
      );
    } catch (error) {
      const message = String(error?.message ?? error);
      if (
        !message.includes("Projects (classic)") &&
        !message.includes("projectCards")
      )
        throw error;
      updatePrViaRest(
        pr.number,
        "docs: add codex governance automation",
        nextBody,
      );
    }
  } else {
    url = run(
      "gh",
      [
        "pr",
        "create",
        "--repo",
        REPO,
        "--base",
        "main",
        "--head",
        branch,
        "--draft",
        "--title",
        "docs: add codex governance automation",
        "--body-file",
        bodyFile,
      ],
      { sanitized: true },
    );
  }
  run(PROJECT_WRAPPER, [
    "project",
    "item-add",
    PROJECT_NUMBER,
    "--owner",
    PROJECT_OWNER,
    "--url",
    url,
  ]);
  fs.rmSync(bodyFile, { force: true });
  console.log(
    JSON.stringify(
      {
        pullRequest: url,
        project: `https://github.com/users/${PROJECT_OWNER}/projects/${PROJECT_NUMBER}/`,
      },
      null,
      2,
    ),
  );
}

main();
