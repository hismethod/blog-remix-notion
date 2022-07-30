import { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col justify-center px-8">
      <Header />
      <main className="pt-10">{children}</main>
      <Footer />
    </div>
  );
}

function Content({ children }: { children: ReactNode }) {
  return <main className="mt-72">{children}</main>;
}
