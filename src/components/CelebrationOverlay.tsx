import React, { useEffect, useState } from 'react';

interface CelebrationOverlayProps {
  show: boolean;
  onComplete: () => void;
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

const animations = ['float', 'spin', 'pulse'];

interface BoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

const getRandomSize = (): number => {
  return 150 + Math.random() * 200; // 150-350px
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

    let maxOverlap = 0;
    for (const box of existingBoxes) {
      const overlap = calculateOverlapPercentage(newBox, box);
      maxOverlap = Math.max(maxOverlap, overlap);
    }

    if (maxOverlap <= 20) {
      return { top, left };
    }
  }

  // If we can't find a good position, return a random one anyway
  return {
    top: Math.random() * (viewportHeight - size),
    left: Math.random() * (viewportWidth - size),
  };
};

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ show, onComplete }) => {
  const [gifPositions, setGifPositions] = useState<GifPosition[]>([]);

  useEffect(() => {
    const loadGifs = async () => {
      try {
        const response = await fetch('/celebration_overlay_gif.json');
        const data = await response.json();

        const positions: GifPosition[] = [];
        const existingBoxes: BoundingBox[] = [];

        data.celebration_overlays.forEach((url: string, index: number) => {
          const size = getRandomSize();
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
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

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
