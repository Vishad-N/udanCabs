import Image from "next/image";
import { BookingWidget } from "@/components/forms/BookingWidget";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-32 px-6 min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Udan Cabs Hero"
            fill
            className="object-cover object-right"
            priority
            quality={100}
            sizes="100vw"
          />
          {/* Gradients to blend image into background and ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start gap-8 z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              UJJAIN'S #1 CAB SERVICE
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Ride with the <br />
              <span className="text-primary">Blessings</span> <br />
              of Mahakal.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Premium cab booking, bike rentals, airport transfers, and spiritual journeys across Ujjain—all in one seamless experience.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <button className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30">
                Book Your Ride
              </button>
              <button className="h-14 px-8 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all border border-border/50 text-sm">
                Explore Spiritual Tours &rarr;
              </button>
            </div>

            <div className="flex items-center gap-12 mt-12 pt-12 border-t border-border/40 w-full max-w-lg">
              <div>
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                </div>
                <p className="text-sm font-semibold text-foreground">4.9/5 Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">10k+</p>
                <p className="text-sm text-muted-foreground">Happy Riders</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Spiritual Rescue</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end z-10 relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 relative z-10">
        <div className="container mx-auto">
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
      <section id="destinations" className="px-6 relative z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-primary font-semibold text-sm mb-3 tracking-widest uppercase">Popular Routes</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Divine Destinations.</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <section className="px-6 relative z-10 border-t border-border/40 pt-32">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <p className="text-primary font-semibold text-sm mb-3 tracking-widest uppercase">The Udancab Standard</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-8">
              Beyond Transportation.<br/> A Spiritual Connection.
            </h2>
            <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
              We don't just drive you from point A to point B. We curate an experience that honors the sanctity of Ujjain while delivering world-class mobility standards.
            </p>
            
            <div className="flex gap-16 border-t border-border/40 pt-10">
              <div>
                <p className="text-4xl font-bold text-foreground mb-2">99<span className="text-primary">%</span></p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">On Time</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-foreground mb-2">24<span className="text-primary">/7</span></p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Live Support</p>
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
            
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border/50 bg-secondary/50 flex items-center justify-center">
               {/* Icon placeholder for Pristine Fleet */}
               <svg className="w-12 h-12 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Pristine Fleet</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                From comfortable sedans to spacious SUVs and nimble two-wheelers, every vehicle in our fleet undergoes daily cleaning and strict maintenance checks.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-secondary/50 border border-border/50 relative overflow-hidden">
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
