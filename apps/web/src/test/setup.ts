import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class WorkerMock {
  onmessage: ((event: MessageEvent) => void) | null = null;
  postMessage() {}
  terminate() {}
}

vi.stubGlobal("Worker", WorkerMock);
vi.mock("pixi.js", () => {
  class Chain {
    children: unknown[] = [];
    eventMode = "none";
    cursor = "default";
    x = 0;
    y = 0;
    anchor = { set: vi.fn() };
    rect() {
      return this;
    }
    roundRect() {
      return this;
    }
    fill() {
      return this;
    }
    stroke() {
      return this;
    }
    moveTo() {
      return this;
    }
    lineTo() {
      return this;
    }
    on() {
      return this;
    }
    addChild(child: unknown) {
      this.children.push(child);
      return child;
    }
    removeChildren() {
      this.children = [];
    }
  }
  class Application {
    canvas = document.createElement("canvas");
    stage = { addChild: vi.fn(), removeChildren: vi.fn() };
    async init() {}
    destroy() {}
  }
  return {
    Application,
    Container: Chain,
    Graphics: Chain,
    Text: Chain,
    TextStyle: Chain,
  };
});
