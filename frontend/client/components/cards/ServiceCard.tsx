import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  imageSrc: string;
  href: string;
  className?: string;
  wide?: boolean;
}

export function ServiceCard({ title, imageSrc, href, className, wide = false }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "service-card group relative block overflow-hidden rounded-3xl bg-card border border-border/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20",
        wide ? "md:col-span-2 aspect-[2/1]" : "col-span-1 aspect-square",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity duration-300" />
      
      <div className="absolute bottom-0 left-0 p-6 md:p-8">
        <h3 className="font-heading text-2xl font-bold text-white">
          {title}
        </h3>
      </div>
    </Link>
  );
}
