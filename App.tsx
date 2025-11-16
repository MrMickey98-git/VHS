
import React, { useState, useCallback, useMemo } from 'react';
import { useVHSProcessor } from './hooks/useVHSProcessor';
import { generateVHSTitle } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { Loader } from './components/Loader';
import { VhsTape } from './components/VhsTape';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [vhsTitle, setVhsTitle] = useState('My Awesome Video');
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { processVideo, isProcessing, processedUrl, progress } = useVHSProcessor();

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setError(null);
      } else {
        setError('Please upload a valid video file.');
        setVideoFile(null);
      }
    }
  };

  const handleGenerateTitle = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a description for the title.');
      return;
    }
    setIsGeneratingTitle(true);
    setError(null);
    try {
      const title = await generateVHSTitle(prompt);
      setVhsTitle(title);
    } catch (e) {
      setError('Could not generate title. Please try again.');
      console.error(e);
    } finally {
      setIsGeneratingTitle(false);
    }
  }, [prompt]);
  
  const handleProcessVideo = useCallback(() => {
    if (videoFile) {
      processVideo(videoFile, vhsTitle);
    } else {
      setError('Please upload a video file first.');
    }
  }, [videoFile, vhsTitle, processVideo]);

  const videoSrc = useMemo(() => {
    if (videoFile) {
      return URL.createObjectURL(videoFile);
    }
    return null;
  }, [videoFile]);

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-[#e0e0e0] flex items-center justify-center p-4 selection:bg-pink-500 selection:text-white">
      <div className="w-full max-w-2xl bg-black border-4 border-[#333] shadow-[8px_8px_0_0_#ff00ff] p-6">
        <header className="text-center mb-6">
          <h1 className="text-5xl text-[#00ffff] tracking-widest animate-pulse">VHS TAPE MAKER</h1>
          <p className="text-[#ff00ff]">CONVERT YOUR MP4S TO 1988</p>
        </header>

        {error && (
          <div className="bg-red-900 border border-red-500 text-white p-2 mb-4 text-center">
            <p>ERROR: {error}</p>
          </div>
        )}

        {!isProcessing && !processedUrl && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-yellow-300 mb-2">&gt; STEP 1: INSERT TAPE (UPLOAD VIDEO)</h2>
              <FileUpload onFileSelect={handleFileChange} />
              {videoSrc && (
                <div className="mt-4 border-2 border-dashed border-gray-600 p-2">
                  <video src={videoSrc} controls className="w-full max-h-60" />
                  <p className="text-center mt-2 text-sm text-gray-400">{videoFile?.name}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl text-yellow-300 mb-2">&gt; STEP 2: CREATE LABEL (OPTIONAL)</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., family vacation to the beach"
                  className="flex-grow bg-[#222] border-2 border-[#444] p-2 focus:outline-none focus:border-[#00ffff]"
                />
                <button
                  onClick={handleGenerateTitle}
                  disabled={isGeneratingTitle}
                  className="bg-pink-600 text-white px-4 py-2 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-wait"
                >
                  {isGeneratingTitle ? 'GENERATING...' : 'GENERATE TITLE W/ AI'}
                </button>
              </div>
              <p className="text-sm mt-2 text-gray-400">Current Title: <span className="text-white">{vhsTitle}</span></p>
            </div>

            <div>
              <h2 className="text-2xl text-yellow-300 mb-2">&gt; STEP 3: RECORD</h2>
              <button
                onClick={handleProcessVideo}
                disabled={!videoFile}
                className="w-full bg-green-600 text-white text-2xl py-4 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                CREATE VHS TAPE
              </button>
            </div>
          </div>
        )}
        
        {isProcessing && (
          <Loader progress={progress} />
        )}

        {processedUrl && (
          <div className="text-center space-y-4">
             <h2 className="text-3xl text-green-400 mb-2 animate-bounce">&gt; RECORDING COMPLETE!</h2>
             <VhsTape videoUrl={processedUrl} title={vhsTitle} />
             <div className="flex justify-center gap-4">
                <a 
                  href={processedUrl} 
                  download={`${vhsTitle.replace(/\s/g, '_')}.webm`}
                  className="bg-blue-600 text-white text-xl px-6 py-3 hover:bg-blue-700"
                >
                  DOWNLOAD .WEBM
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white text-xl px-6 py-3 hover:bg-red-700"
                >
                  MAKE ANOTHER
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
