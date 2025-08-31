"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface SiteHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

const getPageTitle = (pathname: string): { title: string; breadcrumbs?: Array<{ label: string; href?: string }> } => {
  // Remove trailing slash and split path
  const cleanPath = pathname.replace(/\/$/, '');
  const segments = cleanPath.split('/').filter(Boolean);
  
  if (cleanPath === '/dashboard' || segments.length === 1) {
    return { title: "Oversikt" };
  }
  
  if (segments[1] === 'editor') {
    if (segments.length === 2) {
      return { 
        title: "Rediger nytt bilde",
        breadcrumbs: [
          { label: "Oversikt", href: "/dashboard" },
          { label: "Rediger nytt bilde" }
        ]
      };
    } else if (segments.length === 3) {
      return { 
        title: "Rediger eiendom",
        breadcrumbs: [
          { label: "Oversikt", href: "/dashboard" },
          { label: "Eiendommer", href: "/dashboard/projects" },
          { label: "Rediger eiendom" }
        ]
      };
    }
  }
  
  if (segments[1] === 'projects') {
    return { 
      title: "Eiendommer",
      breadcrumbs: [
        { label: "Oversikt", href: "/dashboard" },
        { label: "Eiendommer" }
      ]
    };
  }
  
  if (segments[1] === 'history') {
    return { 
      title: "Historikk",
      breadcrumbs: [
        { label: "Oversikt", href: "/dashboard" },
        { label: "Historikk" }
      ]
    };
  }
  
  if (segments[1] === 'settings') {
    return { 
      title: "Innstillinger",
      breadcrumbs: [
        { label: "Oversikt", href: "/dashboard" },
        { label: "Innstillinger" }
      ]
    };
  }
  
  if (segments[1] === 'help') {
    return { 
      title: "Få hjelp",
      breadcrumbs: [
        { label: "Oversikt", href: "/dashboard" },
        { label: "Få hjelp" }
      ]
    };
  }
  
  // Default fallback
  return { title: "Dashboard" };
};

export function SiteHeader({ 
  title, 
  subtitle,
  breadcrumbs,
  actions 
}: SiteHeaderProps) {
  const pathname = usePathname();
  const pageInfo = getPageTitle(pathname);
  
  const displayTitle = title || pageInfo.title;
  const displayBreadcrumbs = breadcrumbs || pageInfo.breadcrumbs;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        <div className="flex items-center gap-1">
          {displayBreadcrumbs && displayBreadcrumbs.length > 1 ? (
            <nav className="flex items-center gap-1 text-sm">
              {displayBreadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-1">
                  {crumb.href ? (
                    <Link 
                      href={crumb.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">{crumb.label}</span>
                  )}
                  {index < displayBreadcrumbs.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              ))}
            </nav>
          ) : (
            <h1 className="text-base font-medium">{displayTitle}</h1>
          )}
          
          {subtitle && (
            <span className="text-sm text-muted-foreground ml-2">{subtitle}</span>
          )}
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          {actions}
        </div>
      </div>
    </header>
  );
}