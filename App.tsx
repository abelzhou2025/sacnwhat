
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppStatus, Scan } from './types';
import { compressImage } from './utils/imageHelper';
import { extractTextFromImage } from './services/geminiService';
import { CameraIcon, UploadIcon, SparklesIcon, ArrowPathIcon, ExclamationTriangleIcon, ChevronLeftIcon } from './components/icons';
import ScanList from './components/ScanList';

const LOCAL_STORAGE_KEY = 'scanwhat_scans';

export default function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.INITIAL);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [savedScans, setSavedScans] = useState<Scan[]>([]);
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  
  // Batch processing state
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load scans from local storage on initial render
  useEffect(() => {
    try {
      const storedScans = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedScans) {
        setSavedScans(JSON.parse(storedScans));
      }
    } catch (e) {
      console.error("Failed to load scans from local storage", e);
    }
  }, []);

  // Save scans to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedScans));
    } catch (e) {
      console.error("Failed to save scans to local storage", e);
    }
  }, [savedScans]);

  const resetState = useCallback((shouldGoToInitial = true) => {
    if (shouldGoToInitial) {
      setStatus(AppStatus.INITIAL);
    }
    setImageFile(null);
    setImageFiles([]);
    setImageUrl('');
    setImageUrls([]);
    setExtractedText('');
    setError(null);
    setActiveScanId(null);
    setBatchProgress({ current: 0, total: 0 });
    setIsBatchProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, []);

  const handleImageSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      if (fileArray.length === 1) {
        // Single file - use existing single file flow
        setImageFile(fileArray[0]);
        setImageUrl(URL.createObjectURL(fileArray[0]));
        setImageFiles([]);
        setImageUrls([]);
        setStatus(AppStatus.PREVIEW);
      } else {
        // Multiple files - use batch flow
        setImageFiles(fileArray);
        setImageUrls(fileArray.map(file => URL.createObjectURL(file)));
        setImageFile(null);
        setImageUrl('');
        setStatus(AppStatus.PREVIEW);
      }
    }
  };

  const handleExtractText = async () => {
    // Handle batch processing
    if (imageFiles.length > 0) {
      await handleBatchExtract();
      return;
    }
    
    // Handle single file
    if (!imageFile) return;

    setStatus(AppStatus.LOADING);
    setError(null);

    try {
      const { base64, mimeType } = await compressImage(imageFile, 1024);
      const pureBase64 = base64.split(',')[1];
      
      const resultText = await extractTextFromImage(pureBase64, mimeType);
      
      const newScan: Scan = {
        id: Date.now().toString(),
        text: resultText,
        imageUrl: base64, // Save compressed base64 image
        timestamp: Date.now(),
      };

      setSavedScans(prevScans => [newScan, ...prevScans]);
      handleViewScan(newScan);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleBatchExtract = async () => {
    if (imageFiles.length === 0) return;

    setStatus(AppStatus.LOADING);
    setIsBatchProcessing(true);
    setError(null);
    setBatchProgress({ current: 0, total: imageFiles.length });

    const newScans: Scan[] = [];
    let hasError = false;

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        setBatchProgress({ current: i + 1, total: imageFiles.length });
        
        try {
          const { base64, mimeType } = await compressImage(imageFiles[i], 1024);
          const pureBase64 = base64.split(',')[1];
          
          const resultText = await extractTextFromImage(pureBase64, mimeType);
          
          const newScan: Scan = {
            id: `${Date.now()}-${i}`,
            text: resultText,
            imageUrl: base64,
            timestamp: Date.now() + i, // Slight offset to maintain order
          };

          newScans.push(newScan);
        } catch (err) {
          console.error(`Error processing image ${i + 1}:`, err);
          // Continue with other images even if one fails
          hasError = true;
        }
      }

      if (newScans.length > 0) {
        setSavedScans(prevScans => [...newScans, ...prevScans]);
        // View the first scan result
        handleViewScan(newScans[0]);
      } else {
        throw new Error('Failed to process any images. Please try again.');
      }

      if (hasError) {
        setError('Some images failed to process, but others were successful.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus(AppStatus.ERROR);
    } finally {
      setIsBatchProcessing(false);
      setBatchProgress({ current: 0, total: 0 });
    }
  };

  const handleViewScan = (scan: Scan) => {
    setActiveScanId(scan.id);
    setExtractedText(scan.text);
    setImageUrl(scan.imageUrl);
    setStatus(AppStatus.SUCCESS);
  };

  const handleDeleteScan = (id: string) => {
    setSavedScans(prevScans => prevScans.filter(scan => scan.id !== id));
  };

  const handleTextUpdate = (newText: string) => {
    setExtractedText(newText);
    if (activeScanId) {
      setSavedScans(prevScans =>
        prevScans.map(scan =>
          scan.id === activeScanId ? { ...scan, text: newText } : scan
        )
      );
    }
  };
  
  const handleTakePhotoAgain = () => {
    resetState(false);
    cameraInputRef.current?.click();
  };
  
  const handleUploadAgain = () => {
    resetState(false);
    fileInputRef.current?.click();
  };

  const renderInitialView = () => (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">ScanWhat</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Instantly convert images to editable text.</p>
      </div>
      
      {savedScans.length > 0 ? (
        <ScanList scans={savedScans} onView={handleViewScan} onDelete={handleDeleteScan} />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No saved scans yet. Get started below!</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-auto pt-8">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={(e) => handleImageSelect(e.target.files)}
          className="hidden"
        />
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          <CameraIcon />
          Take Photo
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={(e) => handleImageSelect(e.target.files)}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          <UploadIcon />
          Upload Image{imageFiles.length > 0 ? 's' : ''}
        </button>
      </div>
    </div>
  );

  const renderPreviewView = () => {
    const isMultiple = imageFiles.length > 0;
    const previewImages = isMultiple ? imageUrls : (imageUrl ? [imageUrl] : []);
    const count = isMultiple ? imageFiles.length : 1;

    return (
      <div className="w-full max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {isMultiple ? `${count} Image${count > 1 ? 's' : ''} Selected` : 'Image Preview'}
        </h2>
        <div className="mb-6 max-h-96 overflow-y-auto">
          {previewImages.length > 0 ? (
            <div className="space-y-4">
              {previewImages.map((url, index) => (
                <img 
                  key={index}
                  src={url} 
                  alt={`Preview ${index + 1}`} 
                  className="rounded-lg w-auto mx-auto shadow-lg max-h-64"
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleExtractText}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
          >
            <SparklesIcon />
            {isMultiple ? `Extract Text from ${count} Image${count > 1 ? 's' : ''}` : 'Extract Text'}
          </button>
          <button
            onClick={() => resetState(true)}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
          >
            <ArrowPathIcon />
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderLoadingView = () => {
    const isBatch = isBatchProcessing && batchProgress.total > 1;
    const progress = isBatch ? (batchProgress.current / batchProgress.total) * 100 : 0;

    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-xl text-gray-800 dark:text-gray-300">
          {isBatch 
            ? `Processing image ${batchProgress.current} of ${batchProgress.total}...`
            : 'Analyzing your image...'}
        </p>
        {isBatch && (
          <div className="w-64 mx-auto mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <p className="text-gray-500 dark:text-gray-400 mt-2">This may take a moment.</p>
      </div>
    );
  };

  const renderDetailView = () => (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full p-4">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">Scan Result</h2>
      <div className="flex-grow flex flex-col min-h-0">
        <div className="w-full flex-grow flex flex-col">
          <textarea
            value={extractedText}
            onChange={(e) => handleTextUpdate(e.target.value)}
            className="w-full flex-grow p-4 bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-200 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Extracted text"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
         <button
          onClick={() => resetState(true)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          <ChevronLeftIcon />
          Done
        </button>
        <button
          onClick={handleTakePhotoAgain}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          <CameraIcon />
          Scan with Camera
        </button>
         <button
          onClick={handleUploadAgain}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          <UploadIcon />
          Upload Another
        </button>
      </div>
    </div>
  );

  const renderErrorView = () => (
    <div className="text-center p-6 bg-red-50 border border-red-300 dark:bg-red-900/20 dark:border-red-500 rounded-lg max-w-md mx-auto">
        <ExclamationTriangleIcon />
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Extraction Failed</h2>
        <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
        <button
          onClick={() => resetState(true)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          <ArrowPathIcon />
          Try Again
        </button>
    </div>
  );

  const renderContent = () => {
    switch (status) {
      case AppStatus.INITIAL:
        return renderInitialView();
      case AppStatus.PREVIEW:
        return renderPreviewView();
      case AppStatus.LOADING:
        return renderLoadingView();
      case AppStatus.SUCCESS:
        return renderDetailView();
      case AppStatus.ERROR:
        return renderErrorView();
      default:
        return renderInitialView();
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full h-screen flex items-center justify-center">
        {renderContent()}
      </div>
    </main>
  );
}
