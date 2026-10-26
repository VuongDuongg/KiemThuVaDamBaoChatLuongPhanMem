import { globalData } from "./seedData.js";

// Export mockPatients linking with global seed data for backward compatibility and testing
export let mockPatients = globalData.patients;

export const setMockPatients = (data) => {
  globalData.patients = data;
  mockPatients = globalData.patients;
};
