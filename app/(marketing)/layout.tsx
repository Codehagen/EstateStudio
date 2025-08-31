import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeroHeader />
      {children}
      <FooterSection />
    </>
  );
}
