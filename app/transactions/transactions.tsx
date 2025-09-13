import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { getTransactions } from '~/api/transaction.api';
import queryKeys from '~/constants/queryKeys';
import { useAuthStore } from '~/store/useAuthStore';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import type { Transaction } from '~/api/interfaces/transaction.interface';
import { useNavigate } from 'react-router';
import useTransaction from '~/hooks/useTransaction';

export function Transactions() {
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();
  const { deleteTransactionMutation } = useTransaction();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.getTransactions],
    queryFn: getTransactions,
    enabled: !!user, // Only run query if user is authenticated
  });

  // Calculate totals
  const calculateTotals = (transactions: Transaction[]) => {
    return transactions.reduce(
      (totals, transaction) => {
        const amount = Number(transaction.amount);
        if (transaction.type === 'income') {
          totals.totalIncome += amount;
        } else {
          totals.totalExpenses += amount;
        }
        totals.balance = totals.totalIncome - totals.totalExpenses;
        return totals;
      },
      { totalIncome: 0, totalExpenses: 0, balance: 0 }
    );
  };

  const totals = data
    ? calculateTotals(data)
    : { totalIncome: 0, totalExpenses: 0, balance: 0 };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransactionMutation.mutateAsync(transactionToDelete.id);
        setDeleteDialogOpen(false);
        setTransactionToDelete(null);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Transactions</h1>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if not authenticated
  if (!user) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Transactions</h1>
          <p className='text-red-600'>
            You must be logged in to view transactions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Transactions</h1>
        <p className='text-muted-foreground'>
          Manage and view your financial transactions.
        </p>
      </div>

      {/* Financial Summary */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-card rounded-lg border p-4'>
          <h3 className='text-sm font-medium text-muted-foreground'>
            Total Income
          </h3>
          <p className='text-2xl font-bold text-green-600'>
            +${totals.totalIncome.toFixed(2)}
          </p>
        </div>
        <div className='bg-card rounded-lg border p-4'>
          <h3 className='text-sm font-medium text-muted-foreground'>
            Total Expenses
          </h3>
          <p className='text-2xl font-bold text-red-600'>
            -${totals.totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className='bg-card rounded-lg border p-4'>
          <h3 className='text-sm font-medium text-muted-foreground'>Balance</h3>
          <p
            className={`text-2xl font-bold ${
              totals.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ${totals.balance >= 0 ? '+' : ''}${totals.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transactions content */}
      <div className='bg-card rounded-lg border p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold'>Recent Transactions</h3>
          <Button onClick={() => navigate('/transactions/create')}>
            Add Transaction
          </Button>
        </div>

        {isLoading ? (
          <div className='space-y-2'>
            <p className='text-muted-foreground'>Loading transactions...</p>
          </div>
        ) : error ? (
          <div className='space-y-2'>
            <p className='text-red-600'>
              Error loading transactions: {error.message}
            </p>
            <p className='text-sm text-muted-foreground'>
              Please try refreshing the page or contact support.
            </p>
          </div>
        ) : data && data.length > 0 ? (
          <div className='space-y-2'>
            {data.map((transaction, index) => (
              <div
                key={transaction.id || index}
                className='p-3 border rounded-md'
              >
                <div className='flex justify-between items-center'>
                  <div className='flex-1'>
                    <p className='font-medium'>
                      {transaction.description || 'No description'}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {transaction.category} •{' '}
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        timeZone: 'UTC',
                      })}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='text-right'>
                      <p
                        className={`font-medium ${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}$
                        {transaction.amount}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          navigate(`/transactions/edit/${transaction.id}`)
                        }
                        className='h-8 w-8 p-0'
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteClick(transaction)}
                        className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='space-y-2'>
            <p className='text-muted-foreground'>No transactions found.</p>
            <p className='text-sm text-muted-foreground'>
              Your transaction history will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {transactionToDelete && (
            <div className='py-4'>
              <div className='p-3 bg-gray-50 rounded-md'>
                <p className='font-medium'>{transactionToDelete.description}</p>
                <p className='text-sm text-muted-foreground'>
                  {transactionToDelete.category} • ${transactionToDelete.amount}{' '}
                  • {new Date(transactionToDelete.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={handleDeleteCancel}
              disabled={deleteTransactionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteConfirm}
              disabled={deleteTransactionMutation.isPending}
            >
              {deleteTransactionMutation.isPending
                ? 'Deleting...'
                : 'Yes, Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
