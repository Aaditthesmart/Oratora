import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Mic, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="navbar-glass fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Mic className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ORATORA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
              Resources
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                About
              </Link>
              <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Resources
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 py-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Button variant="ghost" onClick={handleSignOut} className="justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="hero" className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
