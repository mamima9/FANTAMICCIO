import Navbar from "@/components/layout/Navbar";

import Hero from "@/components/home/Hero";

import Countdown from "@/components/Countdown";

import Footer from "@/components/layout/Footer";

import Contrade from "@/components/home/Contrade";



export default function Home() {

  return (

    <>

      <Navbar />



      <main className="max-w-7xl mx-auto px-6">

        <Hero />

        <Countdown />

        <Contrade />

      </main>



      <Footer />

    </>

  );

}