import { create } from 'zustand';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '~/lib/firebase';

type AuthState = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  loading: true,
  setUser: user => set({ user }),
  setLoading: loading => set({ loading }),
}));

export function initAuthListener() {
  const { setUser, setLoading } = useAuthStore.getState();

  onAuthStateChanged(auth, firebaseUser => {
    setUser(firebaseUser);
    setLoading(false);
  });
}
