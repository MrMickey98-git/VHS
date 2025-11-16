
import React, { useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="video/mp4,video/quicktime,video/x-matroska,video/webm"
      />
      <button
        onClick={handleClick}
        className="w-full bg-[#222] border-2 border-dashed border-[#444] p-8 text-center cursor-pointer hover:border-[#00ffff] hover:text-[#00ffff]"
      >
        <span className="text-xl">CLICK TO SELECT VIDEO FILE</span>
        <p className="text-sm text-gray-400 mt-2">.MP4, .MOV, .MKV, .WEBM supported</p>
      </button>
    </div>
  );
};
