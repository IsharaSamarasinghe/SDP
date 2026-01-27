import { Header } from "../../components/navigation/Header";
import { Footer } from "../../components/navigation/Footer";
import { ConferenceCard } from "../../components/ConferenceCard";
import { Badge } from "../../components/ui/badge";
import { Calendar, Search } from "lucide-react";

interface ConferencesPageProps {

  onNavigate: (page: string) => void;
}

export function ConferencesPage({ onNavigate }: ConferencesPageProps) {
  const conferences = [
    {
      id: 1,
      title: "SCSE 2025 – Smart Computing for Sustainable Energy",
      venue: "University of Kelaniya, Sri Lanka",
      dates: "March 25-27, 2025",
      description:
        "Exploring cutting-edge research in smart computing technologies for sustainable energy solutions. Join researchers worldwide to discuss AI, IoT, and renewable energy integration.",
      ieeeLink: "https://ieeexplore.ieee.org",
      status: "upcoming" as const,
      category: "Computer Science",
      deadline: "February 28, 2025",
      cmtLink: "https://cmt3.research.microsoft.com/SCSE2025",
      paperTemplateLink: "https://www.ieee.org/conferences/publishing/templates.html",
      guidelinesLink: "#"
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
      category: "Multidisciplinary",
      deadline: "March 15, 2025",
      cmtLink: "https://cmt3.research.microsoft.com/ICAPS2025",
      paperTemplateLink: "https://www.ieee.org/conferences/publishing/templates.html",
      guidelinesLink: "#"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFFFF' }}>
      <Header onNavigate={onNavigate} currentPage="conferences" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16" style={{ background: 'linear-gradient(135deg, #4B0101 0%, #660000 100%)' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-4" style={{ color: '#FFFFFF' }}>Explore Conferences</h1>
              <p className="text-lg" style={{ color: '#E0E0E0' }}>
                Discover and register for academic conferences hosted by the University of Kelaniya and partner institutions
              </p>
            </div>
          </div>
        </section>

        {/* Conferences List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-primary">
                    All Conferences
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {conferences.length} {conferences.length === 1 ? 'conference' : 'conferences'} found
                  </p>
                </div>
              </div>

              {conferences.length > 0 ? (
                <div className="grid gap-8">
                  {conferences.map((conference) => (
                    <div key={conference.id} className="mb-4">
                      <ConferenceCard
                        title={conference.title}
                        venue={conference.venue}
                        dates={conference.dates}
                        description={conference.description}
                        ieeeLink={conference.ieeeLink}
                        status={conference.status}
                        onRegister={() => onNavigate("register")}
                        onViewDetails={() => onNavigate("conferences")}
                        cmtLink={conference.cmtLink}
                        paperTemplateLink={conference.paperTemplateLink}
                        guidelinesLink={conference.guidelinesLink}
                      />
                      <div className="mt-3 flex items-center gap-4 px-4">
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="w-3 h-3" />
                          Deadline: {conference.deadline}
                        </Badge>
                        <Badge variant="secondary">
                          {conference.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#F5F5F5' }}>
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-muted-foreground">No conferences found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
