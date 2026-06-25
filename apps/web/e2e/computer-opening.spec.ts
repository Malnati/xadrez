import { expect, type Page, test } from "@playwright/test";

type LocaleCase = {
  locale: "pt-BR" | "en-US" | "es-419";
  languageButton: string;
  signIn: string;
  modeTitle: string;
  youPlayWhite: string;
  whiteTurn: string;
  thinking: string;
  expectedLang: string;
};

const localeCases: LocaleCase[] = [
  {
    locale: "pt-BR",
    languageButton: "language-pt-BR",
    signIn: "Entrar",
    modeTitle: "Jogador vs Computador",
    youPlayWhite: "Você joga com as brancas",
    whiteTurn: "Turno das brancas",
    thinking: "Oponente pensando",
    expectedLang: "pt-BR",
  },
  {
    locale: "en-US",
    languageButton: "language-en-US",
    signIn: "Sign in",
    modeTitle: "Player vs Computer",
    youPlayWhite: "You play as white",
    whiteTurn: "white to move",
    thinking: "Opponent thinking",
    expectedLang: "en-US",
  },
  {
    locale: "es-419",
    languageButton: "language-es-419",
    signIn: "Entrar",
    modeTitle: "Jugador vs Computadora",
    youPlayWhite: "Juegas con blancas",
    whiteTurn: "Turno de blancas",
    thinking: "Oponente pensando",
    expectedLang: "es-419",
  },
];

async function openFresh(page: Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function chooseLanguage(page: Page, testId: string) {
  await expect(page.getByTestId("language-gate")).toBeVisible();
  await page.getByTestId(testId).click();
}

async function playFirstWhiteMove(page: Page, localeCase: LocaleCase) {
  await expect(
    page.getByRole("heading", { name: "Xadrez Medieval" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: localeCase.signIn }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute(
    "lang",
    localeCase.expectedLang,
  );

  await page.getByTestId("mode-computer").click();
  await page.getByTestId("player-color-white").click();

  await expect(page.getByText(localeCase.youPlayWhite)).toBeVisible();
  await expect(page.getByTestId("turn-status")).toContainText(
    localeCase.whiteTurn,
  );

  await page.getByTestId("board-square-e2").click();
  await page.getByTestId("board-square-e4").click();

  await expect(page.getByTestId("move-log")).toContainText("e4");
  await expect(page.getByTestId("move-log-entry")).toHaveCount(2, {
    timeout: 20_000,
  });
  await expect(page.getByTestId("turn-status")).toContainText(
    localeCase.whiteTurn,
  );
  await expect(page.getByTestId("turn-status")).not.toContainText(
    localeCase.thinking,
  );

  await expect(
    page.getByRole("link", { name: localeCase.signIn }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("xadrez_token")),
  ).toBeNull();
  await expect(page).toHaveURL("http://127.0.0.1:5173/");
  expect(page.url()).not.toContain("/auth/callback");
}

test("guest sees the language gate before entering the game", async ({
  page,
}) => {
  await openFresh(page);

  await expect(page.getByTestId("language-gate")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Xadrez Medieval" }),
  ).toBeVisible();
  await expect(page.getByTestId("mode-computer")).toHaveCount(0);
});

for (const localeCase of localeCases) {
  test(`guest starts a computer game as white in ${localeCase.locale}`, async ({
    page,
  }) => {
    await openFresh(page);
    await chooseLanguage(page, localeCase.languageButton);
    await expect(page.getByText(localeCase.modeTitle)).toBeVisible();

    await playFirstWhiteMove(page, localeCase);
  });
}

test("selected language persists after reload", async ({ page }) => {
  await openFresh(page);
  await chooseLanguage(page, "language-en-US");

  await expect(page.getByText("Player vs Computer")).toBeVisible();
  await page.reload();

  await expect(page.getByTestId("language-gate")).toHaveCount(0);
  await expect(page.getByText("Player vs Computer")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
});

test("switching language does not reset the current game", async ({ page }) => {
  await openFresh(page);
  await chooseLanguage(page, "language-pt-BR");
  await playFirstWhiteMove(page, localeCases[0]!);

  await page.getByTestId("language-switcher").selectOption("en-US");

  await expect(page.getByText("Player vs Computer")).toBeVisible();
  await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
  await expect(page.getByTestId("move-log")).toContainText("e4");
  await expect(page.getByTestId("move-log-entry")).toHaveCount(2);
  await expect(page.getByTestId("turn-status")).toContainText("white to move");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
});

test("English and Spanish screens do not leak Portuguese game copy", async ({
  page,
}) => {
  const forbidden = ["Nova partida", "Você joga", "Turno das", "Histórico"];

  for (const localeCase of localeCases.filter(
    (item) => item.locale !== "pt-BR",
  )) {
    await openFresh(page);
    await chooseLanguage(page, localeCase.languageButton);
    await expect(page.getByText(localeCase.modeTitle)).toBeVisible();

    for (const text of forbidden) {
      await expect(page.getByText(text, { exact: false })).toHaveCount(0);
    }
  }
});
