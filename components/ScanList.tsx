
import React from 'react';
import { Scan } from '../types';
import ScanListItem from './ScanListItem';

interface ScanListProps {
  scans: Scan[];
  onView: (scan: Scan) => void;
  onDelete: (id: string) => void;
}

const ScanList: React.FC<ScanListProps> = ({ scans, onView, onDelete }) => {
  return (
    <div className="space-y-3 overflow-y-auto flex-grow">
      {scans.map(scan => (
        <ScanListItem key={scan.id} scan={scan} onView={onView} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ScanList;
