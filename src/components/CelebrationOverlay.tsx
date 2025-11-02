import React, { useEffect, useState } from 'react';

interface CelebrationOverlayProps {
  show: boolean;
  onComplete: () => void;
  duration?: number; // Duration in milliseconds (default: 6000)
}

interface GifPosition {
  url: string;
  top: string;
  left: string;
  width: string;
  height: string;
  animation: string;
  animationDelay: string;
}

const animations = ['float', 'pulse'];

interface BoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

const getRandomSize = (isMobile: boolean = false): number => {
  if (isMobile) {
    return 60 + Math.random() * 80; // 60-140px on mobile
  }
  return 80 + Math.random() * 120; // 80-200px on desktop
};

const getRandomAnimation = (): string => {
  return animations[Math.floor(Math.random() * animations.length)];
};

const calculateOverlapPercentage = (box1: BoundingBox, box2: BoundingBox): number => {
  const x1 = Math.max(box1.left, box2.left);
  const y1 = Math.max(box1.top, box2.top);
  const x2 = Math.min(box1.left + box1.width, box2.left + box2.width);
  const y2 = Math.min(box1.top + box1.height, box2.top + box2.height);

  if (x2 <= x1 || y2 <= y1) {
    return 0; // No overlap
  }

  const overlapArea = (x2 - x1) * (y2 - y1);
  const box1Area = box1.width * box1.height;
  const box2Area = box2.width * box2.height;
  const smallerArea = Math.min(box1Area, box2Area);

  return (overlapArea / smallerArea) * 100;
};

const isInCenterZone = (box: BoundingBox, viewportWidth: number, viewportHeight: number): boolean => {
  // Define center zone as middle 30% of screen (35% to 65% on both axes)
  const centerLeft = viewportWidth * 0.35;
  const centerRight = viewportWidth * 0.65;
  const centerTop = viewportHeight * 0.35;
  const centerBottom = viewportHeight * 0.65;

  // Check if the box overlaps with the center zone
  const boxRight = box.left + box.width;
  const boxBottom = box.top + box.height;

  return !(
    boxRight < centerLeft ||
    box.left > centerRight ||
    boxBottom < centerTop ||
    box.top > centerBottom
  );
};

const findNonOverlappingPosition = (
  size: number,
  existingBoxes: BoundingBox[],
  maxAttempts: number = 50
): { top: number; left: number } => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const top = Math.random() * (viewportHeight - size);
    const left = Math.random() * (viewportWidth - size);

    const newBox: BoundingBox = { top, left, width: size, height: size };

    // Check if position is in the center zone (avoid text area)
    if (isInCenterZone(newBox, viewportWidth, viewportHeight)) {
      continue;
    }

    let maxOverlap = 0;
    for (const box of existingBoxes) {
      const overlap = calculateOverlapPercentage(newBox, box);
      maxOverlap = Math.max(maxOverlap, overlap);
    }

    if (maxOverlap <= 10) {
      return { top, left };
    }
  }

  // If we can't find a good position, return a random one on the edges (avoid center)
  const edgePositions = [
    // Top edge
    { top: Math.random() * (viewportHeight * 0.3), left: Math.random() * (viewportWidth - size) },
    // Bottom edge
    { top: viewportHeight * 0.7 + Math.random() * (viewportHeight * 0.3 - size), left: Math.random() * (viewportWidth - size) },
    // Left edge
    { top: Math.random() * (viewportHeight - size), left: Math.random() * (viewportWidth * 0.3) },
    // Right edge
    { top: Math.random() * (viewportHeight - size), left: viewportWidth * 0.7 + Math.random() * (viewportWidth * 0.3 - size) },
  ];
  return edgePositions[Math.floor(Math.random() * edgePositions.length)];
};

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ show, onComplete, duration = 6000 }) => {
  const [gifPositions, setGifPositions] = useState<GifPosition[]>([]);

  useEffect(() => {
    const loadGifs = async () => {
      try {
        const response = await fetch('/celebration_overlay_gif.json');
        const data = await response.json();

        const allGifs = data.celebration_overlays;

        // Detect if mobile device (viewport width < 768px)
        const isMobile = window.innerWidth < 768;

        // Use appropriate count based on platform
        const count = isMobile
          ? (data.mobileCount || data.count || 8)
          : (data.webCount || data.count || allGifs.length);

        // Randomly select 'count' number of GIFs from the available list
        const shuffledGifs = [...allGifs].sort(() => Math.random() - 0.5);
        const selectedGifs = shuffledGifs.slice(0, Math.min(count, allGifs.length));

        const positions: GifPosition[] = [];
        const existingBoxes: BoundingBox[] = [];

        selectedGifs.forEach((url: string, index: number) => {
          const size = getRandomSize(isMobile);
          const position = findNonOverlappingPosition(size, existingBoxes);

          // Add this box to the list of existing boxes
          existingBoxes.push({
            top: position.top,
            left: position.left,
            width: size,
            height: size,
          });

          positions.push({
            url,
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${size}px`,
            height: `${size}px`,
            animation: getRandomAnimation(),
            animationDelay: `${index * 0.2}s`,
          });
        });

        setGifPositions(positions);
      } catch (error) {
        console.error('Failed to load celebration GIFs:', error);
      }
    };

    if (show) {
      loadGifs();
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete, duration]);

  if (!show) return null;

  return (
    <div className="celebration-overlay">
      {gifPositions.map((gif, index) => (
        <div
          key={index}
          className={`celebration-gif celebration-gif-${gif.animation}`}
          style={{
            top: gif.top,
            left: gif.left,
            width: gif.width,
            height: gif.height,
            animationDelay: gif.animationDelay,
          }}
        >
          <img src={gif.url} alt={`Celebration ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};
