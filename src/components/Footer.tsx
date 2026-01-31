import { Link } from 'react-router-dom';
import { Mic } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Mic className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">ORATORA</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Master the pause. Control the room. ORATORA analyzes what happens between words 
              and beyond voice to help you become a confident speaker.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/speaking-test" className="text-muted-foreground hover:text-foreground transition-colors">
                  Speaking Test
                </Link>
              </li>
              <li>
                <Link to="/test-history" className="text-muted-foreground hover:text-foreground transition-colors">
                  Test History
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Learning Hub
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ORATORA. Built for speakers who demand excellence.
          </p>
          <p className="text-muted-foreground text-sm">
            Hackathon Project 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
