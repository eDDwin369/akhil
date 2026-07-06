import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import './index.css';

const AnimatedText = ({ 
  text, 
  type = 'char', 
  delayOffset = 0,
  speed = 0.04
}: { 
  text: string; 
  type?: 'char' | 'word';
  delayOffset?: number;
  speed?: number;
}) => {
  const items = type === 'char' ? text.split('') : text.split(' ');
  
  return (
    <span style={{ display: 'inline-block' }}>
      {items.map((item, index) => (
        <span
          key={index}
          className="animated-item"
          style={{
            display: 'inline-block',
            animationDelay: `${delayOffset + index * speed}s`,
            whiteSpace: 'pre'
          }}
        >
          {item}{type === 'word' ? ' ' : ''}
        </span>
      ))}
    </span>
  );
};

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollStage, setScrollStage] = useState(0);

  useEffect(() => {
    // 1. Initialize Lenis for smooth page scrolling
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
    });

    // 2. Track scroll to reveal sections
    const handleScroll = (e: any) => {
      const scrollY = e.animatedScroll || window.scrollY;
      
      // Reveal thresholds
      if (scrollY > 400) {
        setScrollStage(2);
      } else if (scrollY > 150) {
        setScrollStage(1);
      } else {
        setScrollStage(0);
      }
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="hero" id="hero">
        <div className="hero-left">
          {/* Flex display keeps them on one line */}
          <h1 className="hero-title" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2em' }}>
            <span className="title-word">
              <AnimatedText text="Akhil" delayOffset={0.2} speed={0.06} />
            </span>
            {scrollStage >= 1 && (
              <>
                <span className="title-word">
                  <AnimatedText text="Varghese" delayOffset={0.1} speed={0.06} />
                </span>
                <span className="title-word">
                  <AnimatedText text="Simon" delayOffset={0.5} speed={0.06} />
                  <span className="animated-item dot" style={{ display: 'inline-block', animationDelay: '0.8s' }}>.</span>
                </span>
              </>
            )}
          </h1>
          
          <div style={{ minHeight: '80px' }}>
            {scrollStage >= 2 && (
              <p className="hero-description">
                <AnimatedText 
                  text="A visionary creator bringing digital experiences to life." 
                  type="word" 
                  delayOffset={0.1} 
                  speed={0.06} 
                />
              </p>
            )}
          </div>
        </div>
        <div className="hero-right">
          <div className="video-container">
            <video 
              ref={videoRef} 
              id="scroll-video" 
              src="/assets/video.mp4" 
              autoPlay
              loop
              muted 
              playsInline 
            />
          </div>
        </div>
      </div>
      
      {/* Invisible scroll space to allow the user to scroll down and trigger stages */}
      <div style={{ height: '150vh' }}></div>
    </>
  );
}

export default App;
