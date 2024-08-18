import { describe, expect, it } from "vitest";
import logger from "./winston.util";

describe("WinstonTests", () => {
  it("log levels", () => {
    expect(logger).toBeDefined();
    logger.debug("hello, [debug] winston");
    logger.info("hello, [info] winston");
    logger.warn("hello, [warn] winston");
    logger.error("hello, [error] winston");
  });

  it("log object", () => {
    expect(logger).toBeDefined();
    logger.info({ a: 1, b: 2 });
  });

  it("log date", () => {
    expect(logger).toBeDefined();
    logger.info(new Date());
  });

  it("log boolean", () => {
     expect(logger).toBeDefined();
    logger.info(true);
  });

  it("log array", () => {
    expect(logger).toBeDefined();
    logger.info([
      { a: 1, b: 2 },
      { a: 1, b: 2 },
      { a: 1, b: 2 },
    ]);
  });
});
