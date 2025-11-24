import React, { useState, useEffect, useRef } from 'react';

const FeatureDemoSection = ({ 
  chapters = [
    {
      title: "AI creates from scratch",
      description: "Makes fresh creatives based on winning elements",
      icon: "M12 4v16m8-8H4", // Plus icon
      videoSrc: "/videos/chapter1.mp4",
      posterSrc: "/images/chapter1-poster.jpg",
      duration: 10
    },
    {
      title: "Checks brand alignment & compliance",
      description: "Makes sure nothing slips through cracks",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // Check circle icon
      videoSrc: "/videos/chapter2.mp4",
      posterSrc: "/images/chapter2-poster.jpg",
      duration: 10
    },
    {
      title: "Auto-publishes to ad platforms",
      description: "Fully handles the last mile of ad operations and campaign management",
      icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12", // Upload icon
      videoSrc: "/videos/chapter3.mp4",
      posterSrc: "/images/chapter3-poster.jpg",
      duration: 10
    }
  ],
  autoAdvance = false,
  chapterDuration = 10
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const currentChapter = chapters[activeTab];

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Handle tab change
  useEffect(() => {
    // Stop current video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    
    // Reset progress
    setProgress(0);
    
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Auto-play if was playing before
    if (isPlaying && videoRef.current) {
      setTimeout(() => {
        videoRef.current?.play();
      }, 100);
    }
  }, [activeTab]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      startProgressAnimation();
    }
  };

  // Start progress bar animation
  const startProgressAnimation = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    const duration = currentChapter?.duration || chapterDuration;
    const interval = 50; // Update every 50ms for smooth animation
    const increment = (interval / (duration * 1000)) * 100;
    
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressIntervalRef.current);
          // Handle completion
          if (autoAdvance && activeTab < chapters.length - 1) {
            setActiveTab(activeTab + 1);
            setProgress(0);
          } else {
            // Loop current chapter
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play();
            }
            return 0;
          }
          return 100;
        }
        return newProgress;
      });
    }, interval);
  };

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      startProgressAnimation();
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      if (autoAdvance && activeTab < chapters.length - 1) {
        setActiveTab(activeTab + 1);
      } else {
        video.currentTime = 0;
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [activeTab, autoAdvance]);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Column - Tabs */}
      <div className="w-full md:w-1/3 border-r border-gray-200 px-6 py-10 space-y-10 bg-white">
        <div role="tablist" className="space-y-0">
          {chapters.map((chapter, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={activeTab === index}
              aria-pressed={activeTab === index}
              onClick={() => handleTabClick(index)}
              className={`w-full flex items-start gap-4 cursor-pointer py-4 px-2 transition-all duration-300 relative ${
                activeTab === index 
                  ? 'text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                activeTab === index 
                  ? 'bg-orange-100 text-orange-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={chapter.icon} />
                </svg>
              </div>
              
              {/* Text Content */}
              <div className="flex-1 text-left">
                <h3 className={`font-semibold mb-1 transition-colors ${
                  activeTab === index ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {chapter.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {chapter.description}
                </p>
              </div>
              
              {/* Active Tab Underline */}
              {activeTab === index && (
                <div className="absolute bottom-0 left-0 h-[3px] w-full bg-orange-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Column - Video Demo Panel */}
      <div className="w-full md:w-2/3 relative px-6 py-10 flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={currentChapter?.posterSrc}
            preload="metadata"
            playsInline
          >
            <source src={currentChapter?.videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-slate-950/50 to-slate-900/40 pointer-events-none" />

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-white/20 z-20">
            <div
              className="h-full bg-orange-500 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Background Card - Ad Manager UI */}
          <div className="absolute right-6 top-10 w-80 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 scale-95 opacity-60 z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-white font-semibold text-lg">Ad Manager</h4>
                <p className="text-white/70 text-sm">Pizzaria</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
            </div>
            <div className="mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                Active
              </span>
            </div>
            <div className="space-y-2 text-white/60 text-xs mb-4">
              <p>Library ID: 728919546261556</p>
              <p>Started running on 9 Jun 2025</p>
              <p>Total active time 9 hrs</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 mb-3">
              <div className="h-24 bg-gray-800/50 rounded mb-2"></div>
              <p className="text-white/50 text-xs">This ad has multiple versions</p>
            </div>
            <button className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
              See ad details
            </button>
          </div>

          {/* Foreground Card - Ad Creative */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 overflow-hidden z-20">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
              <span className="text-white text-xs font-medium">PIZZARIA</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-500/80 text-white text-xs font-medium">
                AI Generated
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>
            
            {/* Ad Image Area */}
            <div className="relative h-48 bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-yellow-300 mb-2 drop-shadow-lg">Melting Cheese</h2>
                <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Bottom CTA Bar */}
            <div className="px-4 py-3 bg-black/20 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Burger Bites</span>
                <span className="text-white/70 text-xs">pizzaria.com</span>
              </div>
              <button className="w-full py-2 px-4 bg-gray-700/80 hover:bg-gray-600/80 text-white text-sm rounded-lg transition-colors">
                Learn more
              </button>
            </div>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause feature demo" : "Play feature demo"}
            className="absolute bottom-5 right-5 h-14 w-14 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-110 z-30"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureDemoSection;




