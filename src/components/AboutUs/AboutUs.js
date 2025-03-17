"use client";
import React, { useState, useEffect, useRef } from "react";
import { Target, Heart, Wrench, Clock, Users, Globe, BookOpen, MessageCircle } from "lucide-react";
import Link from "next/link";

const stats = [
  { 
    number: "10K+", 
    label: "Community Members",
    icon: Users,
    bgColor: "bg-lavender-light",
    iconColor: "text-lavender" 
  },
  { 
    number: "500+", 
    label: "Success Stories",
    icon: Heart,
    bgColor: "bg-accent-periwinkle/20",
    iconColor: "text-accent-periwinkle" 
  },
  { 
    number: "50+", 
    label: "Expert Contributors",
    icon: BookOpen,
    bgColor: "bg-accent-lilac/20",
    iconColor: "text-accent-lilac" 
  },
  { 
    number: "15+", 
    label: "Digital Detox Tools",
    icon: Wrench,
    bgColor: "bg-accent-violet/20",
    iconColor: "text-accent-violet" 
  },
];

const resources = [
  {
    icon: Heart,
    title: "Success Stories",
    description: "Real stories from individuals who have transformed their lives through digital detox.",
    color: "from-lavender to-lavender-dark"
  },
  {
    icon: Wrench,
    title: "Expert Tips & Guides",
    description: "Professional guidance and strategies for managing your digital habits effectively.",
    color: "from-accent-lilac to-accent-violet"
  },
  {
    icon: Clock,
    title: "Digital Detox Tools",
    description: "Practical tools and challenges to help you unplug and maintain a healthy balance.",
    color: "from-accent-periwinkle to-accent-wisteria"
  },
];

const values = [
  {
    icon: Target,
    title: "Mindful Technology Use",
    description: "We promote conscious and balanced engagement with digital tools to enhance life without letting technology control it."
  },
  {
    icon: Globe,
    title: "Digital Wellness",
    description: "Creating awareness about how technology affects mental health and providing practical solutions for a healthier relationship with devices."
  },
  {
    icon: MessageCircle,
    title: "Community Support",
    description: "Building a supportive community where individuals can share experiences and strategies for maintaining digital balance."
  }
];

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  
  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-backgroundColor-default">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-lavender-dark via-accent-violet to-lavender-dark">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-grid-white/[0.05]" />
          
          {/* Floating circles */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-lavender/10 animate-float" 
               style={{ 
                 transform: `translate(${scrollY * 0.05}px, ${scrollY * -0.05}px)`,
                 transition: 'transform 0.2s ease-out'
               }}></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-accent-periwinkle/10 animate-float animation-delay-2000"
               style={{ 
                 transform: `translate(${scrollY * -0.07}px, ${scrollY * 0.03}px)`,
                 transition: 'transform 0.3s ease-out'
               }}></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6 transform transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              <Heart className="h-4 w-4 mr-2 text-lavender-light" />
              <span className="text-sm font-medium">Pioneering Digital Wellness</span>
            </div>
            
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transform transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-light via-white to-lavender-light">UnplugWell</span>
            </h1>
            
            <p className={`text-xl text-lavender-light mb-8 max-w-2xl mx-auto transform transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              Your sanctuary for rediscovering balance in the digital age. We empower individuals to take control of their screen time and cultivate healthier, more fulfilling lives offline.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative z-10 -mt-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label + index}
                className={`card text-center p-6 bg-backgroundColor-paper rounded-xl shadow-card hover:shadow-card-hover transform transition-all duration-500 hover:-translate-y-2 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`mx-auto mb-4 w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lavender-dark to-accent-violet mb-2">
                  {stat.number}
                </div>
                <div className="text-textColor-secondary font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-lavenderSecondary-light">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
              <h2 className="text-3xl font-bold text-textColor-primary mb-6">
                Our Mission
              </h2>
              <p className="text-textColor-secondary text-lg mb-8">
                At UnplugWell, we are passionate about helping people achieve harmony between their digital and real lives. Through insightful content, practical strategies, and inspiring stories, we guide our community on a journey of mindfulness, productivity, and self-discovery.
              </p>
              
              <div className="space-y-6">
                {values.map((value, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-lavender-light flex items-center justify-center">
                        <value.icon className="h-6 w-6 text-lavender" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-textColor-primary mb-2">
                        {value.title}
                      </h3>
                      <p className="text-textColor-secondary">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`relative transform transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
                  alt="Team Meeting"
                  className="w-full h-auto rounded-2xl object-cover transform transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lavender-dark/50 to-transparent opacity-60"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-lavender rounded-2xl -z-10 opacity-50 blur-lg"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent-periwinkle rounded-full -z-10 opacity-50 blur-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 bg-backgroundColor-paper">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-textColor-primary mb-4">
            What We Offer
          </h2>
          <p className="text-center text-textColor-secondary mb-12 max-w-2xl mx-auto">
            Explore our resources designed to help you build a healthier relationship with technology
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <div
                key={index}
                className={`card bg-backgroundColor-paper rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 transform hover:-translate-y-2 border border-lavender-light/10 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100 + 300}ms` }}
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${resource.color} flex items-center justify-center mb-5`}>
                  <resource.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-textColor-primary mb-3">
                  {resource.title}
                </h3>
                <p className="text-textColor-secondary mb-5">
                  {resource.description}
                </p>
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-lavender hover:text-lavender-dark font-medium transition-colors"
                >
                  Learn more
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-lavender-dark via-accent-violet to-lavender-dark relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-grid-white/[0.05]" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-lavender-light/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-accent-periwinkle/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Us on the Journey
          </h2>
          <p className="text-xl text-lavender-light mb-8 max-w-2xl mx-auto">
            Together, we can unplug and thrive. Start your digital detox journey today and rediscover the beauty of living in the present moment.
          </p>
          <Link href="/blog" className="btn inline-flex items-center justify-center bg-white text-lavender-dark px-8 py-3 rounded-lg font-medium hover:bg-lavender-light transition-colors duration-300 shadow-lg hover:shadow-xl hover:shadow-lavender/20">
            Get Started
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;