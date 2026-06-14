import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import BuiltHonest from "@/components/BuiltHonest";
import Dashboard from "@/components/Dashboard";
import OpenSource from "@/components/OpenSource";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <BuiltHonest />
        <Dashboard />
        <OpenSource />
      </main>
      <Footer />
    </>
  );
}
