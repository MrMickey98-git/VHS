
import React from 'react';

interface VhsTapeProps {
  videoUrl: string;
  title: string;
}

export const VhsTape: React.FC<VhsTapeProps> = ({ videoUrl, title }) => {
  return (
    <div className="aspect-[1.8] w-full max-w-lg mx-auto bg-[#2a2a2a] p-3 rounded-lg shadow-lg border-t-2 border-gray-600 relative overflow-hidden flex flex-col justify-between">
      {/* Top section with windows */}
      <div className="flex justify-between items-center px-4">
        <div className="w-1/4 h-16 bg-black border border-gray-500 rounded-sm flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
        </div>
        <div className="w-1/4 h-16 bg-black border border-gray-500 rounded-sm flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
        </div>
      </div>

      {/* Main label area */}
      <div className="bg-gray-100 h-1/2 mx-2 p-1 border-2 border-gray-400 flex flex-col items-center justify-center shadow-inner">
         <video 
            src={videoUrl} 
            controls 
            autoPlay 
            loop 
            muted
            className="w-full h-full object-cover"
         />
      </div>

      {/* Bottom spine */}
      <div className="bg-[#e0e0e0] h-10 -mx-3 -mb-3 mt-3 border-t-4 border-gray-500 flex items-center justify-center transform -skew-y-3">
        <p className="text-black font-sans text-xl tracking-widest skew-y-3 uppercase">{title}</p>
      </div>

       {/* Screw details */}
       <div className="absolute top-2 left-2 w-3 h-3 bg-gray-500 rounded-full"></div>
       <div className="absolute top-2 right-2 w-3 h-3 bg-gray-500 rounded-full"></div>
       <div className="absolute bottom-2 left-2 w-3 h-3 bg-gray-500 rounded-full"></div>
       <div className="absolute bottom-2 right-2 w-3 h-3 bg-gray-500 rounded-full"></div>
    </div>
  );
};
