/**
 * AutoScrollController
 * 
 * Cinematic auto-scroll timeline engine for premium wedding invitations.
 * Creates a movie-like experience with smooth, elegant auto-advancement.
 */

export class AutoScrollController {
  constructor(options = {}) {
    this.container = options.container;
    this.scenes = options.scenes || [];
    this.currentSceneIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.animationFrameId = null;
    this.startTime = null;
    this.scrollPosition = 0;
    this.targetScroll = 0;
    
    // Timing configuration
    this.sceneDuration = options.sceneDuration || 12000; // 12 seconds per scene
    this.transitionDuration = options.transitionDuration || 3000; // 3 second transitions
    this.scrollSpeed = options.scrollSpeed || 0.012; // Very slow, elegant scroll
    
    // Easing function (cinematic cubic-bezier)
    this.ease = this.cubicBezier(0.25, 0.1, 0.25, 1); // ease-in-out
    
    // Callbacks
    this.onSceneChange = options.onSceneChange || (() => {});
    this.onComplete = options.onComplete || (() => {});
    
    // Performance
    this.lastFrameTime = 0;
    this.targetFPS = 60;
    this.frameInterval = 1000 / this.targetFPS;
    
    // User interaction tracking
    this.userInteracting = false;
    this.interactionTimeout = null;
  }

  cubicBezier(x1, y1, x2, y2) {
    return (t) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      
      // Simplified cubic bezier approximation
      const t2 = t * t;
      const t3 = t2 * t;
      return 3 * t2 * (1 - t) * y1 + 3 * t * (1 - t) * (1 - t) * y2 + t3;
    };
  }

  start() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.isPaused = false;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.animate();
  }

  pause() {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;
    this.startTime = performance.now() - (this.scrollPosition / this.scrollSpeed);
    this.animate();
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  setUserInteracting(isInteracting) {
    this.userInteracting = isInteracting;
    
    if (this.interactionTimeout) {
      clearTimeout(this.interactionTimeout);
    }
    
    if (isInteracting) {
      this.pause();
      this.interactionTimeout = setTimeout(() => {
        this.userInteracting = false;
        this.resume();
      }, 3000); // Resume after 3 seconds of no interaction
    }
  }

  getCurrentScene() {
    return this.scenes[this.currentSceneIndex] || null;
  }

  getScenePosition(index) {
    if (!this.container) return 0;
    
    // Find scene element by data attribute
    const sceneElements = this.container.querySelectorAll('[data-scene-id]');
    if (index < sceneElements.length) {
      const element = sceneElements[index];
      // Get position relative to container
      let top = 0;
      let currentElement = element;
      while (currentElement && currentElement !== this.container) {
        top += currentElement.offsetTop;
        currentElement = currentElement.offsetParent;
      }
      return top;
    }
    
    // Fallback: calculate based on index
    return index * (window.innerHeight || 800);
  }

  registerScene(scene) {
    this.scenes.push(scene);
  }

  initializeScenes() {
    if (!this.container) return;
    
    const sceneElements = this.container.querySelectorAll('[data-scene-id]');
    this.scenes = Array.from(sceneElements).map((el, index) => ({
      id: el.getAttribute('data-scene-id'),
      element: el,
      duration: this.sceneDuration,
    }));
    
    console.log(`🎬 Initialized ${this.scenes.length} scenes`);
  }

  animate() {
    if (!this.isPlaying || this.isPaused || this.userInteracting) return;
    
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    
    // Maintain 60fps
    if (deltaTime < this.frameInterval) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
      return;
    }
    
    this.lastFrameTime = now - (deltaTime % this.frameInterval);
    
    if (!this.container) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
      return;
    }
    
    const elapsed = now - this.startTime;
    
    // Calculate total timeline duration
    const totalTimeline = (this.scenes.length * this.sceneDuration) + 
                         ((this.scenes.length - 1) * this.transitionDuration);
    
    // Calculate target scroll position based on timeline
    let targetScroll = 0;
    let accumulatedTime = 0;
    
    for (let i = 0; i < this.scenes.length; i++) {
      const sceneStart = accumulatedTime;
      const sceneEnd = sceneStart + this.sceneDuration;
      const transitionEnd = sceneEnd + this.transitionDuration;
      
      if (elapsed >= sceneStart && elapsed < transitionEnd) {
        const sceneProgress = Math.min(1, (elapsed - sceneStart) / this.sceneDuration);
        const sceneStartPos = this.getScenePosition(i);
        const sceneEndPos = i < this.scenes.length - 1 
          ? this.getScenePosition(i + 1) 
          : this.container.scrollHeight - this.container.clientHeight;
        
        if (elapsed < sceneEnd) {
          // In scene - ease progress
          const easedProgress = this.ease(sceneProgress);
          targetScroll = sceneStartPos + (sceneEndPos - sceneStartPos) * easedProgress;
        } else {
          // In transition
          const transitionProgress = (elapsed - sceneEnd) / this.transitionDuration;
          const easedTransition = this.ease(transitionProgress);
          targetScroll = sceneStartPos + (sceneEndPos - sceneStartPos) * easedTransition;
        }
        
        // Check if we should move to next scene
        if (i !== this.currentSceneIndex) {
          this.currentSceneIndex = i;
          this.onSceneChange(i, this.scenes[i]);
        }
        break;
      }
      
      accumulatedTime = transitionEnd;
    }
    
    // Smooth scroll to target
    const diff = targetScroll - this.scrollPosition;
    this.scrollPosition += diff * this.scrollSpeed;
    
    // Apply scroll
    this.container.scrollTop = this.scrollPosition;
    
    // Check if we've reached the end
    const totalHeight = this.container.scrollHeight - this.container.clientHeight;
    if (this.scrollPosition >= totalHeight - 5 || elapsed >= totalTimeline) {
      this.onComplete();
      this.stop();
      return;
    }
    
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  jumpToScene(index) {
    if (index < 0 || index >= this.scenes.length) return;
    
    this.currentSceneIndex = index;
    const targetPos = this.getScenePosition(index);
    this.scrollPosition = targetPos;
    
    if (this.container) {
      this.container.scrollTop = targetPos;
    }
    
    this.onSceneChange(index, this.scenes[index]);
  }

  destroy() {
    this.stop();
    if (this.interactionTimeout) {
      clearTimeout(this.interactionTimeout);
    }
    this.container = null;
    this.scenes = [];
  }
}
