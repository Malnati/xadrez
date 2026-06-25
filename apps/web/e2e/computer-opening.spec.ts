import { expect, test } from "@playwright/test";

test("guest starts a computer game as white and plays the first move", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Xadrez Medieval" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Entrar" })).toBeVisible();

  await page.getByTestId("mode-computer").click();
  await page.getByTestId("player-color-white").click();

  await expect(page.getByText("Você joga com as brancas")).toBeVisible();
  await expect(page.getByTestId("turn-status")).toContainText(
    "Turno das brancas",
  );

  await page.getByTestId("board-square-e2").click();
  await page.getByTestId("board-square-e4").click();

  await expect(page.getByTestId("move-log")).toContainText("e4");
  await expect(page.getByTestId("move-log-entry")).toHaveCount(2, {
    timeout: 20_000,
  });
  await expect(page.getByTestId("turn-status")).toContainText(
    "Turno das brancas",
  );
  await expect(page.getByTestId("turn-status")).not.toContainText(
    "Oponente pensando",
  );

  await expect(page.getByRole("link", { name: "Entrar" })).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("xadrez_token")),
  ).toBeNull();
  await expect(page).toHaveURL("http://127.0.0.1:5173/");
  expect(page.url()).not.toContain("/auth/callback");
});
