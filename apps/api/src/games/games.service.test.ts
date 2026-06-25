import { describe, expect, it } from "vitest";
import { GamesService } from "./games.service";

describe("GamesService.evaluateFen", () => {
  it("returns active state for initial position", () => {
    const service = new GamesService({} as never);
    const result = service.evaluateFen(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    );
    expect(result.result).toBe("in_progress");
    expect(result.turn).toBe("w");
  });
});
