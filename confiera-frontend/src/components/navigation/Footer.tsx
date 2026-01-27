import { Mail, Phone, MapPin } from "lucide-react";
import uokLogo from "../../assets/uok-logo.png"
interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-auto" style={{ background: '#1E1E1E', color: '#FFFFFF' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ background: '#FFFFFF' }}>
                <img src={uokLogo} alt="University of Kelaniya" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="tracking-wide" style={{ fontWeight: 600 }}>Confiera</div>
                <div className="text-sm" style={{ color: '#E0E0E0' }}>University of Kelaniya</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#E0E0E0' }}>
              University of Kelaniya, Sri Lanka. Developed as a digital initiative to empower researchers and students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4" style={{ fontWeight: 600, color: '#F5C518' }}>Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate?.("about")} 
                  className="transition-colors hover:text-[#F5C518]" 
                  style={{ color: '#E0E0E0' }}
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.("conferences")} 
                  className="transition-colors hover:text-[#F5C518]" 
                  style={{ color: '#E0E0E0' }}
                >
                  Conferences
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.("contact")} 
                  className="transition-colors hover:text-[#F5C518]" 
                  style={{ color: '#E0E0E0' }}
                >
                  Contact
                </button>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#F5C518]" style={{ color: '#E0E0E0' }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#F5C518]" style={{ color: '#E0E0E0' }}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="https://www.kln.ac.lk" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#F5C518]" style={{ color: '#E0E0E0' }}>
                  University Website
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4" style={{ fontWeight: 600, color: '#F5C518' }}>Contact Information</h4>
            <ul className="space-y-3 text-sm" style={{ color: '#E0E0E0' }}>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#F5C518' }} />
                <span>University of Kelaniya, No. 218, Kandy Road, Dalugama, Kelaniya 11600, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#F5C518' }} />
                <span>+94 112 903 903</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" style={{ color: '#F5C518' }} />
                <span>oneuok@kln.ac.lk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 text-center text-sm" style={{ borderTop: '1px solid #660000', color: '#E0E0E0' }}>
          <p className="mb-1">© 2025 University of Kelaniya | All Rights Reserved</p>
          <p className="text-xs">Developed as a digital initiative by the University of Kelaniya</p>
        </div>
      </div>
    </footer>
  );
}
