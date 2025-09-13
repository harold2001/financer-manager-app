import { useMutation } from '@tanstack/react-query';
import { auth } from '~/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { FirebaseError } from 'firebase/app';

const useUser = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      return userCredential.user;
    },
    onError: (error: FirebaseError) => {
      toast.error(
        error.code === 'auth/invalid-credential'
          ? 'Invalid credentials'
          : `Error logging in: ${error.message}`
      );
    },
    onSuccess: user => {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      return userCredential.user;
    },
    onError: (error: FirebaseError) => {
      let errorMessage = 'Error creating account';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
    onSuccess: user => {
      toast.success('Account created successfully! Welcome!');
      navigate('/dashboard');
    },
  });

  return {
    loginMutation,
    registerMutation,
  };
};

export default useUser;
