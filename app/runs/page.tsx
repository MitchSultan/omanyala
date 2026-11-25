import react from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";

const Runs = () => {
    return (
        <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Runs</h1>
            <p className="text-lg text-center max-w-2xl">
                Welcome to the Runs page! Here you can find information about our running events, training programs, and community initiatives. Join us in promoting a healthy lifestyle and connecting with fellow runners.
            </p>
        </div>
        <Footer />
      </>);
}   

export default Runs;