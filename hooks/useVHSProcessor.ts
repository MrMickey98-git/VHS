import { useState, useCallback } from 'react';

export const useVHSProcessor = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const processVideo = useCallback(async (file: File, vhsTitle: string) => {
        setIsProcessing(true);
        setProgress(0);
        setProcessedUrl(null);

        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.muted = true;

        video.oncanplay = () => {
            const MAX_WIDTH = 480; // To improve performance, we'll process at a lower resolution
            const aspectRatio = video.videoWidth / video.videoHeight;

            const canvas = document.createElement('canvas');
            canvas.width = Math.min(video.videoWidth, MAX_WIDTH);
            canvas.height = canvas.width / aspectRatio;

            if (canvas.width === 0 || canvas.height === 0) {
                console.error("Video dimensions are zero, cannot process.");
                setIsProcessing(false);
                // Ideally, notify the user with an error message in the UI
                return;
            }

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            const stream = canvas.captureStream(30);
            // Use vp8 for wider compatibility and potentially faster encoding than vp9
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8' });
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setProcessedUrl(url);
                setIsProcessing(false);
                URL.revokeObjectURL(video.src);
            };

            recorder.start();
            video.play();
            
            const date = new Date();
            const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][date.getMonth()];
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            const timestamp = `${month} ${day} ${year}`;

            let frameCount = 0;

            const renderFrame = () => {
                if (video.paused || video.ended) {
                    recorder.stop();
                    return;
                }

                // Apply base VHS look directly when drawing video to canvas
                ctx.filter = 'blur(0.5px) saturate(0.7) contrast(1.2)';
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.filter = 'none';

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Add noise
                for (let i = 0; i < data.length; i += 4) {
                    const noise = (Math.random() - 0.5) * 35; // slightly reduced noise intensity
                    data[i] = Math.max(0, Math.min(255, data[i] + noise));
                    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
                    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
                }
                ctx.putImageData(imageData, 0, 0);
                
                // Chromatic Aberration
                ctx.globalCompositeOperation = 'lighter';
                const offset = 1.5;
                ctx.drawImage(canvas, -offset, 0);
                ctx.drawImage(canvas, offset, 0);
                ctx.globalCompositeOperation = 'source-over';


                // Scanlines
                for (let y = 0; y < canvas.height; y += 3) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                    ctx.fillRect(0, y, canvas.width, 1);
                }

                // Glitches
                if (Math.random() > 0.95) {
                    const glitchHeight = Math.max(1, Math.floor(Math.random() * 50));
                    if (canvas.height > glitchHeight) {
                        const glitchY = Math.random() * (canvas.height - glitchHeight);
                        const glitchData = ctx.getImageData(0, glitchY, canvas.width, glitchHeight);
                        ctx.putImageData(glitchData, (Math.random() * 20 - 10) * (canvas.width / MAX_WIDTH), glitchY);
                    }
                }

                // OSD (On-Screen Display)
                const fontSize = Math.max(18, Math.floor(canvas.width / 25));
                ctx.font = `${fontSize}px VT323`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.textBaseline = 'top';
                ctx.fillText('PLAY', 15, 15);
                
                const timestampText = timestamp;
                const textWidth = ctx.measureText(timestampText).width;
                ctx.fillText(timestampText, canvas.width - textWidth - 15, 15);

                // Blinking REC icon
                const iconSize = Math.max(6, Math.floor(canvas.width / 60));
                ctx.fillStyle = frameCount % 30 < 15 ? 'red' : 'darkred';
                ctx.beginPath();
                ctx.arc(canvas.width - iconSize - 15, 15 + fontSize / 2, iconSize, 0, Math.PI * 2);
                ctx.fill();


                setProgress((video.currentTime / video.duration) * 100);
                frameCount++;
                requestAnimationFrame(renderFrame);
            };

            renderFrame();
        };

        video.onerror = () => {
            setIsProcessing(false);
            // In a real app, you would pass an error message back to the UI.
            console.error("Error loading video.");
        };

    }, []);

    return { processVideo, isProcessing, processedUrl, progress };
};
