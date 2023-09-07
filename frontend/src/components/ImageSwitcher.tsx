import React, { useState, useEffect, useRef } from "react";

interface ImageSwitcherProps {
  compressedUrl: string;
  fullUrl: string;
  className?: string;
}

const ImageSwitcher: React.FC<ImageSwitcherProps> = ({
  compressedUrl,
  fullUrl,
  className,
}) => {
  const [displayFullImage, setDisplayFullImage] = useState(false);
  const fullImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const handleFullImageLoad = () => {
      if (fullImageRef.current && fullImageRef.current.complete) {
        setDisplayFullImage(true);
      }
    };

    if (fullImageRef.current) {
      if (fullImageRef.current.complete) {
        setDisplayFullImage(true);
      } else {
        fullImageRef.current.addEventListener("load", handleFullImageLoad);
      }
    }

    return () => {
      if (fullImageRef.current) {
        fullImageRef.current.removeEventListener("load", handleFullImageLoad);
      }
    };
  }, []);

  return (
    <>
      <img
        className={className}
        src={compressedUrl}
        alt="Compressed Image"
        style={{ display: displayFullImage ? "none" : "block" }}
      />
      <img
        className={className}
        ref={fullImageRef}
        src={fullUrl}
        alt="Full Image"
        style={{ display: displayFullImage ? "block" : "none" }}
      />
    </>
  );
};

export default ImageSwitcher;
