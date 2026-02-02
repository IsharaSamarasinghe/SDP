import { Header } from "../../components/navigation/Header";
import { Footer } from "../../components/navigation/Footer";
import { ConferenceCard } from "../../components/ConferenceCard";
import { Button } from "../../components/ui/button";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const conferences = [
    {
      id: 1,
      title: "SCSE 2025 – Smart Computing and Systems Engineering",
      venue: "University of Kelaniya, Sri Lanka",
      dates: "March 25-27, 2025",
      description:
        "Exploring cutting-edge research in smart computing technologies for sustainable energy solutions. Join researchers worldwide to discuss AI, IoT, and renewable energy integration.",
      ieeeLink: "https://ieeexplore.ieee.org",
      status: "upcoming" as const,
    },
    {
      id: 2,
      title: "ICAPS 2025 – International Conference on Applied & Pure Sciences",
      venue: "University of Kelaniya, Sri Lanka",
      dates: "April 15-18, 2025",
      description:
        "Premier international conference on applied and pure sciences. Featuring keynotes from leading researchers, workshops, and networking opportunities across multiple scientific disciplines.",
      ieeeLink: "https://ieeexplore.ieee.org",
      status: "upcoming" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAFA' }}>
      <Header onNavigate={onNavigate} currentPage="home" />

      {/* Hero Section */}
      <section className="relative text-white py-20 lg:py-28" style={{ background: 'linear-gradient(135deg, #4B0101 0%, #660000 50%, #4B0101 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTI0IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0xMiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="inline-block px-4 py-2 rounded-full text-sm border" style={{ background: 'rgba(245, 197, 24, 0.1)', borderColor: '#F5C518', color: '#F5C518' }}>
                University of Kelaniya
              </span>
            </div>
            <h1 className="mb-6 leading-tight" style={{ fontSize: "2.75rem", fontWeight: 600, color: '#FFFFFF' }}>
              Welcome to Confiera
            </h1>
            <p className="mb-4 text-xl" style={{ fontWeight: 500, color: '#F5C518' }}>
              Your Conference Platform
            </p>
            <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#E0E0E0' }}>
              Empowering researchers and students through seamless conference organization, registration, and collaboration.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                className="shadow-xl hover:shadow-2xl transition-all"
                style={{ background: '#F5C518', color: '#000000' }}
                onClick={() => onNavigate("conferences")}
              >
                Explore Conferences
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 transition-all"
                style={{ borderColor: '#F5C518', color: '#F5C518', background: 'transparent' }}
                onClick={() => onNavigate("register")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Conference Listings */}
      <section className="py-20" style={{ background: '#FFFFFF' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-3" style={{ color: '#4B0101' }}>Active Conferences</h2>
            <p className="max-w-2xl mx-auto" style={{ color: '#737373' }}>
              Discover and register for prestigious academic conferences hosted by the University of Kelaniya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {conferences.map((conference) => (
              <ConferenceCard
                key={conference.id}
                title={conference.title}
                venue={conference.venue}
                dates={conference.dates}
                description={conference.description}
                ieeeLink={conference.ieeeLink}
                status={conference.status}
                onViewDetails={() => onNavigate(`conference-${conference.id}`)}
                onRegister={() => onNavigate("participant-dashboard")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ background: '#F5F5F5' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-3" style={{ color: '#4B0101' }}>Why Choose Confiera?</h2>
            <p className="max-w-2xl mx-auto" style={{ color: '#737373' }}>
              Comprehensive tools for seamless conference management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-xl border hover:shadow-xl transition-all duration-300 text-center" style={{ background: '#FFFFFF', borderColor: '#E5E5E5' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245, 197, 24, 0.1)' }}>
                <svg
                  className="w-8 h-8"
                  style={{ color: '#F5C518' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2" style={{ color: '#4B0101' }}>Smart Registration</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#737373' }}>
                Dynamic form with automatic discount calculation, flexible payment options, and instant confirmation.
              </p>
            </div>

            <div className="p-8 rounded-xl border hover:shadow-xl transition-all duration-300 text-center" style={{ background: '#FFFFFF', borderColor: '#E5E5E5' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245, 197, 24, 0.1)' }}>
                <svg
                  className="w-8 h-8"
                  style={{ color: '#F5C518' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2" style={{ color: '#4B0101' }}>Complete Management</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#737373' }}>
                End-to-end tools for organizers, evaluators, and administrators with advanced reporting.
              </p>
            </div>

            <div className="p-8 rounded-xl border hover:shadow-xl transition-all duration-300 text-center" style={{ background: '#FFFFFF', borderColor: '#E5E5E5' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245, 197, 24, 0.1)' }}>
                <svg
                  className="w-8 h-8"
                  style={{ color: '#F5C518' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2" style={{ color: '#4B0101' }}>Multi-Currency Support</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#737373' }}>
                Supports both LKR and USD payments with dynamic currency display based on user location.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
