import { Bot, LogOut } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router";
import GlassSurface from "@repo/ui/components/GlassSurface";
interface NavItem {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

const navItems: NavItem[] = [
  // { href: "/todos", icon: Calendar, label: "Calendar" },
];

export default function Navbar() {
  const { user, logout } = useAuth0();

  return (
    <GlassSurface
      width="100%"
      opacity={0.8}
      blur={0}
      displace={5}
      borderRadius={50}
      className="shadow-lg"
    >
      <nav className="w-full bg-transparent px-2 md:px-4 rounded-full">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">Taskmate AI</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white hidden sm:inline">{user.name}</span>
              </div>
            )}
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </GlassSurface>
  );
}
