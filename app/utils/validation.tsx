import { useEffect, useState } from "react";
import Image from 'next/image';

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidImageUrl = async (url: string): Promise<boolean> => {
  if (!isValidUrl(url)) return false;

  // Validation des extensions d'image
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );

  if (!hasImageExtension) return false;

  try {
    // Validation asynchrone de l'image
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) return false;

    const contentType = response.headers.get('content-type');
    return contentType ? contentType.startsWith('image/') : false;
  } catch {
    return false;
  }
};

export const isValidImageUrlSync = (url: string): boolean => {
  if (!isValidUrl(url)) return false;

  // Validation basique des schémas et extensions
  const validSchemes = ['http://', 'https://', '/'];
  const hasValidScheme = validSchemes.some(scheme => url.startsWith(scheme));
  
  if (!hasValidScheme) return false;

  // Validation des extensions d'image
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  return imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
};

// Composant Image sécurisé
interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, width = 300, height = 300 }) => {
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkImage = async () => {
      try {
        setIsLoading(true);
        const valid = await isValidImageUrl(src);
        setIsValid(valid);
      } catch {
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (src) {
      checkImage();
    } else {
      setIsValid(false);
      setIsLoading(false);
    }
  }, [src]);

  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-xs">Chargement...</div>
      </div>
    );
  }

  if (!isValid || !src) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-xs">Image non disponible</div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setIsValid(false)}
    />
  );
};