import {Header} from "../../components/navigation/Header";
import {Footer} from "../../components/navigation/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-semibold text-[#4B0101] mb-4">Terms of Service</h1>
          <p className="text-[#737373] leading-relaxed">
            This page will contain Confiera terms and conditions.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
