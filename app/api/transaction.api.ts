import api from '~/lib/axios';
import type {
  CreateTransactionDTO,
  Transaction,
  UpdateTransactionDTO,
} from './interfaces/transaction.interface';

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/transactions/');
  return response.data;
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (
  data: CreateTransactionDTO
): Promise<Transaction> => {
  const response = await api.post('/transactions/', data);
  return response.data;
};

export const updateTransaction = async (
  data: UpdateTransactionDTO
): Promise<Transaction> => {
  const response = await api.put(`/transactions/${data.id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};
