import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(72, 'Password is too long.'),
  school: z.string().trim().max(160).optional().or(z.literal('')),
});

export const signInSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(72, 'Password is too long.'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

/** Lesson generator form. Subject is locked to Biology server-side (MVP). */
export const generatePackSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(3, 'Enter a lesson topic.')
    .max(160, 'Topic is too long.'),
  examBoard: z.string().trim().min(1, 'Choose an exam board.').max(60),
  courseLevel: z.string().trim().min(1, 'Choose a course level.').max(60),
  abilityLevel: z.string().trim().min(1, 'Choose an ability level.').max(60),
  lessonLength: z.string().trim().min(1, 'Choose a lesson length.').max(60),
  learningObjectives: z
    .string()
    .trim()
    .max(2000, 'Learning objectives are too long.')
    .optional()
    .or(z.literal('')),
  teacherNotes: z
    .string()
    .trim()
    .max(2000, 'Notes are too long.')
    .optional()
    .or(z.literal('')),
});

export type GeneratePackInput = z.infer<typeof generatePackSchema>;
