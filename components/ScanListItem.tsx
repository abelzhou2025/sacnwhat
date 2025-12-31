
import React, { useState, useRef } from 'react';
import { Scan } from '../types';
import { TrashIcon } from './icons';

interface ScanListItemProps {
  scan: Scan;
  onView: (scan: Scan) => void;
  onDelete: (id: string) => void;
}

const ScanListItem: React.FC<ScanListItemProps> = ({ scan, onView, onDelete }) => {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX.current;
    if (diff > 0) { // Only allow right swipe
      setOffset(diff);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const threshold = (itemRef.current?.offsetWidth ?? 0) / 2.5;

    if (offset > threshold) {
      onDelete(scan.id);
    } else {
        setOffset(0); // Snap back
    }
  };
  
  const handleClick = () => {
      if(offset < 10) { // Prevent click when swiping
          onView(scan)
      }
  }

  return (
    <div
      ref={itemRef}
      className="relative rounded-lg overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="absolute inset-0 bg-red-600 flex items-center justify-start px-6">
        <TrashIcon />
      </div>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp} // Use same handler for cancel
        onClick={handleClick}
        className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer relative"
        style={{
            transform: `translateX(${offset}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        <img src={scan.imageUrl} alt="Scan thumbnail" className="w-12 h-12 object-cover rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex-grow overflow-hidden">
          <p className="text-gray-900 dark:text-white font-medium truncate whitespace-nowrap">
            {scan.text.split('\n')[0] || 'Untitled Scan'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(scan.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanListItem;