import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    // 1. Initialize Lenis for smooth page scrolling
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="hero" id="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            <span className="title-word"><AnimatedText text="Akhil" delayOffset={0.2} speed={0.06} /></span>
            <span className="title-word"><AnimatedText text="Varghese" delayOffset={0.7} speed={0.06} /></span>
            <span className="title-word">
              <AnimatedText text="Simon" delayOffset={1.3} speed={0.06} />
              <span className="animated-item dot" style={{ display: 'inline-block', animationDelay: '1.7s' }}>.</span>
            </span>
          </h1>
          <p className="hero-description">
            <AnimatedText 
              text="A visionary creator bringing digital experiences to life." 
              type="word" 
              delayOffset={2.0} 
              speed={0.06} 
            />
          </p>
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
    </>
  );
}

export default App;
