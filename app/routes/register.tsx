'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { UserPlus, ArrowLeft } from 'lucide-react';
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
import { registerSchema } from '~/lib/schemas';
import useUser from '~/hooks/useUser';

type RegisterFormValues = z.infer<typeof registerSchema>;

export function meta({}) {
  return [
    { title: 'Register - Finance App' },
    { name: 'description', content: 'Create your Finance App account' },
  ];
}

export default function Register() {
  const { registerMutation } = useUser();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    const { confirmPassword, ...registrationData } = values;
    await registerMutation.mutateAsync(registrationData);
  }

  return (
    <main className='min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='w-full max-w-md space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <UserPlus className='h-8 w-8 text-blue-600' />
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Create Account
            </h1>
          </div>
          <p className='text-gray-600 dark:text-gray-400'>
            Join thousands managing their finances with ease
          </p>
        </div>

        {/* Registration Form */}
        <Card className='p-8 shadow-lg'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* Name Fields */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder='John' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Field */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
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

              {/* Password Fields */}
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

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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

              {/* Submit Button */}
              <Button
                type='submit'
                className='w-full mt-6'
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Creating Account...
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <UserPlus className='h-4 w-4' />
                    Create Account
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </Card>

        {/* Login Link */}
        <div className='text-center space-y-4'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Already have an account?{' '}
            <Link
              to='/'
              className='text-blue-600 hover:text-blue-700 font-medium hover:underline'
            >
              Sign in here
            </Link>
          </p>

          <Link
            to='/'
            className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Login
          </Link>
        </div>

        {/* Features */}
        <div className='mt-8 p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm'>
          <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>
            What you'll get:
          </h3>
          <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
            <li>• Complete transaction management</li>
            <li>• Detailed financial reports and insights</li>
            <li>• Secure cloud storage with Firebase</li>
            <li>• Mobile-responsive design</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
