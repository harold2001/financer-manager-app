import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { type z } from 'zod';
import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Calendar } from '~/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { transactionSchema } from '~/lib/schemas';
import useTransaction from '~/hooks/useTransaction';
import { useAuthStore } from '~/store/useAuthStore';
import { getTransactionById } from '~/api/transaction.api';
import queryKeys from '~/constants/queryKeys';

type TransactionFormData = z.infer<typeof transactionSchema>;

// Helper function to format date for display (MM/DD/YYYY)
function formatDateForDisplay(dateString: string | undefined) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US');
}

// Helper function to convert Date object to YYYY-MM-DD string
function formatDateForForm(date: Date | undefined) {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

export function CreateTransaction() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createTransactionMutation, editTransactionMutation } =
    useTransaction();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Determine if we're in edit mode
  const isEditMode = !!id;

  // Only fetch transaction data if we're in edit mode
  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKeys.getTransactions, id],
    queryFn: () => getTransactionById(id!),
    enabled: isEditMode && !!user,
  });

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      description: '',
      user_id: user?.uid || '',
    },
  });

  // Update form when transaction data is loaded (for edit mode)
  useEffect(() => {
    if (isEditMode && transaction) {
      // Ensure date is in YYYY-MM-DD format for date input
      const formattedDate = transaction.date.includes('T')
        ? transaction.date.split('T')[0]
        : transaction.date;

      form.reset({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        date: formattedDate,
        description: transaction.description,
        user_id: transaction.user_id,
      });
    }
  }, [isEditMode, transaction, form]);

  const onSubmit = async (data: TransactionFormData) => {
    if (!user?.uid) {
      console.error('User not authenticated');
      return;
    }

    try {
      if (isEditMode && id) {
        // Update existing transaction
        await editTransactionMutation.mutateAsync({
          id,
          ...data,
          user_id: user.uid,
        });
      } else {
        // Create new transaction
        await createTransactionMutation.mutateAsync({
          ...data,
          user_id: user.uid,
        });
        form.reset();
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} transaction:`,
        error
      );
    }
  };

  const commonCategories = {
    income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'],
    expense: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Education',
      'Travel',
      'Other',
    ],
  };

  const selectedType = form.watch('type');

  // Loading state for edit mode
  if (isEditMode && isLoading) {
    return (
      <div className='container mx-auto max-w-2xl py-8'>
        <Card className='p-6'>
          <p className='text-muted-foreground'>Loading transaction...</p>
        </Card>
      </div>
    );
  }

  // Error state for edit mode
  if (isEditMode && (error || !transaction)) {
    return (
      <div className='container mx-auto max-w-2xl py-8'>
        <Card className='p-6'>
          <p className='text-red-600'>
            Error loading transaction. Please try again.
          </p>
          <Button
            variant='outline'
            onClick={() => navigate('/transactions')}
            className='mt-4'
          >
            Back to Transactions
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-2xl py-8'>
      <Card className='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold'>
            {isEditMode ? 'Edit Transaction' : 'Create New Transaction'}
          </h1>
          <Button variant='outline' onClick={() => navigate('/transactions')}>
            Back to Transactions
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <div className='flex gap-4'>
                      <label className='flex items-center space-x-2 cursor-pointer'>
                        <input
                          type='radio'
                          value='income'
                          checked={field.value === 'income'}
                          onChange={() => field.onChange('income')}
                          className='text-green-600'
                        />
                        <span className='text-green-600 font-medium'>
                          Income
                        </span>
                      </label>
                      <label className='flex items-center space-x-2 cursor-pointer'>
                        <input
                          type='radio'
                          value='expense'
                          checked={field.value === 'expense'}
                          onChange={() => field.onChange('expense')}
                          className='text-red-600'
                        />
                        <span className='text-red-600 font-medium'>
                          Expense
                        </span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='amount'
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      placeholder='0.00'
                      {...field}
                      value={value || ''}
                      onChange={e => {
                        const val = e.target.value;
                        onChange(val === '' ? 0 : parseFloat(val) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <option value=''>Select a category</option>
                      {commonCategories[selectedType].map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <div className='relative flex gap-2'>
                      <Input
                        readOnly
                        value={formatDateForDisplay(field.value)}
                        placeholder='MM/DD/YYYY'
                        className='cursor-pointer'
                        onClick={() => setCalendarOpen(true)}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
                        onClick={() => setCalendarOpen(true)}
                      >
                        <CalendarIcon className='size-3.5' />
                        <span className='sr-only'>Select date</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />

                  {/* Calendar Dialog */}
                  <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <DialogContent className='w-auto p-0'>
                      <DialogHeader className='p-4 pb-0'>
                        <DialogTitle>Select Date</DialogTitle>
                      </DialogHeader>
                      <Calendar
                        mode='single'
                        selected={
                          field.value
                            ? new Date(field.value + 'T00:00:00')
                            : undefined
                        }
                        onSelect={date => {
                          if (date) {
                            field.onChange(formatDateForForm(date));
                            setCalendarOpen(false);
                          }
                        }}
                        captionLayout='dropdown'
                        className='p-4'
                      />
                    </DialogContent>
                  </Dialog>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter transaction description'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                disabled={
                  isEditMode
                    ? editTransactionMutation.isPending
                    : createTransactionMutation.isPending
                }
                className='flex-1'
              >
                {isEditMode
                  ? editTransactionMutation.isPending
                    ? 'Updating...'
                    : 'Update Transaction'
                  : createTransactionMutation.isPending
                  ? 'Creating...'
                  : 'Create Transaction'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() =>
                  isEditMode ? navigate('/transactions') : form.reset()
                }
                disabled={
                  isEditMode
                    ? editTransactionMutation.isPending
                    : createTransactionMutation.isPending
                }
              >
                {isEditMode ? 'Cancel' : 'Reset'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
