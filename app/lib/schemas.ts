import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    message: 'Please select a transaction type',
  }),
  amount: z
    .number({
      message: 'Amount must be a number',
    })
    .positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
  user_id: z.string().min(1, 'User ID is required'),
});
