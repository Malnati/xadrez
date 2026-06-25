#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REQUIRED_ISSUE_SECTIONS = [
  "Objetivo",
  "Contexto",
  "Escopo",
  "Fora de escopo",
  "Marco",
  "Critérios de aceite",
  "Plano de execução",
  "Validação/testes",
  "Evidências esperadas",
  "Links",
  "Status operacional",
];

const REQUIRED_MARCO_SECTIONS = [
  "Objetivo",
  "Contexto",
  "Escopo",
  "Fora de escopo",
  "Issues vinculadas",
  "Ordem de execução",
  "Critérios de conclusão",
  "Dependências",
  "Riscos",
  "Evidências esperadas",
  "Links",
];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => path.join(dir, name))
    .sort();
}

function hasSection(markdown, section) {
  const pattern = new RegExp(`^##\\s+${escapeRegExp(section)}\\s*$`, "m");
  return pattern.test(markdown);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findMissingSections(markdown, required) {
  return required.filter((section) => !hasSection(markdown, section));
}

function containsGithubIssue(markdown) {
  return /https:\/\/github\.com\/Malnati\/xadrez\/issues\/\d+/.test(markdown);
}

function containsPullRequest(markdown) {
  return /https:\/\/github\.com\/Malnati\/xadrez\/pull\/\d+/.test(markdown);
}

function containsProject14(markdown) {
  return /https:\/\/github\.com\/users\/Malnati\/projects\/14\/?/.test(
    markdown,
  );
}

function containsMarcoReference(markdown) {
  return /\.\.\/marcos\/|marcos\//.test(markdown);
}

function validateIssue(file, options = {}) {
  const markdown = read(file);
  const errors = [];
  const missing = findMissingSections(markdown, REQUIRED_ISSUE_SECTIONS);
  if (missing.length) errors.push(`missing sections: ${missing.join(", ")}`);
  if (!containsProject14(markdown)) errors.push("missing Project 14 link");
  if (!containsMarcoReference(markdown)) errors.push("missing marco reference");
  if (!options.allowPendingGithub && !containsGithubIssue(markdown))
    errors.push("missing GitHub issue URL");
  if (!options.allowPendingPr && !containsPullRequest(markdown))
    errors.push("missing pull request URL");
  if (
    /gh project direto|gh \.\.\. --admin|usar `gh` autenticado no macOS para criar\/atualizar itens no Project 14/i.test(
      markdown,
    )
  ) {
    errors.push("contains stale ProjectV2 route wording");
  }
  return errors;
}

function validateMarco(file, options = {}) {
  const markdown = read(file);
  const errors = [];
  const missing = findMissingSections(markdown, REQUIRED_MARCO_SECTIONS);
  if (missing.length) errors.push(`missing sections: ${missing.join(", ")}`);
  if (!containsProject14(markdown)) errors.push("missing Project 14 link");
  if (!options.allowPendingGithub && /A criar/.test(markdown))
    errors.push("contains pending GitHub link");
  return errors;
}

function validateIndex(file, options = {}) {
  const markdown = read(file);
  const errors = [];
  const planDir = path.dirname(file);
  const requiredFiles = [
    ...listMarkdownFiles(path.join(planDir, "issues")).map(
      (candidate) => `issues/${path.basename(candidate)}`,
    ),
    ...listMarkdownFiles(path.join(planDir, "marcos")).map(
      (candidate) => `marcos/${path.basename(candidate)}`,
    ),
  ];
  for (const required of requiredFiles) {
    if (!markdown.includes(required))
      errors.push(`missing index reference: ${required}`);
  }
  if (!containsProject14(markdown)) errors.push("missing Project 14 link");
  if (!markdown.includes("/Users/mal/.codex/bin/mbra-projects-gh"))
    errors.push("missing ProjectV2 wrapper route");
  if (!options.allowPendingGithub && /A criar/.test(markdown))
    errors.push("contains pending GitHub link");
  return errors;
}

function validate(root = process.cwd(), options = {}) {
  const planDir = path.join(root, ".plan");
  const issueDir = path.join(planDir, "issues");
  const marcoDir = path.join(planDir, "marcos");
  const indexFile = path.join(planDir, "README.md");
  const failures = [];

  if (!fs.existsSync(indexFile))
    failures.push(`${path.relative(root, indexFile)}: missing file`);
  if (!fs.existsSync(issueDir))
    failures.push(`${path.relative(root, issueDir)}: missing directory`);
  if (!fs.existsSync(marcoDir))
    failures.push(`${path.relative(root, marcoDir)}: missing directory`);

  if (fs.existsSync(indexFile)) {
    for (const error of validateIndex(indexFile, options))
      failures.push(`${path.relative(root, indexFile)}: ${error}`);
  }
  for (const file of listMarkdownFiles(issueDir)) {
    for (const error of validateIssue(file, options))
      failures.push(`${path.relative(root, file)}: ${error}`);
  }
  for (const file of listMarkdownFiles(marcoDir)) {
    for (const error of validateMarco(file, options))
      failures.push(`${path.relative(root, file)}: ${error}`);
  }
  return failures;
}

function runSelfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "xadrez-plan-"));
  fs.mkdirSync(path.join(tmp, ".plan/issues"), { recursive: true });
  fs.mkdirSync(path.join(tmp, ".plan/marcos"), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, ".plan/README.md"),
    "# Index\n\nissues/issue-001-governanca-plan-project14.md\nissues/issue-002-automacao-codex-governanca.md\nmarcos/marco-01-governanca-plan-project14.md\nmarcos/marco-02-automacao-codex-governanca.md\nhttps://github.com/users/Malnati/projects/14/\n/Users/mal/.codex/bin/mbra-projects-gh\nhttps://github.com/Malnati/xadrez/issues/1\nhttps://github.com/Malnati/xadrez/pull/2\n",
  );
  const issueBody =
    "# Issue 001 — Teste\n\n" +
    REQUIRED_ISSUE_SECTIONS.map(
      (section) =>
        `## ${section}\n\nConteúdo com https://github.com/users/Malnati/projects/14/ e ../marcos/marco-01.md e https://github.com/Malnati/xadrez/issues/1 e https://github.com/Malnati/xadrez/pull/2.`,
    ).join("\n\n");
  fs.writeFileSync(
    path.join(tmp, ".plan/issues/issue-001-governanca-plan-project14.md"),
    issueBody,
  );
  fs.writeFileSync(
    path.join(tmp, ".plan/issues/issue-002-automacao-codex-governanca.md"),
    issueBody.replace("/issues/1", "/issues/2"),
  );
  const marcoBody =
    "# Marco\n\n" +
    REQUIRED_MARCO_SECTIONS.map(
      (section) =>
        `## ${section}\n\nConteúdo com https://github.com/users/Malnati/projects/14/.`,
    ).join("\n\n");
  fs.writeFileSync(
    path.join(tmp, ".plan/marcos/marco-01-governanca-plan-project14.md"),
    marcoBody,
  );
  fs.writeFileSync(
    path.join(tmp, ".plan/marcos/marco-02-automacao-codex-governanca.md"),
    marcoBody,
  );
  assert.deepEqual(validate(tmp), []);
  fs.writeFileSync(
    path.join(tmp, ".plan/issues/issue-002-automacao-codex-governanca.md"),
    "# Broken\n",
  );
  assert(validate(tmp).some((failure) => failure.includes("missing sections")));
  fs.rmSync(tmp, { recursive: true, force: true });
}

if (process.argv.includes("--self-test")) {
  runSelfTest();
  console.log("validate-plan-links self-test OK");
  process.exit(0);
}

const allowPendingGithub = process.argv.includes("--allow-pending-github");
const allowPendingPr = process.argv.includes("--allow-pending-pr");
const failures = validate(process.cwd(), {
  allowPendingGithub,
  allowPendingPr,
});
if (failures.length) {
  console.error("Codex plan validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("Codex plan validation passed");
