import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import './index.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vargheseSimonRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  
  // Track loaded frames so we only draw when ready
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const frameCount = 121;

  useEffect(() => {
    // 1. Initialize Lenis for smooth page scrolling
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
    });

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const images: HTMLImageElement[] = [];

    // Preload all frames into memory for instant scrubbing
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      // Format number to 4 digits: 0000, 0001
      const frameIndex = i.toString().padStart(4, '0');
      img.src = `assets/frames/frame_${frameIndex}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImagesLoaded(true);
          // Draw first frame immediately to set up the canvas
          if (context && canvas) {
             canvas.width = images[0].width;
             canvas.height = images[0].height;
             context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
          }
        }
      };
      images.push(img);
    }

    let targetScroll = 0;
    let currentScroll = 0;
    let animationFrameId: number;
    let currentFrameIndex = -1;

    const onScroll = (e: any) => {
      targetScroll = e.animatedScroll || e.scroll || window.scrollY;
    };

    lenis.on('scroll', onScroll);

    const renderLoop = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      
      // Lerp scroll for buttery smooth effect
      currentScroll += (targetScroll - currentScroll) * 0.1;
      
      let progress = maxScroll > 0 ? currentScroll / maxScroll : 0;
      progress = Math.max(0, Math.min(1, progress));

      // 1. Canvas Scrubbing (Image Sequence)
      if (images.length === frameCount && loadedCount === frameCount && canvas && context) {
        // Calculate which frame we should be on
        const frameIndex = Math.min(
          frameCount - 1,
          Math.max(0, Math.floor(progress * frameCount))
        );
        
        // Only draw if the frame has changed to save performance
        if (frameIndex !== currentFrameIndex) {
          context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
          currentFrameIndex = frameIndex;
        }
      }

      // 2. Text Reveal Based on Scroll
      // Varghese Simon appears from scroll progress 0.1 to 0.4
      const vsProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.3));
      if (vargheseSimonRef.current) {
        vargheseSimonRef.current.style.opacity = vsProgress.toString();
        vargheseSimonRef.current.style.transform = `translateY(${(1 - vsProgress) * 20}px)`;
        vargheseSimonRef.current.style.filter = `blur(${(1 - vsProgress) * 4}px)`;
      }

      // Description appears from scroll progress 0.4 to 0.7
      const descProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.3));
      if (descRef.current) {
        descRef.current.style.opacity = descProgress.toString();
        descRef.current.style.transform = `translateY(${(1 - descProgress) * 20}px)`;
        descRef.current.style.filter = `blur(${(1 - descProgress) * 4}px)`;
      }

      animationFrameId = requestAnimationFrame(requestAnimationFrameCallback);
    };
    
    // We wrap it so we can use animationFrameId
    const requestAnimationFrameCallback = () => {
       renderLoop();
    };

    renderLoop();

    // Trigger initial calculation
    window.addEventListener('resize', () => { targetScroll = window.scrollY; });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="hero" id="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            <span className="title-word">Akhil </span>
            <span className="title-word" ref={vargheseSimonRef} style={{ opacity: 0 }}>
              Varghese Simon<span className="dot">.</span>
            </span>
          </h1>
          <p className="hero-description" ref={descRef} style={{ opacity: 0 }}>
            A visionary creator bringing digital experiences to life.
          </p>
        </div>
        <div className="hero-right">
          <div className="video-container">
            {/* Show a loading state until all 121 frames are cached in memory */}
            {!imagesLoaded && (
               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontFamily: 'Inter' }}>
                  Loading high-res frames...
               </div>
            )}
            <canvas 
              ref={canvasRef} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                opacity: imagesLoaded ? 1 : 0,
                transition: 'opacity 0.5s'
              }} 
            />
          </div>
        </div>
      </div>
      
      <div className="scroll-space"></div>
    </>
  );
}

export default App;
