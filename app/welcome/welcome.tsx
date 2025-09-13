'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
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
    <main className='flex flex-col items-center justify-center pt-16 pb-4 gap-8'>
      <header className='flex flex-col items-center gap-4'>
        <h1 className='text-2xl font-bold'>Welcome to the Finance App</h1>
        <p className='text-gray-500 dark:text-gray-400'>Login</p>
      </header>

      <section className='w-full max-w-sm'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md'
          >
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
                    <Input type='password' placeholder='••••••••' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full'
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
}
