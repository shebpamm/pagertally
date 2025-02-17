import { calculateStandbyCompensationUntil } from "../src/lib/calc"

describe("calculateStandbyCompensationUntil", () => {
    const BASE_PAY = 10; // Example base pay per hour
    
    test("calculates correct compensation for start of week (Monday 08:00 UTC)", () => {
        const timestamp = new Date("2025-01-06T08:00:00Z").getTime(); // Monday 00:00 UTC
        const result = calculateStandbyCompensationUntil(timestamp, BASE_PAY);
        expect(result.totalHoursWorked).toBe(0);
        expect(result.totalCompensation).toBe(0);
    });

    test("calculates correct compensation for part of first shift (Monday 20:00 UTC)", () => {
        const timestamp = new Date("2025-01-06T20:00:00Z").getTime(); // Monday 20:00 UTC
        const result = calculateStandbyCompensationUntil(timestamp, BASE_PAY);
        expect(result.totalHoursWorked).toBeCloseTo(2, 1);
        expect(result.totalCompensation).toBeCloseTo(2 * BASE_PAY, 1);
    });

    test("calculates full week compensation (following Monday 08:00 UTC)", () => {
        const timestamp = new Date("2025-01-13:07:59Z").getTime(); // Monday 08:00 UTC
        const result = calculateStandbyCompensationUntil(timestamp, BASE_PAY);
        expect(result.totalHoursWorked).toBeCloseTo(118, 0); // 14+14+14+14+62 = 118
        expect(result.totalCompensation).toBeCloseTo(118 * BASE_PAY, 0);
    });

    test("handles middle of weekend shift correctly (Saturday 12:00 UTC)", () => {
        const timestamp = new Date("2025-01-11T13:00:00Z").getTime(); // Saturday 12:00 UTC
        const result = calculateStandbyCompensationUntil(timestamp, BASE_PAY);
        expect(result.totalHoursWorked).toBeCloseTo(75, 1); // Should be within weekend shift
        expect(result.totalCompensation).toBeCloseTo(75 * BASE_PAY, 1);
    });
});
