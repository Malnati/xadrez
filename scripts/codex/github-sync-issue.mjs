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
  if (result.status !== 0) {
    throw new Error(
      `${cmd} ${args.join(" ")} failed: ${result.stderr || result.stdout}`.trim(),
    );
  }
  return result.stdout.trim();
}

function issueTitle(markdown) {
  const h1 =
    markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "Codex governance issue";
  return h1.replace(/^Issue\s+\d+\s+[—-]\s+/, "").trim();
}

function issueUrl(markdown) {
  return markdown.match(
    /https:\/\/github\.com\/Malnati\/xadrez\/issues\/\d+/,
  )?.[0];
}

function updateIssueUrl(file, url) {
  let markdown = fs.readFileSync(file, "utf8");
  markdown = markdown.replace(
    /GitHub issue: A criar\./g,
    `GitHub issue: [Issue #${url.split("/").pop()}](${url}).`,
  );
  markdown = markdown.replace(
    /\| A criar \| \[Project 14\]/g,
    `| [Issue #${url.split("/").pop()}](${url}) | [Project 14]`,
  );
  markdown = markdown.replace(
    /Issue GitHub: A criar\./g,
    `Issue GitHub: [Issue #${url.split("/").pop()}](${url}).`,
  );
  fs.writeFileSync(file, markdown);
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const file = process.argv.find((arg) => arg.endsWith(".md"));
  if (!file) {
    console.error(
      "usage: github-sync-issue.mjs [--dry-run] .plan/issues/issue-NNN-slug.md",
    );
    process.exit(64);
  }
  const markdown = fs.readFileSync(file, "utf8");
  const existing = issueUrl(markdown);
  const title = issueTitle(markdown);
  const bodyFile = path.join(os.tmpdir(), `xadrez-issue-${Date.now()}.md`);
  fs.writeFileSync(
    bodyFile,
    `${markdown}\n\n---\n\nDocumento detalhado: \`${file}\`\nProject 14: https://github.com/users/Malnati/projects/14/\n`,
  );

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          action: existing ? "update-issue" : "create-issue",
          repo: REPO,
          title,
          file,
          projectWrapper: PROJECT_WRAPPER,
        },
        null,
        2,
      ),
    );
    fs.rmSync(bodyFile, { force: true });
    return;
  }

  let url = existing;
  if (url) {
    const number = url.split("/").pop();
    run(
      "gh",
      [
        "issue",
        "edit",
        number,
        "--repo",
        REPO,
        "--title",
        title,
        "--body-file",
        bodyFile,
      ],
      { sanitized: true },
    );
  } else {
    url = run(
      "gh",
      [
        "issue",
        "create",
        "--repo",
        REPO,
        "--title",
        title,
        "--body-file",
        bodyFile,
      ],
      { sanitized: true },
    );
    updateIssueUrl(file, url);
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
        issue: url,
        project: `https://github.com/users/${PROJECT_OWNER}/projects/${PROJECT_NUMBER}/`,
      },
      null,
      2,
    ),
  );
}

main();
