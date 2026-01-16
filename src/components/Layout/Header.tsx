import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Shield } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Apply", path: "/apply" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDiscordLogin = () => {
    try {
      const discordAuthUrl = 'https://discord.com/oauth2/authorize?client_id=1436396594214867115&response_type=code&redirect_uri=https%3A%2F%2Fsafhgt.onrender.com%2Fapi%2Fauth%2Fdiscord%2Fcallback&scope=identify';
      window.location.href = discordAuthUrl;
    } catch (err) {
      console.error('Discord login error:', err);
      alert(err instanceof Error ? err.message : 'Failed to initiate Discord login');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
            Fakepixel Giveaways
          </Link>
          
          <nav aria-label="Main navigation" className="flex-1 mx-8">
            <ul className="flex gap-1" role="list">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                        ${isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {(user.role === 'main_admin' || user.role === 'owner') && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm font-medium">{user.username}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button size="sm" onClick={handleDiscordLogin}>
                Login with Discord
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
