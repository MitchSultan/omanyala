import React from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Found } from "@/components/sections/Found";
import { PreviousRuns } from "@/components/sections/PreviousRuns";
import {MissionVision} from "@/components/sections/MissionVision";

import { Partners } from "@/components/sections/Partners";
import { Banner } from "@/components/sections/Banner";
import { FinalCta } from "@/components/sections/FinalCta";
import { Products } from "@/components/sections/Products";
import { SocialMedia } from "@/components/sections/SocialMedia";
import { Navbar } from "@/components/Navbar";  
import { Footer } from "@/components/sections/Footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero/>
            <About/>
            <Found/>
            <MissionVision/>
            <PreviousRuns/>
            <Partners/>
            <Products/>
            <SocialMedia/>
            <Banner/>
            <FinalCta/>
            <Footer/>

        
        </>)}