import Link from "next/link";
import Image from "next/image";
import { RoutePattern } from '@/components/decorative/RoutePattern';
import { CoordinateLabel } from '@/components/decorative/CoordinateLabel';
import { SectionDivider } from '@/components/decorative/SectionDivider';

export function Footer() {
  return (
    <footer className="footer decorative-section relative overflow-hidden bg-background pt-12 md:pt-24 pb-6 md:pb-12">
      <SectionDivider className="absolute top-0 w-full" />
      <RoutePattern />
      <CoordinateLabel text={"UJJAIN · MADHYA PRADESH\nLOCAL RIDES · AIRPORT · DARSHAN"} className="hidden md:block top-12 left-12" />

      {/* Massive faded background text */}
      <div className="absolute inset-x-0 bottom-0 z-0 flex items-end justify-center overflow-hidden opacity-5 pointer-events-none select-none">
        <span className="section-watermark text-[20vw] font-bold tracking-tighter text-foreground leading-none">
          UDAN
        </span>
      </div>

      <div className="section-container container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="footer-logo inline-block mb-6">
              <Image
                src="/logo.png"
                alt="Udan Cabs"
                width={160}
                height={48}
                className="h-12 w-auto grayscale brightness-200 dark:grayscale-0 dark:brightness-100"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Elevating the travel experience in Ujjain. Connecting spirituality with modern, reliable mobility.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cab Booking</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Bike Rentals</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Spiritual Tours</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Corporate Travel</Link></li>
            </ul>
          </div>
          <details className="md:hidden group border-b border-border/20 pb-2">
            <summary className="text-sm font-semibold text-foreground flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              Quick Links
              <span className="transition-transform group-open:rotate-45 text-lg">+</span>
            </summary>
            <ul className="space-y-3 pt-4 pb-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cab Booking</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Bike Rentals</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Spiritual Tours</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Corporate Travel</Link></li>
            </ul>
          </details>

          <div className="hidden md:block">
            <h4 className="text-sm font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQs</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <details className="md:hidden group border-b border-border/20 pb-2">
            <summary className="text-sm font-semibold text-foreground flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              Support
              <span className="transition-transform group-open:rotate-45 text-lg">+</span>
            </summary>
            <ul className="space-y-3 pt-4 pb-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQs</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </details>

        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/40 text-xs text-muted-foreground">
          <p>© 2024 Udancab. Designed for the city of Mahakal.</p>
          <p className="mt-4 md:mt-0">Crafted with precision.</p>
        </div>
      </div>
    </footer>
  );
}
