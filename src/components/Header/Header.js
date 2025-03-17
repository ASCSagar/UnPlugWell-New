"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
  { name: "Categories", href: "/categories" },
  { name: "AboutUs", href: "/aboutUs" },
  { name: "ContactUs", href: "/contactUs" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/unplugwell.png"
                alt="Unplugwell"
                className="h-8 w-auto"
              />
              <span className="text-2xl font-bold text-white transition-colors">
                Unplugwell
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-gray-400 hover:text-white font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-white transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              {navigation.map((item, index) => (
                <Link
                  key={item.name + index}
                  href={item.href}
                  className="text-gray-400 hover:text-white font-medium block px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
