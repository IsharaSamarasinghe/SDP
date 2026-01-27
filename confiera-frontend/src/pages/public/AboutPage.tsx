import { Header } from "../../components/navigation/Header";
import { Footer } from "../../components/navigation/Footer";
import { Card, CardContent } from "../../components/ui/card";
import { Users, Target, Award, Lightbulb } from "lucide-react";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To provide a comprehensive, user-friendly platform for managing academic conferences, enabling seamless collaboration between organizers, authors, evaluators, and participants."
    },
    {
      icon: Users,
      title: "Who We Serve",
      description: "Academic institutions, conference organizers, researchers, students, and evaluators across various disciplines seeking efficient conference management solutions."
    },
    {
      icon: Award,
      title: "Excellence in Service",
      description: "Developed by the University of Kelaniya, we ensure high-quality service with robust features including paper submissions, peer review, registration management, and payment processing."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Leveraging modern technology to streamline conference operations, from multi-step registrations to automated ticket generation with QR codes and comprehensive reporting."
    }
  ];

  const stats = [
    { value: "500+", label: "Conferences Managed" },
    { value: "10,000+", label: "Active Users" },
    { value: "50+", label: "Universities Served" },
    { value: "99.9%", label: "System Uptime" }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFFFF' }}>
      <Header onNavigate={onNavigate} currentPage="about" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #4B0101 0%, #660000 100%)' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-6" style={{ color: '#FFFFFF' }}>About Confiera</h1>
              <p className="text-lg leading-relaxed" style={{ color: '#E0E0E0' }}>
                Confiera is a state-of-the-art platform developed by the University of Kelaniya, Sri Lanka. 
                Our platform empowers academic institutions and researchers with cutting-edge tools for organizing and participating in conferences worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12" style={{ background: '#F5F5F5' }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2" style={{ fontSize: '2.5rem', fontWeight: 600, color: '#4B0101' }}>
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4 text-primary">What Makes Us Different</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Confiera combines powerful features with an intuitive interface to deliver an exceptional conference management experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: '#4B0101' }}>
                      <feature.icon className="w-6 h-6" style={{ color: '#F5C518' }} />
                    </div>
                    <h3 className="mb-3 text-primary">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team/University Section */}
        <section className="py-20" style={{ background: '#F5F5F5' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="mb-4 text-primary">Powered by University of Kelaniya</h2>
                <p className="text-muted-foreground">
                  Established in 1959, the University of Kelaniya is one of Sri Lanka's leading institutions of higher education.
                </p>
              </div>

              <Card>
                <CardContent className="p-8">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The University of Kelaniya has a rich tradition of academic excellence and innovation. With over 60 years of experience 
                      in higher education, we are committed to advancing knowledge and fostering research across diverse fields.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Confiera is a digital initiative developed to support the global academic community. It reflects our commitment to 
                      leveraging technology for educational advancement and facilitating knowledge sharing on an international scale.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Our team of experienced developers, researchers, and academic professionals work continuously to enhance the platform, 
                      ensuring it meets the evolving needs of modern conference management.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="mb-4 text-primary">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of researchers and institutions using Confiera for their conference management needs.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => onNavigate("conferences")}
                  className="px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                  style={{ background: '#4B0101', color: '#FFFFFF' }}
                >
                  Browse Conferences
                </button>
                <button
                  onClick={() => onNavigate("contact")}
                  className="px-8 py-3 rounded-lg transition-all border-2"
                  style={{ borderColor: '#4B0101', color: '#4B0101', background: 'transparent' }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
