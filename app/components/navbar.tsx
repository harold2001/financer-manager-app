import React from 'react';
import { Link, useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { LogOut, User, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '~/store/useAuthStore';
import { auth } from '~/lib/firebase';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface NavbarProps {
  links?: NavLink[];
  className?: string;
}

export function Navbar({ links = [], className }: NavbarProps) {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Error logging out: ' + error.message);
    }
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const NavLinks = () => (
    <>
      {links.map(link => (
        <Link
          key={link.href}
          to={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        className || ''
      }`}
    >
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo/Brand */}
          <Link to='/dashboard' className='flex items-center space-x-2'>
            <span className='text-xl font-bold text-foreground'>
              FinanceApp
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className='hidden md:flex items-center space-x-6'>
            <NavLinks />
          </div>

          {/* User Menu */}
          <div className='flex items-center space-x-4'>
            {/* Desktop User Menu */}
            <div className='hidden md:block'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='flex items-center space-x-2'
                  >
                    <User className='h-4 w-4' />
                    <span className='text-sm font-medium'>
                      {getUserDisplayName()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <div className='flex flex-col space-y-1 p-2'>
                    <p className='text-sm font-medium leading-none'>
                      {getUserDisplayName()}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to='/profile'>Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to='/dashboard'>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className='text-red-600'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className='md:hidden'>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <Menu className='h-5 w-5' />
                    <span className='sr-only'>Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
                  <div className='flex flex-col space-y-4 mt-4'>
                    {/* User Info */}
                    <div className='flex items-center space-x-3 p-4 bg-muted rounded-lg'>
                      <div className='flex-shrink-0'>
                        <div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center'>
                          <User className='h-5 w-5 text-primary-foreground' />
                        </div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-foreground truncate'>
                          {getUserDisplayName()}
                        </p>
                        <p className='text-xs text-muted-foreground truncate'>
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    {/* Navigation Links */}
                    {links.length > 0 && (
                      <div className='space-y-2'>
                        <h3 className='text-sm font-medium text-muted-foreground px-2'>
                          Navigation
                        </h3>
                        <div className='space-y-1'>
                          {links.map(link => (
                            <Link
                              key={link.href}
                              to={link.href}
                              target={link.external ? '_blank' : undefined}
                              rel={
                                link.external
                                  ? 'noopener noreferrer'
                                  : undefined
                              }
                              className='block px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors'
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Action Buttons */}
                    <div className='space-y-2 pt-4 border-t'>
                      <Button
                        variant='outline'
                        className='w-full justify-start'
                        asChild
                      >
                        <Link
                          to='/profile'
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className='mr-2 h-4 w-4' />
                          Profile Settings
                        </Link>
                      </Button>
                      <Button
                        variant='outline'
                        className='w-full justify-start'
                        asChild
                      >
                        <Link
                          to='/dashboard'
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant='destructive'
                        className='w-full justify-start'
                        onClick={handleLogout}
                      >
                        <LogOut className='mr-2 h-4 w-4' />
                        Log out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
