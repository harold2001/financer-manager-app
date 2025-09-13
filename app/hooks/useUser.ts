import { useMutation } from '@tanstack/react-query';
import { auth } from '~/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
      navigate('/dashboard');
    },
  });

  return {
    loginMutation,
  };
};

export default useUser;
