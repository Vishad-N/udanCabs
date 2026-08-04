import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  title: string;
  imageSrc: string;
  time: string;
  distance: string;
  price: string;
  href: string;
  className?: string;
}

export function DestinationCard({
  title,
  imageSrc,
  time,
  distance,
  price,
  href,
  className,
}: DestinationCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl bg-card border border-border/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
      </div>
      <div className="flex flex-col flex-1 p-6 z-10 -mt-12">
        <h3 className="font-heading text-xl font-bold text-foreground mb-4">
          {title}
        </h3>
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-auto mb-6">
          <div className="flex items-center gap-1 bg-background/50 backdrop-blur-md px-2 py-1 rounded-md border border-border/50">
             <span>{time}</span>
          </div>
          <div className="flex items-center gap-1 bg-background/50 backdrop-blur-md px-2 py-1 rounded-md border border-border/50">
             <span>{distance}</span>
          </div>
          <div className="flex items-center gap-1 bg-background/50 backdrop-blur-md px-2 py-1 rounded-md border border-border/50">
             <span>{price}</span>
          </div>
        </div>
        <button className="w-full py-3 text-sm font-semibold rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors border border-border/50">
          Book Ride
        </button>
      </div>
    </Link>
  );
}
