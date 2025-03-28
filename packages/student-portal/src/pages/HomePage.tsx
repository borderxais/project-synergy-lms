import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/home/Navigation';
import { Features } from '../components/home/Features';
import { Testimonials } from '../components/home/Testimonials';
import { CTASection } from '../components/home/CTASection';
import { Footer } from '../components/home/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Navigate Private School</span>
                  <span className="block text-blue-600">Admissions with Confidence</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Our interactive roadmap helps you stay organized, reduce stress, and achieve your goals
                  in the private school application process.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <Link
                      to="/demo"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Try Demo
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Start Your Journey
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Features />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}