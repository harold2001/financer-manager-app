import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { getTransactions } from '~/api/transaction.api';
import queryKeys from '~/constants/queryKeys';
import { useAuthStore } from '~/store/useAuthStore';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Calendar } from '~/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import type { Transaction } from '~/api/interfaces/transaction.interface';

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

export function Reports() {
  const { user, loading } = useAuthStore();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0], // Today
  });
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKeys.getTransactions],
    queryFn: getTransactions,
    enabled: !!user,
  });

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions, dateRange]);

  // Calculate financial metrics
  const metrics = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = income - expenses;

    // Calculate spending by category
    const categorySpending = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

    // Calculate income by category
    const incomeByCategory = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

    // Calculate daily spending trend
    const dailySpending = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const date = t.date.split('T')[0];
        acc[date] = (acc[date] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const averageDailySpending =
      Object.values(dailySpending).length > 0
        ? Object.values(dailySpending).reduce(
            (sum, amount) => sum + amount,
            0
          ) / Object.values(dailySpending).length
        : 0;

    return {
      income,
      expenses,
      balance,
      categorySpending,
      incomeByCategory,
      dailySpending,
      averageDailySpending,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Reports</h1>
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
          <h1 className='text-3xl font-bold tracking-tight'>Reports</h1>
          <p className='text-red-600'>You must be logged in to view reports.</p>
        </div>
      </div>
    );
  }

  const topExpenseCategories = Object.entries(metrics.categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topIncomeCategories = Object.entries(metrics.incomeByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Financial Reports
          </h1>
          <p className='text-muted-foreground'>
            Comprehensive insights into your financial activity.
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className='p-4'>
        <div className='flex flex-col sm:flex-row gap-4 items-end'>
          <div className='flex-1'>
            <label className='text-sm font-medium mb-2 block'>Start Date</label>
            <div className='relative flex gap-2'>
              <Input
                readOnly
                value={formatDateForDisplay(dateRange.startDate)}
                placeholder='MM/DD/YYYY'
                className='cursor-pointer'
                onClick={() => setStartCalendarOpen(true)}
              />
              <Button
                type='button'
                variant='ghost'
                className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
                onClick={() => setStartCalendarOpen(true)}
              >
                <CalendarIcon className='size-3.5' />
                <span className='sr-only'>Select start date</span>
              </Button>
            </div>

            {/* Start Date Calendar Dialog */}
            <Dialog
              open={startCalendarOpen}
              onOpenChange={setStartCalendarOpen}
            >
              <DialogContent className='w-auto p-0'>
                <DialogHeader className='p-4 pb-0'>
                  <DialogTitle>Select Start Date</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode='single'
                  selected={
                    dateRange.startDate
                      ? new Date(dateRange.startDate + 'T00:00:00')
                      : undefined
                  }
                  onSelect={date => {
                    if (date) {
                      setDateRange(prev => ({
                        ...prev,
                        startDate: formatDateForForm(date),
                      }));
                      setStartCalendarOpen(false);
                    }
                  }}
                  captionLayout='dropdown'
                  className='p-4'
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className='flex-1'>
            <label className='text-sm font-medium mb-2 block'>End Date</label>
            <div className='relative flex gap-2'>
              <Input
                readOnly
                value={formatDateForDisplay(dateRange.endDate)}
                placeholder='MM/DD/YYYY'
                className='cursor-pointer'
                onClick={() => setEndCalendarOpen(true)}
              />
              <Button
                type='button'
                variant='ghost'
                className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
                onClick={() => setEndCalendarOpen(true)}
              >
                <CalendarIcon className='size-3.5' />
                <span className='sr-only'>Select end date</span>
              </Button>
            </div>

            {/* End Date Calendar Dialog */}
            <Dialog open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
              <DialogContent className='w-auto p-0'>
                <DialogHeader className='p-4 pb-0'>
                  <DialogTitle>Select End Date</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode='single'
                  selected={
                    dateRange.endDate
                      ? new Date(dateRange.endDate + 'T00:00:00')
                      : undefined
                  }
                  onSelect={date => {
                    if (date) {
                      setDateRange(prev => ({
                        ...prev,
                        endDate: formatDateForForm(date),
                      }));
                      setEndCalendarOpen(false);
                    }
                  }}
                  captionLayout='dropdown'
                  className='p-4'
                />
              </DialogContent>
            </Dialog>
          </div>
          <Button
            variant='outline'
            onClick={() =>
              setDateRange({
                startDate: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1
                )
                  .toISOString()
                  .split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
              })
            }
          >
            Reset to This Month
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className='p-6'>
              <div className='animate-pulse'>
                <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
                <div className='h-8 bg-gray-200 rounded w-3/4'></div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className='p-6'>
          <p className='text-red-600'>Error loading reports: {error.message}</p>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Income
                  </p>
                  <p className='text-2xl font-bold text-green-600'>
                    +${metrics.income.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className='h-8 w-8 text-green-600' />
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Expenses
                  </p>
                  <p className='text-2xl font-bold text-red-600'>
                    -${metrics.expenses.toFixed(2)}
                  </p>
                </div>
                <TrendingDown className='h-8 w-8 text-red-600' />
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Net Balance
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      metrics.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metrics.balance >= 0 ? '+' : ''}$
                    {metrics.balance.toFixed(2)}
                  </p>
                </div>
                <DollarSign
                  className={`h-8 w-8 ${
                    metrics.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                />
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Transactions
                  </p>
                  <p className='text-2xl font-bold text-blue-600'>
                    {metrics.transactionCount}
                  </p>
                </div>
                <BarChart3 className='h-8 w-8 text-blue-600' />
              </div>
            </Card>
          </div>

          {/* Charts and Insights */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Top Expense Categories */}
            <Card className='p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <PieChart className='h-5 w-5' />
                <h3 className='text-lg font-semibold'>
                  Top Expense Categories
                </h3>
              </div>
              {topExpenseCategories.length > 0 ? (
                <div className='space-y-3'>
                  {topExpenseCategories.map(([category, amount]) => {
                    const percentage =
                      metrics.expenses > 0
                        ? (amount / metrics.expenses) * 100
                        : 0;
                    return (
                      <div key={category} className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                          <span className='font-medium'>{category}</span>
                          <span className='text-muted-foreground'>
                            ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className='bg-red-500 h-2 rounded-full transition-all duration-300'
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className='text-muted-foreground'>
                  No expense data for this period.
                </p>
              )}
            </Card>

            {/* Top Income Categories */}
            <Card className='p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <TrendingUp className='h-5 w-5' />
                <h3 className='text-lg font-semibold'>Top Income Categories</h3>
              </div>
              {topIncomeCategories.length > 0 ? (
                <div className='space-y-3'>
                  {topIncomeCategories.map(([category, amount]) => {
                    const percentage =
                      metrics.income > 0 ? (amount / metrics.income) * 100 : 0;
                    return (
                      <div key={category} className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                          <span className='font-medium'>{category}</span>
                          <span className='text-muted-foreground'>
                            ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className='bg-green-500 h-2 rounded-full transition-all duration-300'
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className='text-muted-foreground'>
                  No income data for this period.
                </p>
              )}
            </Card>
          </div>

          {/* Additional Insights */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-3'>Daily Average</h3>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Avg. Daily Spending:
                  </span>
                  <span className='font-medium text-red-600'>
                    ${metrics.averageDailySpending.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Days with transactions:
                  </span>
                  <span className='font-medium'>
                    {Object.keys(metrics.dailySpending).length}
                  </span>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-3'>Savings Rate</h3>
              <div className='space-y-2'>
                {metrics.income > 0 ? (
                  <>
                    <div className='text-2xl font-bold text-blue-600'>
                      {((metrics.balance / metrics.income) * 100).toFixed(1)}%
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      You're{' '}
                      {metrics.balance >= 0 ? 'saving' : 'overspending by'}{' '}
                      {Math.abs(
                        (metrics.balance / metrics.income) * 100
                      ).toFixed(1)}
                      % of your income
                    </p>
                  </>
                ) : (
                  <p className='text-muted-foreground'>
                    No income data to calculate savings rate.
                  </p>
                )}
              </div>
            </Card>

            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-3'>Period Summary</h3>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>Period:</span>
                  <span className='font-medium text-xs'>
                    {new Date(dateRange.startDate).toLocaleDateString('en-US', {
                      timeZone: 'UTC',
                    })}{' '}
                    -{' '}
                    {new Date(dateRange.endDate).toLocaleDateString('en-US', {
                      timeZone: 'UTC',
                    })}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Income Sources:
                  </span>
                  <span className='font-medium'>
                    {Object.keys(metrics.incomeByCategory).length}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Expense Categories:
                  </span>
                  <span className='font-medium'>
                    {Object.keys(metrics.categorySpending).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
