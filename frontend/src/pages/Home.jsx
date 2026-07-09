import MainLayout from "../components/layout/MainLayout";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import AIPreview from "../components/home/AIPreview";
import ChatPreview from "../components/home/ChatPreview";
import CTA from "../components/home/CTA";

function Home() {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <AIPreview />
      <ChatPreview />
      <CTA />
    </MainLayout>
  );
}

export default Home;