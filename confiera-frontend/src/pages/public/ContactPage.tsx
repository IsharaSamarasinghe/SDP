import { Header } from "../../components/navigation/Header";
import { Footer } from "../../components/navigation/Footer";
import { Card, CardContent } from "../../components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: [
        "University of Kelaniya",
        "No. 218, Kandy Road",
        "Dalugama, Kelaniya 11600",
        "Sri Lanka"
      ]
    },
    {
      icon: Phone,
      title: "Phone",
      details: [
        "+94 112 903 903",
        "Monday - Friday: 8:00 AM - 4:30 PM"
      ]
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "oneuok@kln.ac.lk",
        "General inquiries & support"
      ]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 8:00 AM - 4:30 PM",
        "Closed on weekends and public holidays"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFFFF' }}>
      <Header onNavigate={onNavigate} currentPage="contact" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16" style={{ background: 'linear-gradient(135deg, #4B0101 0%, #660000 100%)' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-4" style={{ color: '#FFFFFF' }}>Get in Touch</h1>
              <p className="text-lg" style={{ color: '#E0E0E0' }}>
                Have questions? We're here to help. Reach out to our team and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12" style={{ background: '#F5F5F5' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#4B0101' }}>
                        <info.icon className="w-6 h-6" style={{ color: '#F5C518' }} />
                      </div>
                      <h3 className="mb-3 text-primary">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
