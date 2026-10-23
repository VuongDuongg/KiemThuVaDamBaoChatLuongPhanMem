import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/unitTest_NUnitStyle_3ChucNang.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/services/invoiceService.js",
        "src/services/medicineService.js",
        "src/patterns/strategy/billingStrategy.js",
        "src/patterns/state/invoiceState.js"
      ]
    }
  }
});
