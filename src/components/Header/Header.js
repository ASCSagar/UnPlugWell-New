"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
  { 
    name: "Categories", 
    href: "/categories",
    dropdown: [
      { name: "Digital Detox", href: "/categories/digital-detox" },
      { name: "Mindfulness", href: "/categories/mindfulness" },
      { name: "Wellness", href: "/categories/wellness" },
      { name: "Productivity", href: "/categories/productivity" },
    ]
  },
  { name: "About", href: "/aboutUs" },
  { name: "Contact", href: "/contactUs" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You would implement actual dark mode toggling here
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md text-lavender-dark border-b border-lavender-light/20" 
          : "bg-gradient-to-r from-purple-900 to-lavender-dark text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className={`text-2xl font-bold ${scrolled ? "text-transparent bg-clip-text bg-gradient-to-r from-lavender to-lavender-dark" : "text-white"} transition-colors`}>
                Unplugwell
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <div key={index} className="relative group">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                        scrolled
                          ? "text-lavender-dark hover:bg-lavender-light/20"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      } transition-colors`}
                    >
                      {item.name}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`} />
                    </button>
                    {activeDropdown === index && (
                      <div className="absolute top-full left-0 mt-1 py-2 w-48 bg-white rounded-lg shadow-lg border border-lavender-light/20 z-20">
                        {item.dropdown.map((dropdownItem, idx) => (
                          <Link
                            key={idx}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-lavender-dark hover:bg-lavender-light/20 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      scrolled
                        ? "text-lavender-dark hover:bg-lavender-light/20"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    } transition-colors`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ml-2 ${
                scrolled
                  ? "bg-lavender-light/20 text-lavender-dark hover:bg-lavender-light/30"
                  : "bg-white/10 text-white hover:bg-white/20"
              } transition-colors`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg ${
                scrolled
                  ? "text-lavender-dark hover:bg-lavender-light/20"
                  : "text-white hover:bg-white/10"
              } transition-colors`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-1 pb-4">
              {navigation.map((item, index) => (
                <div key={index}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(index)}
                        className={`flex justify-between items-center w-full px-4 py-2 rounded-lg font-medium ${
                          scrolled
                            ? "text-lavender-dark hover:bg-lavender-light/20"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        } transition-colors`}
                      >
                        {item.name}
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`} />
                      </button>
                      {activeDropdown === index && (
                        <div className="pl-4 space-y-1 mt-1">
                          {item.dropdown.map((dropdownItem, idx) => (
                            <Link
                              key={idx}
                              href={dropdownItem.href}
                              className={`block px-4 py-2 rounded-lg ${
                                scrolled
                                  ? "text-lavender-dark hover:bg-lavender-light/20"
                                  : "text-white/80 hover:text-white hover:bg-white/10"
                              } transition-colors`}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg font-medium ${
                        scrolled
                          ? "text-lavender-dark hover:bg-lavender-light/20"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      } transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Dark mode toggle in mobile menu */}
              <div className="pt-2 mt-2 border-t border-white/10">
                <button
                  onClick={toggleDarkMode}
                  className={`flex items-center w-full px-4 py-2 rounded-lg ${
                    scrolled
                      ? "text-lavender-dark hover:bg-lavender-light/20"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  } transition-colors`}
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="h-5 w-5 mr-2" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-2" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;