import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '~/api/transaction.api';
import queryKeys from '~/constants/queryKeys';

const useTransaction = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success('Transaction created successfully!');
      queryClient.invalidateQueries({ queryKey: [queryKeys.getTransactions] });
      navigate('/transactions');
    },
    onError: (error: AxiosError) => {
      toast.error('Error: ' + error.message);
    },
  });

  const editTransactionMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      toast.success('Transaction updated successfully!');
      queryClient.invalidateQueries({ queryKey: [queryKeys.getTransactions] });
      navigate('/transactions');
    },
    onError: (error: AxiosError) => {
      toast.error('Error: ' + error.message);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast.success('Transaction deleted successfully!');
      queryClient.invalidateQueries({ queryKey: [queryKeys.getTransactions] });
    },
    onError: (error: AxiosError) => {
      toast.error('Error deleting transaction: ' + error.message);
    },
  });

  return {
    createTransactionMutation,
    editTransactionMutation,
    deleteTransactionMutation,
  };
};

export default useTransaction;
