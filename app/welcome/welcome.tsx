'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { LogIn, DollarSign } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card } from '~/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '~/components/ui/form';
import { loginSchema } from '~/lib/schemas';
import useUser from '~/hooks/useUser';

type LoginFormValues = z.infer<typeof loginSchema>;

export function Welcome() {
  const { loginMutation } = useUser();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await loginMutation.mutateAsync(values);
  }

  return (
    <main className='min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='w-full max-w-md space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <DollarSign className='h-8 w-8 text-blue-600' />
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Finance App
            </h1>
          </div>
          <p className='text-gray-600 dark:text-gray-400'>
            Sign in to manage your finances
          </p>
        </div>

        {/* Login Form */}
        <Card className='p-8 shadow-lg'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='john@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='••••••••'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full mt-6'
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Signing In...
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <LogIn className='h-4 w-4' />
                    Sign In
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </Card>

        {/* Registration Link */}
        <div className='text-center space-y-4'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-blue-600 hover:text-blue-700 font-medium hover:underline'
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Features Preview */}
        <div className='mt-8 p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm'>
          <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>
            Features:
          </h3>
          <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
            <li>• Track income and expenses</li>
            <li>• Generate detailed financial reports</li>
            <li>• Categorize transactions</li>
            <li>• Secure cloud storage</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
