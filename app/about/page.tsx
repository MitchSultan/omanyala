import react from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";

const About = () => {
  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-center max-w-2xl">
            Welcome to our application! We are dedicated to providing the best user experience and continuously improving our services. Our team is passionate about technology and innovation, and we strive to create solutions that make a difference in people's lives.
        </p>
    </div>
    <Footer />
  </>);
}

export default About;