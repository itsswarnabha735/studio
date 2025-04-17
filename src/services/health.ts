/**
 * Represents medication information.
 */
export interface Medication {
  /**
   * The name of the medication.
   */
  name: string;
  /**
   * The dosage of the medication.
   */
  dosage: string;
}

/**
 * Represents a medication reminder.
 */
export interface MedicationReminder {
  /**
   * The medication to take.
   */
  medication: Medication;
  /**
   * The time of day to take the medication.
   */
  time: string;
}

/**
 * Asynchronously retrieves medication reminders.
 *
 * @returns A promise that resolves to an array of MedicationReminder objects.
 */
export async function getMedicationReminders(): Promise<MedicationReminder[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      medication: { name: 'Vitamin D', dosage: '1000 IU' },
      time: '8:00 AM',
    },
  ];
}

/**
 * Represents exercise information.
 */
export interface Exercise {
  /**
   * The type of exercise.
   */
  type: string;
  /**
   * The duration of the exercise in minutes.
   */
  duration: number;
  /**
   * The date of the exercise.
   */
  date: string;
}

/**
 * Asynchronously retrieves exercise logs.
 *
 * @returns A promise that resolves to an array of Exercise objects.
 */
export async function getExerciseLogs(): Promise<Exercise[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      type: 'Running',
      duration: 30,
      date: '2024-01-01',
    },
  ];
}
