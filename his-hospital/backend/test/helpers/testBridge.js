/**
 * Bridge kết nối tương thích cả Node.js Native Test Runner (`node:test`) và Vitest (`vitest`)
 * Giúp mã kiểm thử chạy mượt mà trên cả 2 framework mà không cần sửa code test.
 */

const isVitest = typeof process.env.VITEST !== "undefined";
const runner = isVitest ? await import("vitest") : await import("node:test");

export const describe = runner.describe;
export const test = runner.test || runner.it;
export const it = runner.it || runner.test;
export const beforeEach = runner.beforeEach;
export const afterEach = runner.afterEach;
export const before = runner.before || runner.beforeAll;
export const after = runner.after || runner.afterAll;
