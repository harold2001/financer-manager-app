import { Outlet } from 'react-router';
import { Navbar } from '~/components/navbar';

export function DashboardLayout() {
  const navLinks = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Transactions', href: '/transactions' },
    { label: 'Reports', href: '/reports' },
  ];

  return (
    <div className='min-h-screen bg-background'>
      <Navbar links={navLinks} />
      <main className='container mx-auto px-4 py-8'>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
