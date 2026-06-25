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
    run(PROJECT_WRAPPER, [
      "project",
      "item-add",
      PROJECT_NUMBER,
      "--owner",
      PROJECT_OWNER,
      "--url",
      url,
    ]);
  } catch (error) {
    const message = String(error?.message ?? error);
    if (!/already|exists|duplicate/i.test(message)) throw error;
  }
}

function optionValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function selectedIssueNumbers() {
  const value = optionValue("--issue");
  if (!value) return undefined;
  return new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function issueTitleFromMarkdown(file) {
  const markdown = fs.readFileSync(file, "utf8");
  return (
    markdown.match(/^#\s+Issue\s+\d+\s+[—-]\s+(.+)$/m)?.[1]?.trim() ??
    markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ??
    "Codex managed change"
  );
}

function selectedIssueUrls() {
  const selected = selectedIssueNumbers();
  return issueUrls().filter((issue) => !selected || selected.has(issue.number));
}

function marcoRefsForIssues(issues) {
  const refs = new Set();
  for (const issue of issues) {
    const markdown = fs.readFileSync(issue.file, "utf8");
    for (const match of markdown.matchAll(
      /\.\.\/marcos\/([a-z0-9_.-]+\.md)/gi,
    )) {
      refs.add(`.plan/marcos/${match[1]}`);
    }
  }
  return [...refs].sort();
}

function prTitle(issues) {
  const explicit = optionValue("--title");
  if (explicit) return explicit;
  if (issues.length === 1) {
    const title = issueTitleFromMarkdown(issues[0].file).toLowerCase();
    if (title.includes("i18n")) return "feat(web): add multilingual game flow";
    if (title.includes("automação") || title.includes("governança"))
      return "docs: add codex governance automation";
  }
  return "chore: update codex managed plan";
}

function visualEvidenceSection(branch) {
  const asset = "docs/assets/issues/004/i18n-multilingue-evidence.png";
  if (!fs.existsSync(asset)) return "";
  const blob = `https://github.com/Malnati/xadrez/blob/${branch}/${asset}`;
  const raw = `https://github.com/Malnati/xadrez/raw/${branch}/${asset}`;
  return `
## Evidência visual

<p align="center">
  <a href="${blob}" target="_blank" rel="noopener noreferrer">
    <img src="${raw}" alt="Fluxo multilíngue do Xadrez Medieval após jogada contra o computador" width="50%">
  </a>
</p>

<p align="center">
  <a href="${blob}" target="_blank" rel="noopener noreferrer">Abrir imagem em nova aba/janela</a>
</p>
`;
}

function body(branch = currentBranch()) {
  const issues = selectedIssueUrls();
  if (!issues.length) {
    throw new Error("No .plan issue matched --issue selection");
  }
  const closing = issues.map((issue) => `Closes #${issue.number}`).join("\n");
  const issueList = issues
    .map((issue) => `- Issue #${issue.number}: ${issue.file}`)
    .join("\n");
  const marcoList = marcoRefsForIssues(issues)
    .map((marco) => `- ${marco}`)
    .join("\n");
  return `## Documento detalhado\n\n${issueList}\n\n## Marco\n\n${marcoList || "- Marco não identificado no arquivo .plan da issue."}\n\n## Project 14\n\n- https://github.com/users/Malnati/projects/14/\n- ProjectV2 sincronizado exclusivamente via /Users/mal/.codex/bin/mbra-projects-gh.\n\n## Validação esperada\n\n- git diff --check\n- node scripts/codex/validate-plan-links.mjs\n- node scripts/codex/validate-plan-links.mjs --self-test\n- pnpm format\n- pnpm lint\n- pnpm test\n- pnpm typecheck\n- pnpm build\n- pnpm test:e2e\n${visualEvidenceSection(branch)}\n${closing}\n`;
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const branch = currentBranch();
  const pr = existingPr();
  const nextBody = body(branch);
  const nextTitle = prTitle(selectedIssueUrls());
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
          nextTitle,
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
      updatePrViaRest(pr.number, nextTitle, nextBody);
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
        nextTitle,
        "--body-file",
        bodyFile,
      ],
      { sanitized: true },
    );
  }
  addProjectItem(url);
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
