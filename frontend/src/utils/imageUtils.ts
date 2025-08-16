import type { Product } from '../types';

// Check if a URL is expired or broken
export const isImageUrlExpired = (url: string): boolean => {
  // Check if URL contains Google Cloud Storage signed URL parameters
  if (url.includes('X-Goog-Expires')) {
    try {
      const urlObj = new URL(url);
      const expires = urlObj.searchParams.get('X-Goog-Expires');
      const signature = urlObj.searchParams.get('X-Goog-Signature');
      
      if (expires && signature) {
        // Extract the timestamp from the signature generation
        // For Google Cloud signed URLs, we can check if it's likely expired
        // by looking at the URL structure and timing
        const currentTime = Date.now() / 1000;
        const creationTime = parseInt(expires) - (48 * 60 * 60); // 48 hours ago
        
        // If the URL was created more than 46 hours ago, consider it expired/expiring soon
        return (currentTime - creationTime) > (46 * 60 * 60);
      }
    } catch (error) {
      console.warn('Error parsing image URL:', error);
      return true; // Assume expired if we can't parse
    }
  }
  
  return false;
};

// Check if an image URL loads successfully
export const checkImageLoad = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000);
  });
};

// Refresh presigned URLs for a product
export const refreshProductImages = async (product: Product): Promise<Product> => {
  try {
    const response = await fetch(`/api/products/${product._id || product.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch fresh product data');
    }
    
    const data = await response.json();
    return data.data.product;
  } catch (error) {
    console.error('Error refreshing product images:', error);
    return product; // Return original product if refresh fails
  }
};

// Get the best available image URL from a product's images array
export const getBestImageUrl = (images: any[], fallback: string = "/placeholder-product.jpg"): string => {
  if (!Array.isArray(images) || images.length === 0) {
    return fallback;
  }

  const image = images[0];
  
  if (typeof image === "string") {
    return image;
  }
  
  if (typeof image === "object" && image !== null) {
    return image.original || image.medium || image.thumb || fallback;
  }
  
  return fallback;
};

// Check if product images need refreshing and refresh them if needed
export const ensureFreshProductImages = async (product: Product): Promise<Product> => {
  const images = product.images;
  
  if (!Array.isArray(images) || images.length === 0) {
    return product;
  }

  // Check the first image to see if it's expired
  const firstImage = images[0];
  let checkUrl = '';
  
  if (typeof firstImage === 'string') {
    checkUrl = firstImage;
  } else if (typeof firstImage === 'object' && firstImage !== null) {
    checkUrl = firstImage.original || firstImage.medium || firstImage.thumb || '';
  }

  if (checkUrl && isImageUrlExpired(checkUrl)) {
    console.log(`Refreshing expired images for product: ${product.name}`);
    return await refreshProductImages(product);
  }

  // Also check if the image actually loads
  if (checkUrl) {
    const imageLoads = await checkImageLoad(checkUrl);
    if (!imageLoads) {
      console.log(`Refreshing broken images for product: ${product.name}`);
      return await refreshProductImages(product);
    }
  }

  return product;
};
