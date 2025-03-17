"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  PhoneOff,
  Brain,
  Moon,
  Users,
  ShieldCheck,
} from "lucide-react";
import AdUnit from "@/components/AdUnit/AdUnit";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Ad Banner at top with explicit colors */}
      <div className="relative z-10 w-full bg-purple-100/30 backdrop-blur-sm py-4 border-b border-purple-200">
        <div className="container mx-auto flex justify-center">
          <AdUnit format="banner" />
        </div>
      </div>
      
      {/* Main Hero Section with explicit colors */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-20 lg:py-28">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating circles with solid colors */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/20 animate-float" 
               style={{ 
                 transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
                 transition: 'transform 0.8s ease-out'
               }}></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-indigo-500/20 animate-float animation-delay-1000"
               style={{ 
                 transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
                 transition: 'transform 0.8s ease-out'
               }}></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-violet-500/20 animate-float animation-delay-2000"
               style={{ 
                 transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
                 transition: 'transform 1.55s ease-out'
               }}></div>
          
          {/* Decorative elements with solid colors */}
          <div className="absolute top-20 left-20 w-28 h-28 border border-purple-300/30 rounded-lg rotate-12"></div>
          <div className="absolute bottom-32 right-10 w-20 h-20 border border-purple-300/30 rounded-full -rotate-12"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-purple-300/30 rounded-md rotate-45"></div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6 transform transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              <Sparkles className="h-4 w-4 text-purple-200 mr-2" />
              <span className="text-sm font-medium">Digital Wellness Awaits</span>
            </div>
            
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 transform transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              Proven Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-200">Digital Balance</span>
            </h2>
            
            <p className={`text-lg text-purple-100 mb-8 transform transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              Join thousands who have already transformed their relationship with technology
            </p>
            
            <div className={`flex flex-wrap justify-center gap-4 transform transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              <Link
                href="/blogs"
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center"
              >
                Explore Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                href="/about"
                className="px-8 py-3 border border-purple-400/50 text-white rounded-lg font-medium hover:bg-purple-600/20 transition-all"
              >
                About Us
              </Link>
            </div>
          </div>
          
          {/* Stats Section with explicit colors */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {[
              {
                icon: <PhoneOff className="h-6 w-6 text-purple-200" />,
                bgColor: "bg-purple-600/20",
                count: "30+",
                label: "Digital Detox Ideas",
              },
              {
                icon: <Moon className="h-6 w-6 text-indigo-200" />,
                bgColor: "bg-indigo-600/20",
                count: "500+",
                label: "Mindful Tech Articles",
              },
              {
                icon: <Brain className="h-6 w-6 text-violet-200" />,
                bgColor: "bg-violet-600/20",
                count: "10+",
                label: "Expert Contributors",
              },
              {
                icon: <Users className="h-6 w-6 text-pink-200" />,
                bgColor: "bg-pink-600/20",
                count: "10K+",
                label: "Transformed Lives",
              },
            ].map((stat, index) => (
              <div 
                key={index}
                className={`text-center p-5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className={`${stat.bgColor} p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.count}</div>
                <div className="text-purple-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section with explicit colors */}
      <section id="content-section" className="py-16 bg-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">Digital Wellness Solutions</h2>
            <p className="text-purple-700">Simple tools and practices to help balance your digital life</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <ShieldCheck className="h-6 w-6 text-purple-600" />,
                bgColor: "bg-purple-100",
                title: "Digital Wellness Tools",
                description: "Apps and techniques to monitor and improve your digital habits."
              },
              {
                icon: <Brain className="h-6 w-6 text-indigo-600" />,
                bgColor: "bg-indigo-100",
                title: "Mindfulness Practices",
                description: "Simple meditation and mindfulness exercises for digital balance."
              },
              {
                icon: <Users className="h-6 w-6 text-violet-600" />,
                bgColor: "bg-violet-100",
                title: "Community Support",
                description: "Connect with others on similar digital wellness journeys."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-xl border border-purple-200/50 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className={`${feature.bgColor} p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">{feature.title}</h3>
                <p className="text-purple-700 mb-4">{feature.description}</p>
                <Link 
                  href="/blog"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;