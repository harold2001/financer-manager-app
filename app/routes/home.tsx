import { Welcome } from '../welcome/welcome';

export function meta({}) {
  return [
    { title: 'Finance App' },
    { name: 'description', content: 'Welcome to the Finance App!' },
  ];
}

export default function Home() {
  return <Welcome />;
}
