"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Clock,
  Calendar,
  Facebook,
  Twitter,
  Instagram,
  ArrowLeft,
  Tag,
  Eye,
  Sparkles,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Square,
  VolumeX,
  Volume2,
  Headphones,
  ArrowRight,
  Settings,
  XCircle,
  Menu,
  X,
  Share2,
  BookOpen,
  ChevronUp,
  Heart,
  MessageCircle,
  Bookmark,
  User,
  PenTool,
  Moon,
  Sun,
  MessageSquare,
  Clipboard,
} from "lucide-react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import BlogTicker from "../RelatedArticles/BlogTicker";
import RelatedArticles from "../RelatedArticles/RelatedArticles";

export default function BlogDetails({ slug }) {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showTicker, setShowTicker] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const category = blog?.category?.name;
  
  // Reading progress state
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef(null);
  const bodyRef = useRef(null);
  
  // Mobile states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [showComments, setShowComments] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: small, 1: medium, 2: large
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState("5 min");
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  
  // Table of contents state
  const [tableOfContents, setTableOfContents] = useState([]);
  
  // Speech-related states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [speechSections, setSpeechSections] = useState([]);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const speechSynthRef = useRef(null);
  const utteranceRef = useRef(null);
  
  // Gesture tracking for swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://unplugwell.com/blog/api/post/${slug}/`
        );
        setBlog(response.data);
        
        // Calculate estimated reading time
        if (response.data.content) {
          const wordCount = response.data.content.split(/\s+/).length;
          const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
          setEstimatedReadingTime(`${readingTime} min read`);
        }
        
        // Simulate like count
        setLikeCount(Math.floor(Math.random() * 50) + 10);
        
        // Simulate comments
        const sampleComments = [
          {
            id: 1,
            author: "Jamie Smith",
            avatar: null,
            content: "This article really helped me understand how to balance my digital life better. Thank you!",
            date: "2 days ago",
            likes: 8
          },
          {
            id: 2,
            author: "Alex Johnson",
            avatar: null,
            content: "I've been trying to implement a digital detox for months. These tips are practical and actually doable!",
            date: "5 days ago",
            likes: 12
          },
          {
            id: 3,
            author: "Sam Rodriguez",
            avatar: null,
            content: "The part about setting boundaries really resonated with me. I'm going to try the suggested app time limits.",
            date: "1 week ago",
            likes: 5
          }
        ];
        setComments(sampleComments);
      } catch (error) {
        console.log("error", error);
      } finally {
        // Wait for the DOM to update after the blog is loaded
        setTimeout(() => {
          extractTableOfContents();
          extractSpeechSections();
        }, 800);
        setLoading(false);
      }
    };

    fetchBlog();
    
    // Reset speech state when slug changes
    handleStop();
    
    // Scroll to top when slug changes
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [slug]);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      if (!category) return;
      try {
        const response = await axios.get(
          `https://unplugwell.com/blog/api/posts-category/?site_domain=unplugwell.com&category_name=${category}`
        );

        setRelatedBlogs(response.data.results);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [category]);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      speechSynthRef.current = window.speechSynthesis;

      // Get available voices
      const loadVoices = () => {
        const availableVoices = speechSynthRef.current?.getVoices() || [];
        setVoices(availableVoices);

        // Select Hindi voice as default
        if (availableVoices.length > 0) {
          const hindiVoice = availableVoices.find(
            (voice) => voice.lang.includes("hi-IN") && voice.name.includes("Google")
          );
          
          // If Hindi voice is found, use it; otherwise fall back to first available voice
          setSelectedVoice(hindiVoice?.name || availableVoices[0].name);
        }
      };

      // Chrome loads voices asynchronously
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }

      loadVoices();
    }

    // Cleanup function
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  // Extract headings for table of contents
  const extractTableOfContents = () => {
    if (!contentRef.current) return;

    // Find all heading elements in the blog content
    const headings = contentRef.current.querySelectorAll("h2, h3");
    const toc = [];

    headings.forEach((heading, index) => {
      // Skip headings that already have IDs
      const id = heading.id || `heading-${index}`;

      // Set ID if it doesn't exist
      if (!heading.id) heading.id = id;

      toc.push({
        id,
        title: heading.textContent || `Section ${index + 1}`,
        level: heading.tagName === "H2" ? 2 : 3
      });
    });

    setTableOfContents(toc);
  };

  // Extract sections for text-to-speech
  const extractSpeechSections = () => {
    if (!contentRef.current) return;

    const sections = [];
    let currentSection = null;

    // Function to add accumulated content to sections array
    const addCurrentSection = () => {
      if (currentSection && currentSection.text.trim()) {
        sections.push(currentSection);
      }
    };

    // Get all relevant elements (headings and paragraphs)
    const contentElements = contentRef.current.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, li, blockquote"
    );

    // First, add the main title
    const titleElement = contentRef.current.querySelector("h1");
    if (titleElement && titleElement.textContent) {
      sections.push({
        id: "title",
        title: "Title",
        text: titleElement.textContent,
        level: 1,
        element: titleElement,
      });
    }

    // Process the rest of the content
    contentElements.forEach((element, index) => {
      const tagName = element.tagName.toLowerCase();
      const text = element.textContent || "";

      // If we encounter a heading, start a new section
      if (tagName.match(/^h[1-6]$/)) {
        // Add the previous section if it exists
        addCurrentSection();

        // Create a new section with this heading
        const headingLevel = parseInt(tagName.substring(1));
        const id = element.id || `section-${index}`;

        if (!element.id) element.id = id;

        currentSection = {
          id,
          title: text,
          text: text, // Initialize with just the heading text
          level: headingLevel,
          element: element,
        };
      }
      // If it's a paragraph or list item, add to current section's content
      else if (
        currentSection &&
        (tagName === "p" || tagName === "li" || tagName === "blockquote")
      ) {
        currentSection.text += " " + text;
      }
    });

    // Add the last section if exists
    addCurrentSection();

    setSpeechSections(sections);
  };

  // Update reading progress on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!bodyRef.current || !contentRef.current) return;

      // Calculate reading progress
      const totalHeight = contentRef.current.scrollHeight;
      const containerHeight = bodyRef.current.clientHeight;
      const scrollTop = bodyRef.current.scrollTop;
      
      // Calculate percentage through content
      const scrollableDistance = totalHeight - containerHeight;
      const progress = (scrollTop / scrollableDistance) * 100;

      setReadingProgress(Math.min(Math.max(progress, 0), 100));
      
      // Show ticker and back button when scrolled down
      setShowTicker(scrollTop > 300);
      setIsVisible(scrollTop > 300);
      
      // Show scroll to top button when scrolled down significantly
      setShowScrollToTop(scrollTop > 1000);
      
      // Show mini player when scrolled past the main player
      if (isPlaying) {
        setShowMiniPlayer(scrollTop > 600);
      }
    };

    // Add scroll event listener to the content container
    if (bodyRef.current) {
      bodyRef.current.addEventListener("scroll", handleScroll);
    }
    
    return () => {
      if (bodyRef.current) {
        bodyRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [bodyRef.current, contentRef.current, isPlaying]);

  // Handle swipe gestures
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e) => {
      touchEndX.current = e.changedTouches[0].clientX;
      handleSwipe();
    };
    
    const handleSwipe = () => {
      const swipeThreshold = 100;
      const swipeDistance = touchEndX.current - touchStartX.current;
      
      // Right swipe (open menu)
      if (swipeDistance > swipeThreshold) {
        setIsMobileMenuOpen(true);
      }
      
      // Left swipe (close menu)
      if (swipeDistance < -swipeThreshold && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobileMenuOpen]);

  // Scroll to a specific heading
  const scrollToHeading = (id) => {
    if (!bodyRef.current) return;
    
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for header
      const elementTop = element.offsetTop;
      
      bodyRef.current.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      });
      
      // Close the mobile TOC after clicking
      setShowMobileTOC(false);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };
  
  const handleScrollToTop = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };
  
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const handleFontSizeChange = () => {
    setFontSizeLevel((prevLevel) => (prevLevel + 1) % 3);
  };
  
  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
  
  const handleToggleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleShareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    setShowShareMenu(false);
  };

  // Text-to-speech functions
  const handlePlay = () => {
    if (!speechSynthRef.current || speechSections.length === 0) return;

    // If already playing, pause
    if (isPlaying) {
      speechSynthRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // If paused, resume
    if (speechSynthRef.current.paused) {
      speechSynthRef.current.resume();
      setIsPlaying(true);
      return;
    }

    // Otherwise start speaking the current section
    speakSection(currentSectionIndex);
  };

  const handleStop = () => {
    if (!speechSynthRef.current) return;

    speechSynthRef.current.cancel();
    setIsPlaying(false);
    setCurrentSectionIndex(0);
    setShowMiniPlayer(false);
  };

  const handlePrevious = () => {
    if (!speechSynthRef.current) return;

    const newIndex = Math.max(0, currentSectionIndex - 1);

    // Only change if we're moving to a different section
    if (newIndex !== currentSectionIndex) {
      speechSynthRef.current.cancel();
      setCurrentSectionIndex(newIndex);

      // If we were playing, start the new section
      if (isPlaying) {
        setTimeout(() => speakSection(newIndex), 100);
      }
    }
  };

  const handleNext = () => {
    if (!speechSynthRef.current) return;

    const newIndex = Math.min(
      speechSections.length - 1,
      currentSectionIndex + 1
    );

    // Only change if we're moving to a different section
    if (newIndex !== currentSectionIndex) {
      speechSynthRef.current.cancel();
      setCurrentSectionIndex(newIndex);

      // If we were playing, start the new section
      if (isPlaying) {
        setTimeout(() => speakSection(newIndex), 100);
      }
    }
  };

  const speakSection = (index) => {
    if (!speechSynthRef.current || !speechSections[index]) return;

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(speechSections[index].text);
    utteranceRef.current = utterance;

    // Set voice if selected
    if (selectedVoice) {
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    // Set other properties
    utterance.rate = speechRate;
    utterance.volume = speechVolume;

    // Handle when utterance finishes
    utterance.onend = () => {
      // Move to next section if not the last one
      if (index < speechSections.length - 1) {
        setCurrentSectionIndex(index + 1);
        speakSection(index + 1);
      } else {
        setIsPlaying(false);
        setCurrentSectionIndex(0);
        setShowMiniPlayer(false);
      }
    };

    // Handle if utterance is stopped/interrupted
    utterance.onpause = () => setIsPlaying(false);
    utterance.onresume = () => setIsPlaying(true);

    // Highlight the current section in the content
    if (speechSections[index].element) {
      scrollToHeading(speechSections[index].id);
    }

    // Start speaking
    speechSynthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const handleRateChange = (e) => {
    const rate = parseFloat(e.target.value);
    setSpeechRate(rate);

    // Update current utterance if it exists
    if (utteranceRef.current) {
      utteranceRef.current.rate = rate;
    }
  };

  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    setSpeechVolume(volume);

    // Update current utterance if it exists
    if (utteranceRef.current) {
      utteranceRef.current.volume = volume;
    }
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);

    // If currently playing, restart with new voice
    if (isPlaying && speechSynthRef.current) {
      const currentIndex = currentSectionIndex;
      speechSynthRef.current.cancel();
      setTimeout(() => speakSection(currentIndex), 100);
    }
  };
  
  // Font size classes based on selected level
  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 0: return "text-sm";
      case 1: return "text-base";
      case 2: return "text-lg";
      default: return "text-base";
    }
  };
  
  // Apply dark mode classes
  const darkModeClasses = isDarkMode ? {
    backgroundColor: "bg-gray-900",
    textColor: "text-gray-100",
    secondaryTextColor: "text-gray-300",
    paperBackground: "bg-gray-800",
    borderColor: "border-gray-700"
  } : {
    backgroundColor: "bg-backgroundColor-default",
    textColor: "text-textColor-primary",
    secondaryTextColor: "text-textColor-secondary",
    paperBackground: "bg-backgroundColor-paper",
    borderColor: "border-lavender-light"
  };

  return (
    <main 
      className={`${darkModeClasses.backgroundColor} flex flex-col min-h-screen w-full relative transition-colors duration-300 pb-16`}
    >
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full z-50 h-1 bg-transparent">
        <div 
          className="h-full bg-lavender" 
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>
      
      {/* Mobile Header */}
      <header className={`fixed top-0 left-0 w-full z-40 h-16 ${darkModeClasses.paperBackground} ${darkModeClasses.borderColor} border-b shadow-sm flex items-center px-4 transition-colors duration-300`}>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-full text-lavender"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-3 text-lg font-bold text-lavender truncate max-w-[200px]">Unplugwell</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleToggleDarkMode}
              className="p-2 rounded-full text-lavender"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={handleGoBack}
              className="p-2 rounded-full text-lavender"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-0 left-0 w-4/5 max-w-xs h-full ${darkModeClasses.paperBackground} z-50 shadow-xl overflow-y-auto`}
            >
              <div className="p-4 flex justify-between items-center border-b border-lavender-light">
                <h2 className="text-xl font-bold text-lavender">Unplugwell</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full text-lavender hover:bg-lavender-light/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="p-4 border-b border-lavender-light">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 text-lavender mr-2" />
                    Table of Contents
                  </h3>
                  <ul className="space-y-2">
                    {tableOfContents.slice(0, 5).map((heading) => (
                      <li key={heading.id}>
                        <button
                          onClick={() => {
                            scrollToHeading(heading.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center w-full px-2 py-1.5 text-sm ${darkModeClasses.secondaryTextColor} hover:text-lavender hover:bg-lavender-light/20 rounded transition-colors`}
                        >
                          <ArrowRight className="h-3 w-3 text-lavender mr-2 flex-shrink-0" />
                          <span className="truncate">{heading.title}</span>
                        </button>
                      </li>
                    ))}
                    {tableOfContents.length > 5 && (
                      <button
                        onClick={() => {
                          setShowMobileTOC(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-center text-sm text-lavender font-medium mt-2"
                      >
                        Show all {tableOfContents.length} sections
                      </button>
                    )}
                  </ul>
                </div>
              )}
              
              {/* Reader settings */}
              <div className="p-4 border-b border-lavender-light">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Settings className="h-4 w-4 text-lavender mr-2" />
                  Reading Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <button
                      onClick={handleFontSizeChange}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-lavender-light/20 text-lavender"
                    >
                      <span className="flex items-center text-sm">
                        <PenTool className="h-4 w-4 mr-2" />
                        Font Size
                      </span>
                      <span className="text-xs font-medium bg-lavender text-white px-2 py-1 rounded-full">
                        {fontSizeLevel === 0 ? "Small" : fontSizeLevel === 1 ? "Medium" : "Large"}
                      </span>
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={handleToggleDarkMode}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-lavender-light/20 text-lavender"
                    >
                      <span className="flex items-center text-sm">
                        {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                        {isDarkMode ? "Light Mode" : "Dark Mode"}
                      </span>
                      <div className={`w-10 h-5 rounded-full relative ${isDarkMode ? "bg-lavender" : "bg-gray-300"}`}>
                        <div className={`absolute top-0.5 ${isDarkMode ? "right-0.5" : "left-0.5"} w-4 h-4 bg-white rounded-full transition-all`}></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Listen options */}
              <div className="p-4 border-b border-lavender-light">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Headphones className="h-4 w-4 text-lavender mr-2" />
                  Listen to Article
                </h3>
                <button
                  onClick={() => {
                    setIsAudioPlayerOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm rounded-lg bg-lavender text-white hover:bg-lavender-dark transition-colors"
                >
                  <Headphones className="h-4 w-4" />
                  Start Listening
                </button>
              </div>
              
              {/* Share options */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Share2 className="h-4 w-4 text-lavender mr-2" />
                  Share Article
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-500/10 text-blue-500"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, "_blank")}
                  >
                    <Twitter className="h-5 w-5 mb-1" />
                    <span className="text-xs">Twitter</span>
                  </button>
                  <button
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-700/10 text-blue-700"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")}
                  >
                    <Facebook className="h-5 w-5 mb-1" />
                    <span className="text-xs">Facebook</span>
                  </button>
                  <button
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-pink-600/10 text-pink-600"
                    onClick={() => window.open(`https://www.instagram.com/unplugwell/`, "_blank")}
                  >
                    <Instagram className="h-5 w-5 mb-1" />
                    <span className="text-xs">Instagram</span>
                  </button>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm rounded-lg bg-gray-200 text-gray-800 mt-3 hover:bg-gray-300 transition-colors"
                >
                  <Clipboard className="h-4 w-4" />
                  Copy Link
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Mobile Table of Contents Overlay */}
      <AnimatePresence>
        {showMobileTOC && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className={`fixed inset-0 z-50 ${darkModeClasses.paperBackground} p-4 overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit pb-2 border-b border-lavender-light">
              <h3 className="text-xl font-bold flex items-center text-lavender">
                <BookOpen className="h-5 w-5 mr-2" />
                Table of Contents
              </h3>
              <button
                onClick={() => setShowMobileTOC(false)}
                className="p-2 rounded-full text-lavender hover:bg-lavender-light/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="space-y-3">
              {tableOfContents.map((heading) => (
                <li key={heading.id} className={heading.level === 2 ? "pl-0" : "pl-4"}>
                  <button
                    onClick={() => {
                      scrollToHeading(heading.id);
                      setShowMobileTOC(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 ${darkModeClasses.secondaryTextColor} hover:text-lavender hover:bg-lavender-light/20 rounded-lg transition-colors ${heading.level === 2 ? "font-medium" : "font-normal"}`}
                  >
                    <ArrowRight className="h-4 w-4 text-lavender mr-2 flex-shrink-0" />
                    <span>{heading.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Audio Player */}
      <AnimatePresence>
        {isAudioPlayerOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className={`fixed inset-0 z-50 ${darkModeClasses.paperBackground} p-4 overflow-y-auto pt-16`}
          >
            <div className="flex justify-between items-center mb-6 sticky top-16 bg-inherit pb-2 border-b border-lavender-light">
              <h3 className="text-xl font-bold flex items-center text-lavender">
                <Headphones className="h-5 w-5 mr-2" />
                Listen to Article
              </h3>
              <button
                onClick={() => setIsAudioPlayerOpen(false)}
                className="p-2 rounded-full text-lavender hover:bg-lavender-light/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Article title */}
            <h4 className={`text-lg font-bold ${darkModeClasses.textColor} mb-6`}>{blog.title}</h4>
            
            {/* Current section info */}
            <div className="mb-6">
              <p className="text-sm font-medium text-lavender mb-1">Now Playing</p>
              <p className={`text-base font-medium ${darkModeClasses.textColor} mb-2`}>
                {speechSections[currentSectionIndex]?.title || "Introduction"}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Section {currentSectionIndex + 1} of {speechSections.length}</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex justify-center items-center gap-6 mb-8">
              <button
                onClick={handlePrevious}
                disabled={currentSectionIndex <= 0 || !speechSections.length}
                className={`p-3 rounded-full ${
                  currentSectionIndex <= 0 || !speechSections.length
                    ? "text-gray-400 bg-gray-100"
                    : "text-lavender bg-lavender-light/50 hover:bg-lavender-light"
                } transition-colors`}
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={handlePlay}
                disabled={!speechSections.length}
                className="p-5 rounded-full bg-lavender text-white hover:bg-lavender-dark transition-colors shadow-lg"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>

              <button
                onClick={handleNext}
                disabled={
                  currentSectionIndex >= speechSections.length - 1 ||
                  !speechSections.length
                }
                className={`p-3 rounded-full ${
                  currentSectionIndex >= speechSections.length - 1 ||
                  !speechSections.length
                    ? "text-gray-400 bg-gray-100"
                    : "text-lavender bg-lavender-light/50 hover:bg-lavender-light"
                } transition-colors`}
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
            
            <button
              onClick={handleStop}
              disabled={!isPlaying}
              className={`w-full py-2 rounded-lg mb-8 flex items-center justify-center gap-2 ${
                !isPlaying
                  ? "bg-gray-100 text-gray-400"
                  : "bg-red-50 text-red-500"
              }`}
            >
              <Square className="w-4 h-4" />
              <span>Stop Audio</span>
            </button>

            {/* Voice selection */}
            <div className="mb-6">
              <label className={`block text-sm ${darkModeClasses.secondaryTextColor} mb-2`}>Voice</label>
              <select
                value={selectedVoice}
                onChange={handleVoiceChange}
                className={`w-full p-3 text-sm border ${darkModeClasses.borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender ${darkModeClasses.paperBackground} ${darkModeClasses.textColor}`}
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Speed control */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <label className={`flex items-center ${darkModeClasses.secondaryTextColor}`}>
                  <Settings className="w-4 h-4 mr-1" /> Speed
                </label>
                <span className="text-lavender font-medium">{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={handleRateChange}
                className="w-full accent-lavender h-2 rounded-lg appearance-none bg-lavender-light/30"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slower</span>
                <span>Faster</span>
              </div>
            </div>

            {/* Volume control */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <label className={`flex items-center ${darkModeClasses.secondaryTextColor}`}>
                  <Volume2 className="w-4 h-4 mr-1" /> Volume
                </label>
                <span className="text-lavender font-medium">{Math.round(speechVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={speechVolume}
                onChange={handleVolumeChange}
                className="w-full accent-lavender h-2 rounded-lg appearance-none bg-lavender-light/30"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Quieter</span>
                <span>Louder</span>
              </div>
            </div>
            
            {/* Show article sections */}
            <div>
              <h4 className={`text-base font-medium ${darkModeClasses.textColor} mb-3`}>Article Sections</h4>
              <div className="max-h-60 overflow-y-auto pr-2 rounded-lg border border-lavender-light p-1">
                {speechSections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSectionIndex(index);
                      if (isPlaying) {
                        speechSynthRef.current.cancel();
                        setTimeout(() => speakSection(index), 100);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg mb-1 ${
                      currentSectionIndex === index
                        ? "bg-lavender text-white"
                        : `${darkModeClasses.secondaryTextColor} hover:bg-lavender-light/20`
                    } transition-colors`}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-lavender-light/50 text-lavender text-xs flex items-center justify-center mr-2">
                        {index + 1}
                      </span>
                      <span className="truncate">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mini Audio Player */}
      <AnimatePresence>
        {showMiniPlayer && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 z-40 ${darkModeClasses.paperBackground} rounded-full shadow-lg px-4 py-2 border ${darkModeClasses.borderColor} flex items-center w-11/12 max-w-md`}
          >
            <div className="flex-1 truncate mr-2">
              <p className={`text-xs ${darkModeClasses.secondaryTextColor}`}>Now playing</p>
              <p className={`text-sm font-medium ${darkModeClasses.textColor} truncate`}>
                {speechSections[currentSectionIndex]?.title || "Introduction"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlay}
                className="w-8 h-8 rounded-full bg-lavender text-white flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowMiniPlayer(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Share Menu */}
      <AnimatePresence>
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-24 right-4 z-40 ${darkModeClasses.paperBackground} rounded-lg shadow-lg border ${darkModeClasses.borderColor} p-4 w-64`}
          >
            <h4 className={`text-sm font-medium ${darkModeClasses.textColor} mb-3`}>Share via</h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-500/10 text-blue-500"
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, "_blank");
                  setShowShareMenu(false);
                }}
              >
                <Twitter className="h-5 w-5 mb-1" />
                <span className="text-xs">Twitter</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-700/10 text-blue-700"
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
                  setShowShareMenu(false);
                }}
              >
                <Facebook className="h-5 w-5 mb-1" />
                <span className="text-xs">Facebook</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-pink-600/10 text-pink-600"
                onClick={() => {
                  window.open(`https://www.instagram.com/`, "_blank");
                  setShowShareMenu(false);
                }}
              >
                <Instagram className="h-5 w-5 mb-1" />
                <span className="text-xs">Instagram</span>
              </button>
            </div>
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
              <Clipboard className="h-4 w-4" />
              Copy Link
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollToTop}
            className="fixed bottom-24 right-4 z-40 p-3 rounded-full bg-lavender text-white shadow-lg"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Mobile Navigation Tabs */}
      <div 
        className={`fixed bottom-0 left-0 w-full z-40 h-16 ${darkModeClasses.paperBackground} ${darkModeClasses.borderColor} border-t shadow-sm flex items-center px-2 transition-colors duration-300`}
      >
        <div className="w-full grid grid-cols-5 gap-1">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex flex-col items-center justify-center h-14 rounded-lg ${activeTab === "content" ? "text-lavender" : darkModeClasses.secondaryTextColor}`}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Read</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("toc");
              setShowMobileTOC(true);
            }}
            className={`flex flex-col items-center justify-center h-14 rounded-lg ${activeTab === "toc" ? "text-lavender" : darkModeClasses.secondaryTextColor}`}
          >
            <Tag className="h-5 w-5" />
            <span className="text-xs mt-1">Sections</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("listen");
              setIsAudioPlayerOpen(true);
            }}
            className={`flex flex-col items-center justify-center h-14 rounded-lg ${activeTab === "listen" ? "text-lavender" : darkModeClasses.secondaryTextColor}`}
          >
            <Headphones className="h-5 w-5" />
            <span className="text-xs mt-1">Listen</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("comments");
              setShowComments(true);
            }}
            className={`flex flex-col items-center justify-center h-14 rounded-lg ${activeTab === "comments" ? "text-lavender" : darkModeClasses.secondaryTextColor}`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs mt-1">Comments</span>
          </button>
          <button
            onClick={handleShareArticle}
            className={`flex flex-col items-center justify-center h-14 rounded-lg ${activeTab === "share" ? "text-lavender" : darkModeClasses.secondaryTextColor}`}
          >
            <Share2 className="h-5 w-5" />
            <span className="text-xs mt-1">Share</span>
          </button>
        </div>
      </div>
      
      {/* Main content scrollable area */}
      <div 
        ref={bodyRef} 
        className={`flex-grow h-full overflow-y-auto mt-16 pb-24 ${darkModeClasses.backgroundColor} transition-colors duration-300`}
      >
        {/* Mobile Comments Overlay */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              className={`fixed inset-0 z-40 ${darkModeClasses.paperBackground} p-4 overflow-y-auto pt-16`}
            >
              <div className="flex justify-between items-center mb-4 sticky top-16 bg-inherit pb-2 border-b border-lavender-light">
                <h3 className="text-xl font-bold flex items-center text-lavender">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Comments
                </h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="p-2 rounded-full text-lavender hover:bg-lavender-light/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Comment form */}
              <div className={`mb-6 p-4 rounded-lg border ${darkModeClasses.borderColor} bg-lavender-light/5`}>
                <div className="flex gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-lavender flex items-center justify-center text-white text-sm font-semibold">
                    U
                  </div>
                  <textarea
                    placeholder="Share your thoughts..."
                    className={`flex-1 p-3 rounded-lg border ${darkModeClasses.borderColor} bg-transparent text-sm ${darkModeClasses.textColor} focus:outline-none focus:ring-2 focus:ring-lavender`}
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-lavender text-white rounded-lg text-sm font-medium">
                    Post Comment
                  </button>
                </div>
              </div>
              
              {/* Comments list */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-lavender-light pb-4">
                    <div className="flex gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-gray-700 text-sm font-semibold">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className={`font-medium ${darkModeClasses.textColor}`}>{comment.author}</h4>
                          <span className="text-xs text-gray-500">{comment.date}</span>
                        </div>
                        <p className={`mt-1 text-sm ${darkModeClasses.secondaryTextColor}`}>{comment.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="flex items-center gap-1 text-xs text-gray-500">
                            <Heart className="h-3 w-3" />
                            {comment.likes}
                          </button>
                          <button className="flex items-center gap-1 text-xs text-gray-500">
                            <MessageCircle className="h-3 w-3" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <div className="text-center py-6">
                    <p className={`text-sm ${darkModeClasses.secondaryTextColor}`}>Be the first to comment!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={contentRef} className={`max-w-full mx-auto px-4 py-4 ${getFontSizeClass()}`}>
          {loading ? (
            // Loading skeleton
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-40 bg-gray-200 rounded w-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Mobile Meta Info */}
              <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
                <span className="px-2 py-1 rounded-full bg-lavender text-white font-medium inline-block">
                  {blog.category?.name}
                </span>
                <div className={`flex items-center gap-1 ${darkModeClasses.secondaryTextColor}`}>
                  <Calendar className="h-3 w-3" />
                  <span>{moment(blog?.published_at)?.format("ll")}</span>
                </div>
                <div className={`flex items-center gap-1 ${darkModeClasses.secondaryTextColor}`}>
                  <Clock className="h-3 w-3" />
                  <span>{estimatedReadingTime}</span>
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-2xl font-bold text-lavender">
                {blog.title}
              </h1>
              
              {/* Author & Engagement */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-lavender flex items-center justify-center text-white font-semibold text-sm">
                    {blog.author?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${darkModeClasses.textColor}`}>
                      {blog.author?.full_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Author
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleToggleLike}
                    className={`p-1 rounded-full ${isLiked ? "text-red-500" : darkModeClasses.secondaryTextColor}`}
                    aria-label="Like article"
                  >
                    <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={handleToggleBookmark}
                    className={`p-1 rounded-full ${isBookmarked ? "text-lavender" : darkModeClasses.secondaryTextColor}`}
                    aria-label="Bookmark article"
                  >
                    <Bookmark className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
              
              <p className={`text-base ${darkModeClasses.secondaryTextColor}`}>{blog.excerpt}</p>
              
              {/* Featured Image */}
              {blog.featured_image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="my-4 rounded-lg overflow-hidden"
                >
                  <img
                    src={blog.featured_image}
                    alt={blog.image_alt || blog.title}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              )}
              
              {/* Article Content */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`prose prose-sm max-w-none ${
                  isDarkMode 
                    ? "prose-invert prose-headings:text-gray-100 prose-p:text-gray-300" 
                    : "prose-headings:text-textColor-primary prose-p:text-textColor-secondary"
                } ${darkModeClasses.paperBackground} rounded-lg p-4 shadow-sm`}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              
              {/* Engagement Bar */}
              <div className={`flex items-center justify-between mt-6 p-4 rounded-lg ${darkModeClasses.paperBackground} border ${darkModeClasses.borderColor}`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleToggleLike}
                    className="flex flex-col items-center"
                  >
                    <Heart 
                      className={`h-6 w-6 ${isLiked ? "text-red-500" : darkModeClasses.secondaryTextColor}`} 
                      fill={isLiked ? "currentColor" : "none"} 
                    />
                    <span className="text-xs mt-1">{likeCount}</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowComments(true);
                      setActiveTab("comments");
                    }}
                    className="flex flex-col items-center"
                  >
                    <MessageCircle className="h-6 w-6 text-gray-500" />
                    <span className="text-xs mt-1">{comments.length}</span>
                  </button>
                </div>
                <div>
                  <button 
                    onClick={handleToggleBookmark}
                    className="flex flex-col items-center"
                  >
                    <Bookmark 
                      className={`h-6 w-6 ${isBookmarked ? "text-lavender" : darkModeClasses.secondaryTextColor}`} 
                      fill={isBookmarked ? "currentColor" : "none"} 
                    />
                    <span className="text-xs mt-1">Save</span>
                  </button>
                </div>
              </div>
              
              {/* Author Bio */}
              {blog.author && (
                <div className={`p-4 rounded-lg ${darkModeClasses.paperBackground} border ${darkModeClasses.borderColor} mt-6`}>
                  <h3 className={`text-base font-semibold ${darkModeClasses.textColor} mb-3`}>
                    About the Author
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-lavender flex items-center justify-center text-white text-xl font-semibold">
                      {blog.author.full_name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className={`font-medium ${darkModeClasses.textColor}`}>
                        {blog.author.full_name}
                      </h4>
                      <p className={`text-sm ${darkModeClasses.secondaryTextColor}`}>
                        Content creator and specialist in well-being topics.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className={`p-4 rounded-lg ${darkModeClasses.paperBackground} border ${darkModeClasses.borderColor} mt-4`}>
                  <h3 className={`text-base font-semibold ${darkModeClasses.textColor} mb-3 flex items-center`}>
                    <Tag className="h-4 w-4 text-lavender mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-lavender-light text-lavender-dark text-xs font-medium"
                      >
                        <Tag className="h-3 w-3" />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Related Articles */}
              <div className="mt-8">
                <h2 className={`text-xl font-bold ${darkModeClasses.textColor} mb-4`}>Related Articles</h2>
                <div className="space-y-4">
                  {relatedBlogs.slice(0, 3).map((relatedBlog) => (
                    <motion.div
                      key={relatedBlog.id}
                      whileHover={{ x: 5 }}
                      className={`rounded-lg overflow-hidden shadow-sm border ${darkModeClasses.borderColor} ${darkModeClasses.paperBackground}`}
                    >
                      <div className="flex h-24">
                        {relatedBlog.featured_image && (
                          <div className="w-24 overflow-hidden">
                            <img
                              src={relatedBlog.featured_image}
                              alt={relatedBlog.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-3">
                          <span className="text-xs font-medium text-lavender">
                            {relatedBlog.category?.name}
                          </span>
                          <h3 className={`font-bold ${darkModeClasses.textColor} text-sm mt-1 line-clamp-2`}>
                            {relatedBlog.title}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <button className="w-full py-3 mt-4 rounded-lg border border-lavender text-lavender font-medium text-sm">
                  View More Articles
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}