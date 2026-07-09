import { hotels } from "@/lib/mockData";

export function generateStaticParams() {
  return hotels.map((hotel) => ({
    id: hotel.id.toString(),
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
