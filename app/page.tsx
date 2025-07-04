import GeneratedFlickerEffect from '@/components/m-wrapper';
import WaitlistSection from '@/components/waitlist-section';
import SystemOverview from '@/components/system-overview';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--vascular-navy)' }}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <GeneratedFlickerEffect />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: 'var(--calcium-ivory)' }}>
              Marrow
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--electric-cyan)' }}>
              starve the old machine
            </p>
          </div>
        </div>
      </section>

      {/* System Overview Section */}
      <SystemOverview />

      {/* Waitlist Section */}
      <WaitlistSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}