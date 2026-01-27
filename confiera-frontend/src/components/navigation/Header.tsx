import { Button } from "../ui/button";
import uokLogo from "../../assets/uok-logo.png"; 

interface HeaderProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const navItems = ["Home", "About", "Conferences", "Contact"];

  return (
    <header className="border-b sticky top-0 z-50 shadow-lg" style={{ background: '#4B0101', borderColor: '#660000' }}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* University Logo and Confiera Branding */}
          <div 
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => onNavigate?.("home")}
          >
            {/* University of Kelaniya Logo */}
            <div className="flex items-center gap-3 pr-4 border-r" style={{ borderColor: '#660000' }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden shadow-md" style={{ background: '#FFFFFF' }}>
                <img src={uokLogo} alt="University of Kelaniya" className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:block">
                <div className="text-xs" style={{ color: '#E0E0E0' }}>University of</div>
                <div className="text-sm" style={{ fontWeight: 600, color: '#F5C518' }}>Kelaniya</div>
              </div>
            </div>
            {/* Confiera Logo */}
            <div>
              <div className="tracking-wide" style={{ fontWeight: 600, fontSize: '1.25rem', color: '#FFFFFF' }}>
                Confiera
              </div>
              <div className="text-xs hidden sm:block" style={{ color: '#E0E0E0' }}>University of Kelaniya</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavigate?.(item.toLowerCase())}
                className={`transition-colors text-sm ${
                  currentPage === item.toLowerCase()
                    ? ""
                    : "hover:text-[#FFD740]"
                }`}
                style={{ 
                  fontWeight: currentPage === item.toLowerCase() ? 500 : 400,
                  color: currentPage === item.toLowerCase() ? '#F5C518' : '#FFFFFF'
                }}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => onNavigate?.("login")}
              className="transition-all"
              style={{ 
                borderColor: '#F5C518', 
                color: '#F5C518',
                background: 'transparent'
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => onNavigate?.("register")}
              className="transition-all shadow-md"
              style={{ 
                background: '#F5C518', 
                color: '#000000'
              }}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
