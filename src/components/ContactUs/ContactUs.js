"use client";
import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Send,
  User,
  Sparkles,
  PhoneCall,
  MapPin,
  ArrowRight,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="py-12 min-h-screen bg-gradient-to-r from-indigo-50 to-pink-50 px-4 sm:px-6 lg:px-8">
      <div className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block border border-purple-600 py-1 px-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent font-medium text-sm mb-4">
              GET IN TOUCH
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
              We're Here to Support Your Digital Wellness Journey
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about digital detox or need personalized guidance?
              Our team is ready to help you create a healthier relationship with
              technology.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="md:col-span-7 bg-white rounded-3xl shadow-xl p-6 sm:p-8 transform transition-all duration-500 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors"
                        placeholder="Jane Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full py-3 px-4 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="pl-10 w-full py-3 px-4 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors"
                      placeholder="How can we help you?"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full py-3 px-4 bg-gray-50  border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors"
                    placeholder="Tell us how we can help with your digital wellness journey..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

            <div className="md:col-span-5 space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-gray-800 transform transition-all duration-500 hover:scale-105">
                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="p-3 bg-purple-600 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray/70 text-sm">Email us at</p>
                      <a
                        href="mailto:support@unplugwell.com"
                        className="text-gray-700 hover:underline"
                      >
                        support@unplugwell.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-3 bg-purple-600 rounded-full mr-4">
                      <PhoneCall className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray/70 text-sm">Call us</p>
                      <a
                        href="tel:+18005551234"
                        className="text-gray-700 hover:underline"
                      >
                        +1 (800) 555-1234
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-3 bg-purple-600 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray/70 text-sm">Visit our office</p>
                      <address className="not-italic text-gray-700">
                        123 Digital Detox St.
                        <br />
                        Mindful City, CA 94103
                      </address>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 transform transition-all duration-500 hover:shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Frequently Asked Questions
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/faq#detox-plan"
                      className="flex items-center text-gray-700 hover:text-gray-900  group"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 text-gray-500 transform transition-transform group-hover:translate-x-1" />
                      <span>How do I create a digital detox plan?</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/faq#workplace"
                      className="flex items-center text-gray-700 hover:text-gray-900  group"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 text-gray-500 transform transition-transform group-hover:translate-x-1" />
                      <span>Digital wellness solutions for workplaces</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/faq#screen-time"
                      className="flex items-center text-gray-700 hover:text-gray-900  group"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 text-gray-500 transform transition-transform group-hover:translate-x-1" />
                      <span>Managing children's screen time</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/faq#newsletter"
                      className="flex items-center text-gray-700 hover:text-gray-900  group"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 text-gray-500 transform transition-transform group-hover:translate-x-1" />
                      <span>How to subscribe to our newsletter</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-3xl shadow-lg p-6 overflow-hidden transform transition-all duration-500 hover:shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Find Us</h3>
            <div className="h-80 rounded-2xl overflow-hidden bg-gray-100">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.169202432397!2d73.16878167596472!3d22.309439742562773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc5873e594259%3A0xda3dc91c20f4beec!2sAnant%20Soft%20Computing!5e0!3m2!1sen!2sin!4v1731308281495!5m2!1sen!2sin"
                width="100%"
                height="400"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
