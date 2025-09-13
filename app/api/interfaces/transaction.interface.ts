import type { DeepPartial } from 'react-hook-form';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
  user_id: string;
}

export interface CreateTransactionDTO {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
  user_id: string;
}

export interface UpdateTransactionDTO
  extends DeepPartial<CreateTransactionDTO> {
  id: string;
}
