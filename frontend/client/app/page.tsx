import Image from "next/image";
import { BookingWidget } from "@/components/forms/BookingWidget";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { Star } from "lucide-react";
import { VehicleSelectionSection } from "@/components/sections/VehicleSelectionSection";
import { MobileHeroActions } from "@/components/sections/MobileHeroActions";
import { SectionWatermark } from '@/components/decorative/SectionWatermark';
import { MapContourPattern } from '@/components/decorative/MapContourPattern';
import { TempleArch } from '@/components/decorative/TempleArch';
import { AmbientGlow } from '@/components/decorative/AmbientGlow';
import { CoordinateLabel } from '@/components/decorative/CoordinateLabel';
import { SectionDivider } from '@/components/decorative/SectionDivider';

export default function Home() {
  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Desktop Hero Section */}
      <section className="hidden md:flex relative -mt-20 pt-20 px-6 min-h-[600px] h-[100dvh] items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.webp"
            alt="Udan Cabs Hero"
            fill
            className="object-cover object-right"
            priority
            quality={100}
            sizes="100vw"
          />
          {/* Subtle warm amber glow near the temple */}
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none" />
          {/* Gradients to blend image into background and ensure text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(5, 5, 5, 0.96) 0%, rgba(5, 5, 5, 0.82) 36%, rgba(5, 5, 5, 0.4) 65%, rgba(5, 5, 5, 0.2) 100%)'
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto max-w-[1300px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="flex flex-col items-start gap-4 z-10 col-span-1 lg:col-span-7 xl:col-span-6">
            <div className="uppercase text-[12px] md:text-[13px] font-bold tracking-widest text-[#d97757]">
              UJJAIN’S TRUSTED LOCAL CAB
            </div>
            <h1 className="hero-title text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] font-extrabold tracking-tight text-[#f8f8f8] leading-[1.05] max-w-[580px]">
              Ride with the <br />
              <span className="text-primary">Blessings</span> of Mahakal.
            </h1>
            <p className="hero-description text-[15px] md:text-base text-muted-foreground max-w-[500px] leading-relaxed font-normal">
              Trusted local cabs for darshan, airport transfers and comfortable journeys across Ujjain.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2 w-full sm:w-auto">
              <button className="h-12 px-6 lg:px-8 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 w-full sm:w-auto">
                Book Your Ride
              </button>
              <button className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group p-2">
                Explore Darshan Tours
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 w-full max-w-lg text-[13px] text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                Verified Drivers
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                Transparent Fares
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                24/7 Local Support
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end z-10 relative col-span-1 lg:col-span-5 xl:col-span-6 w-full">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* Mobile Hero Section */}
      <section className="mobile-hero md:hidden">
        <picture className="absolute inset-0 z-0 w-full h-full" aria-hidden="true">
          <img src="/images/hero/ujjain-mobile-hero.webp" alt="" className="w-full h-full object-cover object-center" />
        </picture>
        <div className="mobile-hero__overlay" aria-hidden="true" />

        <div className="mobile-hero__content relative z-10 w-full">
          <span className="mobile-hero__eyebrow">
            UJJAIN’S TRUSTED LOCAL CAB
          </span>

          <h1 className="mobile-hero__title">
            Ride with the
            <span>Blessings</span>
            of Mahakal.
          </h1>

          <p className="mobile-hero__description">
            Trusted local rides for darshan, airport transfers and
            comfortable journeys across Ujjain.
          </p>

          <MobileHeroActions />

          <div className="mobile-hero__trust">
            <span>Verified Drivers</span>
            <span>Transparent Fares</span>
            <span>24/7 Local Support</span>
          </div>
        </div>
      </section>

      <VehicleSelectionSection />

      {/* Services Section */}
      <section id="services" className="decorative-section services-section padding-section">
        <div className="section-container container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-primary font-semibold text-sm mb-3 tracking-widest uppercase">Our Services</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">More than just a ride.</h2>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm">
              Tailored mobility solutions combining modern tech with traditional hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ServiceCard
              title="City Cabs"
              imageSrc="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80"
              href="#"
              wide
            />
            <div className="grid grid-cols-1 gap-6 col-span-1 md:col-span-2">
              <div className="grid grid-cols-2 gap-6 h-full">
                <ServiceCard
                  title="Bike Rentals"
                  imageSrc="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80"
                  href="#"
                />
                <ServiceCard
                  title="Airport Transfers"
                  imageSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80"
                  href="#"
                />
              </div>
              <ServiceCard
                title="Pilgrimage Packages"
                imageSrc="https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80"
                href="#"
                className="aspect-auto h-[180px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="destinations-section decorative-section padding-section bg-zinc-950/50">
        <SectionWatermark text="UJJAIN" align="left" />
        <MapContourPattern />
        <AmbientGlow variant="saffron" className="bottom-0 left-0 translate-y-1/3 -translate-x-1/3" />
        <CoordinateLabel text={"23.1765° N · 75.7885° E\nUJJAIN, MADHYA PRADESH"} className="top-12 right-12" />
        
        <div className="section-container container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-primary font-semibold text-sm mb-3 tracking-widest uppercase">Popular Routes</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Divine Destinations.</h2>
            </div>
          </div>

          <div className="mobile-carousel grid grid-cols-1 md:grid-cols-3 gap-6">
            <DestinationCard
              title="Mahakaleshwar Temple"
              imageSrc="https://images.unsplash.com/photo-1707056461996-03e87fbdb04b?auto=format&fit=crop&q=80"
              time="15 min"
              distance="5 km"
              price="₹150"
              href="#"
            />
            <DestinationCard
              title="Ram Ghat (Shipra)"
              imageSrc="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80"
              time="20 min"
              distance="7 km"
              price="₹200"
              href="#"
            />
            <DestinationCard
              title="Kal Bhairav Temple"
              imageSrc="https://images.unsplash.com/photo-1695627255883-8a30ccbd9cc5?auto=format&fit=crop&q=80"
              time="25 min"
              distance="10 km"
              price="₹300"
              href="#"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="decorative-section padding-section bg-background">
        <SectionDivider className="absolute top-0 w-full" />
        <TempleArch />
        <AmbientGlow variant="saffron" className="hidden md:block top-1/2 right-0 -translate-y-1/2 translate-x-1/4" />
        <CoordinateLabel text={"LOCAL EXPERTS · UJJAIN · 24/7"} className="hidden md:block top-12 left-12" />

        <div className="section-container container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <p className="text-primary font-semibold text-sm mb-3 tracking-widest uppercase">The Udancab Standard</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-8">
              Beyond Transportation.<br /> A Spiritual Connection.
            </h2>
            <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
              We don't just drive you from point A to point B. We curate an experience that honors the sanctity of Ujjain while delivering world-class mobility standards.
            </p>

            <div className="story-stats md:flex md:gap-16 border-t border-border/40 pt-10">
              <div>
                <p className="stat-value text-4xl font-bold text-foreground mb-2">99<span className="text-primary">%</span></p>
                <p className="stat-label text-sm text-muted-foreground uppercase tracking-wider font-semibold">On Time</p>
              </div>
              <div>
                <p className="stat-value text-4xl font-bold text-foreground mb-2">24<span className="text-primary">/7</span></p>
                <p className="stat-label text-sm text-muted-foreground uppercase tracking-wider font-semibold">Live Support</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/50">
              <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80" alt="Chauffeur" className="object-cover w-full h-full grayscale" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Verified Local Experts</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Our chauffeurs are not just drivers; they are local guides familiar with the history, timings, and traditions of every temple in Ujjain. Polite, verified, and deeply respectful.
              </p>
            </div>

            <div className="story-card relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border/50 bg-secondary/50 flex items-center justify-center">
              {/* Icon placeholder for Pristine Fleet */}
              <svg className="w-12 h-12 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Pristine Fleet</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                From comfortable sedans to spacious SUVs and nimble two-wheelers, every vehicle in our fleet undergoes daily cleaning and strict maintenance checks.
              </p>
            </div>

            <div className="testimonial-card p-8 rounded-3xl bg-secondary/50 border border-border/50 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-6xl text-primary/20 font-serif leading-none">"</div>
              <p className="text-foreground relative z-10 font-medium italic text-lg leading-relaxed mb-6 pl-4">
                "The best cab service in Ujjain. The driver knew exactly when to visit Omkareshwar to avoid the rush. Extremely premium and polite service."
              </p>
              <div className="flex items-center gap-4 pl-4">
                <div className="w-10 h-10 rounded-full bg-primary/20" />
                <div>
                  <p className="font-bold text-sm text-foreground">Rahul Sharma</p>
                  <p className="text-xs text-muted-foreground">Visited from Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
