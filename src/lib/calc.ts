interface Shift {
    start: string;
    end: string;
    hours: number;
}

interface CompensationResult {
    totalHoursWorked: number;
    totalCompensation: number;
}

function calculateStandbyCompensationUntil(timestamp: number, basePayPerHour: number): CompensationResult {
    const MS_PER_HOUR = 1000 * 60 * 60;

    // Weekly shift schedule
    const shifts: Shift[] = [
        { start: "Mon 18:00", end: "Tue 08:00", hours: 14 },
        { start: "Tue 18:00", end: "Wed 08:00", hours: 14 },
        { start: "Wed 18:00", end: "Thu 08:00", hours: 14 },
        { start: "Thu 18:00", end: "Fri 08:00", hours: 14 },
        { start: "Fri 18:00", end: "Mon 08:00", hours: 62 },
    ];

    // Get the start of the current week (Monday 00:00 UTC)
    const date = new Date(timestamp);
    const day = date.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    const hours = date.getUTCHours();
    if (day === 1 && hours < 8) {
        // If it's before the first shift on Monday, consider it part of the previous week
        date.setUTCDate(date.getUTCDate() - 7);
    }

    // Move back to the start of the week (Monday 00:00 UTC)
    const weekStart = new Date(date);
    weekStart.setUTCDate(date.getUTCDate() - ((day + 6) % 7)); // Adjust to Monday
    weekStart.setUTCHours(0, 0, 0, 0);

    // Convert shift times to timestamps relative to the start of the week
    const shiftTimestamps = shifts.map(shift => {
        const [startDay, startTime] = shift.start.split(' ');
        const [startHour, startMinute] = startTime.split(':').map(Number);

        const shiftStart = new Date(weekStart);
        shiftStart.setUTCDate(weekStart.getUTCDate() + (["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(startDay)));
        shiftStart.setUTCHours(startHour, startMinute, 0, 0);

        const shiftEnd = new Date(shiftStart);
        shiftEnd.setUTCHours(shiftStart.getUTCHours() + shift.hours, shiftStart.getUTCMinutes(), 0, 0);

        return { start: shiftStart.getTime(), end: shiftEnd.getTime(), hours: shift.hours };
    });

    let totalHoursWorked = 0;

    for (const shift of shiftTimestamps) {
        if (timestamp < shift.start) {
            // Timestamp is before this shift, so no more shifts need to be processed
            break;
        }

        if (timestamp >= shift.start && timestamp <= shift.end) {
            // Timestamp is within this shift
            const hoursWorked = (timestamp - shift.start) / MS_PER_HOUR;
            totalHoursWorked += hoursWorked;
            break;
        } else {
            // Timestamp is after this shift, so add the full shift hours
            totalHoursWorked += shift.hours;
        }
    }

    return {
        totalHoursWorked,
        totalCompensation: totalHoursWorked * basePayPerHour,
    };
}

export { calculateStandbyCompensationUntil };
