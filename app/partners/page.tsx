import react from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";

const Partners = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Partners</h1>
        <p className="text-lg text-center max-w-2xl">
          Welcome to the Partners page! Here you can find information about our partner organizations, collaboration opportunities, and joint initiatives. Join us in building a stronger community and making a positive impact together.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Partners;