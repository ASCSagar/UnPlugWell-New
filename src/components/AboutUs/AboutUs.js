"use client";
import React, { useState, useEffect } from "react";
import {
  Target,
  Heart,
  Wrench,
  Clock,
  Users,
  Globe,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    number: "10K+",
    label: "Community Members",
    icon: <Users className="h-6 w-6 text-purple-600" />,
    bgColor: "bg-purple-100",
  },
  {
    number: "500+",
    label: "Success Stories",
    icon: <Heart className="h-6 w-6 text-purple-600" />,
    bgColor: "bg-purple-100",
  },
  {
    number: "50+",
    label: "Expert Contributors",
    icon: <BookOpen className="h-6 w-6 text-purple-600" />,
    bgColor: "bg-purple-100",
  },
  {
    number: "15+",
    label: "Digital Detox Tools",
    icon: <Wrench className="h-6 w-6 text-purple-600" />,
    bgColor: "bg-purple-100",
  },
];

const resources = [
  {
    icon: Heart,
    title: "Success Stories",
    description:
      "Real stories from individuals who have transformed their lives through digital detox.",
  },
  {
    icon: Wrench,
    title: "Expert Tips & Guides",
    description:
      "Professional guidance and strategies for managing your digital habits effectively.",
  },
  {
    icon: Clock,
    title: "Digital Detox Tools",
    description:
      "Practical tools and challenges to help you unplug and maintain a healthy balance.",
  },
];

const values = [
  {
    icon: Target,
    title: "Mindful Technology Use",
    description:
      "We promote conscious and balanced engagement with digital tools to enhance life without letting technology control it.",
  },
  {
    icon: Globe,
    title: "Digital Wellness",
    description:
      "Creating awareness about how technology affects mental health and providing practical solutions for a healthier relationship with devices.",
  },
  {
    icon: MessageCircle,
    title: "Community Support",
    description:
      "Building a supportive community where individuals can share experiences and strategies for maintaining digital balance.",
  },
];

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="py-12 min-h-screen bg-gray-50">
      <section className="relative py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="relative container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Welcome to UnplugWell
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Your sanctuary for rediscovering balance in the digital age. We
              empower individuals to take control of their screen time and
              cultivate healthier, more fulfilling lives offline.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label + index}
                className={`card text-center p-6 bg-lavenderSecondary-light rounded-xl shadow-card hover:shadow-card-hover transform transition-all duration-500 hover:-translate-y-2 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`mx-auto mb-4 w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-800 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-lavenderSecondary-light">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`transform transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Our Mission
              </h3>
              <p className="text-gray-800 text-lg mb-8">
                At UnplugWell, we are passionate about helping people achieve
                harmony between their digital and real lives. Through insightful
                content, practical strategies, and inspiring stories, we guide
                our community on a journey of mindfulness, productivity, and
                self-discovery.
              </p>
              <div className="space-y-6">
                {values.map((value, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <value.icon className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-600 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`relative transform transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
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
      <section className="py-20 bg-backgroundColor-paper">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
            What We Offer
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Explore our resources designed to help you build a healthier
            relationship with technology
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <div
                key={index}
                className={`card bg-lavenderSecondary-light rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 transform hover:-translate-y-2 border border-lavender-light/10 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100 + 300}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-lg bg-purple-100 flex items-center justify-center mb-5`}
                >
                  <resource.icon className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-purple-600 mb-3">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-5">{resource.description}</p>
                <Link
                  href="/blogs"
                  className="inline-flex items-center text-gray-600 hover:text-purple-600 font-medium transition-colors"
                >
                  Learn more
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Us on the Journey
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Together, we can unplug and thrive. Start your digital detox journey
            today and rediscover the beauty of living in the present moment.
          </p>
          <button className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-300">
            Get Started
          </button>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
