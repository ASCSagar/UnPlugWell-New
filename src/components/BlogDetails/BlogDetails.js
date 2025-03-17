"use client";
import { useState, useEffect, useRef } from "react";
import AdUnit from '@/components/AdUnit/AdUnit';

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
} from "lucide-react";
import moment from "moment";
import { motion } from "framer-motion";
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
  const speechSynthRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://unplugwell.com/blog/api/post/${slug}/`
        );
        setBlog(response.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        // Wait for the DOM to update after the blog is loaded
        setTimeout(() => {
          extractTableOfContents();
          extractSpeechSections();
        }, 800);
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
          
          // For debugging which voices are available
          console.log("Available voices:", availableVoices.map(v => `${v.name} (${v.lang})`));
          console.log("Selected voice:", hindiVoice?.name || availableVoices[0].name);
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
  }, [bodyRef.current, contentRef.current]);

  // Scroll to a specific heading
  const scrollToHeading = (id) => {
    if (!bodyRef.current) return;
    
    const element = document.getElementById(id);
    if (element) {
      const offset = 20; // Small offset for better visibility
      const elementTop = element.offsetTop;
      
      bodyRef.current.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      });
    }
  };

  const handleGoBack = () => {
    window.history.back();
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

  return (
    <main className="h-screen flex flex-col bg-backgroundColor-default overflow-hidden pt-16">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full z-50 h-1 bg-transparent">
        <div 
          className="h-full bg-lavender" 
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>
      
      {/* Site Header - Fixed at top */}
      <header className="fixed top-0 left-0 w-full z-40 h-16 bg-backgroundColor-paper border-b border-lavender-light shadow-sm flex items-center px-6">
        <div className="flex justify-between items-center w-full">
          <div className="text-xl font-bold text-lavender">Unplugwell</div>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 rounded-button bg-lavender text-white text-sm font-medium hover:bg-lavender-dark transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </button>
        </div>
      </header>
      
      {/* Floating listen button */}
      <button
        onClick={() => setIsAudioPlayerOpen(!isAudioPlayerOpen)}
        className="fixed bottom-20 right-6 z-50 p-3 rounded-full bg-lavender hover:bg-lavender-dark text-white shadow-lg transition-colors"
      >
        <Headphones className="h-5 w-5" />
      </button>
      
      {/* Audio Player */}
      {isAudioPlayerOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-32 right-6 w-80 z-50 rounded-card bg-backgroundColor-paper shadow-card border border-lavender-light p-4"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-h6 text-textColor-primary font-medium flex items-center">
              <Headphones className="w-4 h-4 text-lavender mr-2" />
              Listen to Article
            </h3>
            <button 
              onClick={() => setIsAudioPlayerOpen(false)}
              className="text-textColor-secondary hover:text-textColor-primary"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Current section info */}
          <p className="text-sm font-medium text-textColor-primary mb-3 truncate">
            {speechSections[currentSectionIndex]?.title || "Loading content..."}
          </p>

          {/* Controls */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={handlePrevious}
              disabled={currentSectionIndex <= 0 || !speechSections.length}
              className={`p-2 rounded-full ${
                currentSectionIndex <= 0 || !speechSections.length
                  ? "text-gray-400 bg-gray-100"
                  : "text-textColor-primary bg-lavender-light hover:bg-lavender hover:text-white"
              } transition-colors`}
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlay}
              disabled={!speechSections.length}
              className="p-3 rounded-full bg-lavender text-white hover:bg-lavender-dark transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={handleStop}
              disabled={!isPlaying}
              className={`p-2 rounded-full ${
                !isPlaying
                  ? "text-gray-400 bg-gray-100"
                  : "text-textColor-primary bg-lavender-light hover:bg-lavender hover:text-white"
              } transition-colors`}
            >
              <Square className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              disabled={
                currentSectionIndex >= speechSections.length - 1 ||
                !speechSections.length
              }
              className={`p-2 rounded-full ${
                currentSectionIndex >= speechSections.length - 1 ||
                !speechSections.length
                  ? "text-gray-400 bg-gray-100"
                  : "text-textColor-primary bg-lavender-light hover:bg-lavender hover:text-white"
              } transition-colors`}
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Section progress */}
          <div className="flex items-center mb-3 text-sm text-textColor-secondary">
            <span className="mr-2">Section:</span>
            <span>{currentSectionIndex + 1} / {speechSections.length}</span>
          </div>

          {/* Voice selection */}
          <div className="mb-3">
            <label className="block text-sm text-textColor-secondary mb-1">Voice</label>
            <select
              value={selectedVoice}
              onChange={handleVoiceChange}
              className="w-full p-2 text-sm border border-lavender-light rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Speed control */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm text-textColor-secondary mb-1">
              <label className="flex items-center">
                <Settings className="w-3 h-3 mr-1" /> Speed
              </label>
              <span>{speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={handleRateChange}
              className="w-full accent-lavender"
            />
          </div>

          {/* Volume control */}
          <div>
            <div className="flex items-center justify-between text-sm text-textColor-secondary mb-1">
              <label className="flex items-center">
                <Volume2 className="w-3 h-3 mr-1" /> Volume
              </label>
              <span>{Math.round(speechVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={speechVolume}
              onChange={handleVolumeChange}
              className="w-full accent-lavender"
            />
          </div>
        </motion.div>
      )}

      {showTicker && (
        <div className="fixed top-0 left-0 w-full z-40 transition-transform duration-300">
          <BlogTicker relatedBlogs={relatedBlogs} />
        </div>
      )}

      {/* Three-column layout container */}
      <div className="flex-grow flex overflow-hidden pb-16">
        {/* Left Sidebar - Static */}
        <div className="w-64 lg:w-80 p-6 border-r border-lavender-light flex-shrink-0 overflow-y-auto bg-backgroundColor-paper">
          {/* Table of Contents */}
          {tableOfContents.length > 0 && (
            <div className="bg-backgroundColor-paper rounded-card p-4 shadow-sm border border-lavender-light mb-6">
              <h3 className="text-lg font-semibold text-textColor-primary mb-4 flex items-center">
                <Sparkles className="h-4 w-4 text-lavender mr-2" />
                Table of Contents
              </h3>
              <div className="max-h-[calc(100vh-24rem)] overflow-y-auto pr-2">
                <ul className="space-y-1">
                  {tableOfContents.map((heading) => (
                    <li key={heading.id}>
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className="flex items-center w-full px-2 py-1.5 text-sm text-textColor-secondary hover:text-lavender hover:bg-lavender-light/20 rounded transition-colors"
                      >
                        <ArrowRight className="h-3 w-3 text-lavender mr-2 flex-shrink-0" />
                        <span className="truncate">{heading.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Audio controls in sidebar */}
              <div className="mt-6 pt-4 border-t border-lavender-light">
                <h4 className="text-base font-medium text-textColor-primary mb-3 flex items-center">
                  <Headphones className="h-4 w-4 text-lavender mr-2" />
                  Listen to Article
                </h4>
                <button
                  onClick={handlePlay}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm rounded-button bg-lavender text-white hover:bg-lavender-dark transition-colors mb-4"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </button>
                
                {/* Reading progress */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-textColor-secondary mb-1">
                    <span>Reading progress</span>
                    <span>{Math.round(readingProgress)}%</span>
                  </div>
                  <div className="h-2 w-full bg-lavender-light/30 rounded-full">
                    <div 
                      className="h-full bg-lavender rounded-full" 
                      style={{ width: `${readingProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Middle Column - Scrollable Blog Content */}
        <div 
          ref={bodyRef} 
          className="flex-grow h-full overflow-y-auto pb-12 bg-backgroundColor-default"
        >
          <div className="max-w-3xl mx-auto px-6 py-6">
            <div ref={contentRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full bg-lavender text-white font-medium">
                    {blog.category?.name}
                  </span>
                  <div className="flex items-center gap-1 text-textColor-secondary">
                    <Calendar className="h-4 w-4" />
                    <span>{moment(blog?.published_at)?.format("ll")}</span>
                  </div>
                  <div className="flex items-center gap-1 text-textColor-secondary">
                    <Clock className="h-4 w-4" />
                    <span>
                      {moment(blog?.published_at)?.startOf("hour")?.fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-textColor-secondary">
                    <Eye className="h-4 w-4" />
                    <span>{blog.view_count} views</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-lavender">
                  {blog.title}
                </h1>
                <p className="text-xl text-textColor-secondary">{blog.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-lavender-light">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-white font-semibold">
                      {blog.author?.full_name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-textColor-primary font-medium">
                        {blog.author?.full_name}
                      </h3>
                      <p className="text-sm text-textColor-secondary">
                        Author & Content Creator
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {blog.featured_image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="my-8 rounded-card overflow-hidden shadow-card"
                >
                  <img
                    src={blog.featured_image}
                    alt={blog.image_alt}
                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                  />
                </motion.div>
              )}
              
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="prose prose-lg prose-headings:text-textColor-primary prose-p:text-textColor-secondary max-w-none bg-backgroundColor-paper rounded-card p-6 shadow-card"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
            
            {/* Related Articles shown at bottom of content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-textColor-primary mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedBlogs.slice(0, 4).map((relatedBlog) => (
                  <motion.div
                    key={relatedBlog.id}
                    whileHover={{ y: -5 }}
                    className="rounded-card overflow-hidden shadow-card bg-backgroundColor-paper"
                  >
                    {relatedBlog.featured_image && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={relatedBlog.featured_image}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                        />
                      </div>
                      
                    )}
                    <div className="p-4">
                      <span className="text-xs font-medium text-lavender bg-lavender-light/30 px-2 py-1 rounded-full">
                        {relatedBlog.category?.name}
                      </span>
                      <h3 className="font-bold text-textColor-primary mt-2 line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-textColor-secondary mt-1 line-clamp-2">
                        {relatedBlog.excerpt}
                      </p>
                    </div>
                  </motion.div>
                  
                ))}
              </div>
            </motion.div>
          </div>
          <div className="my-8">
    <AdUnit format="rectangle" />
  </div>
        </div>
        
        {/* Right Sidebar - Static */}
        <div className="w-64 lg:w-80 p-6 border-l border-lavender-light flex-shrink-0 overflow-y-auto bg-backgroundColor-paper">
          {/* Share Article */}
          <div className="bg-backgroundColor-paper rounded-card p-4 shadow-sm border border-lavender-light mb-6">
            <h3 className="text-lg font-semibold text-textColor-primary mb-4 flex items-center">
              <Sparkles className="h-4 w-4 text-lavender mr-2" />
              Share this article
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent-periwinkle/20 text-accent-violet hover:bg-accent-periwinkle/30 transition-colors"
                onClick={() => window.open("https://x.com/unplugwell")}
              >
                <Twitter className="h-6 w-6 mb-1" />
                <span className="text-xs">Twitter</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent-periwinkle/20 text-accent-violet hover:bg-accent-periwinkle/30 transition-colors"
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/people/Unplugwell-DigitalDetox/61570893369070/",
                    "_blank"
                  )
                }
              >
                <Facebook className="h-6 w-6 mb-1" />
                <span className="text-xs">Facebook</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent-periwinkle/20 text-accent-violet hover:bg-accent-periwinkle/30 transition-colors"
                onClick={() =>
                  window.open("https://www.instagram.com/unplugwell/")
                }
              >
                <Instagram className="h-6 w-6 mb-1" />
                <span className="text-xs">Instagram</span>
              </button>
            </div>
          </div>
          
          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="bg-backgroundColor-paper rounded-card p-4 shadow-sm border border-lavender-light mb-6">
              <h3 className="text-lg font-semibold text-textColor-primary mb-4 flex items-center">
                <Tag className="h-4 w-4 text-lavender mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-chip bg-lavender-light text-lavender-dark text-sm font-medium hover:shadow-sm transition-shadow"
                  >
                    <Tag className="h-3 w-3" />
                    {tag.name}
                  </span>
                ))}
              </div>
              {blog.tags?.length > 0 && (
    <div className="bg-backgroundColor-paper rounded-card p-4 shadow-sm border border-lavender-light mb-6">
       <div className="mb-6">
    <AdUnit format="sidebar" />
  </div>
    </div>
  )}
            </div>
          )}
          
          {/* About the Author */}
          {blog.author && (
            <div className="bg-backgroundColor-paper rounded-card p-4 shadow-sm border border-lavender-light">
              <h3 className="text-lg font-semibold text-textColor-primary mb-4">
                About the Author
              </h3>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-lavender flex items-center justify-center text-white text-2xl font-semibold mb-3">
                  {blog.author.full_name?.charAt(0)}
                </div>
                <h4 className="text-xl font-semibold text-textColor-primary">
                  {blog.author.full_name}
                </h4>
                <p className="text-textColor-secondary mt-2">
                  Content creator and specialist in well-being topics.
                  Passionate about helping people unplug and find balance in
                  their lives.
                </p>
              </div>
              <div className="mb-6">
    <AdUnit format="sidebar" />
  </div>


            </div>
          )}
        </div>
      </div>

      
      {/* Footer - Fixed at bottom */}
      <footer className="fixed bottom-0 left-0 w-full z-40 h-16 bg-backgroundColor-paper border-t border-lavender-light shadow-sm flex items-center px-6">
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-textColor-secondary">© 2025 Unplugwell</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAudioPlayerOpen(!isAudioPlayerOpen)}
              className="flex items-center gap-2 text-lavender hover:text-lavender-dark transition-colors"
            >
              <Headphones className="h-5 w-5" />
              <span className="text-sm">Listen</span>
            </button>
            
            <div className="h-4 w-px bg-lavender-light mx-1"></div>
            
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-lavender"></div>
              <span className="text-sm text-textColor-secondary">
                {Math.round(readingProgress)}% read
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}