"use client";
import { useState } from "react";
import { Mail, CheckCircle, Sparkles, Send } from "lucide-react";

const benefits = [
  "Weekly digital wellness tips",
  "Exclusive mindfulness resources",
  "Early access to new articles",
  "Monthly wellness challenges",
];

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <section id="newsletter-section" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>
      <div className="relative container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 transition-all duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Join Our Community
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get Weekly Digital Wellness Insights
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Subscribe to our newsletter and receive expert tips on maintaining
              digital balance and mindful technology use.
            </p>
          </div>
          <div className="max-w-lg mx-auto transition-all duration-700 delay-200">
            <form
              onSubmit={handleSubmit}
              className="relative flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors duration-300 disabled:opacity-70"
              >
                Subscribe
                <Send className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto transition-all duration-700 delay-400">
            {benefits.map((benefit, index) => (
              <div
                key={benefit + index}
                className="flex items-center gap-3 text-purple-100"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-300" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-purple-200/80 transition-all duration-700 delay-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
