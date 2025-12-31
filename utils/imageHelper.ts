
export const compressImage = (file: File, maxWidth: number): Promise<{ base64: string; mimeType: string; }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
  
      reader.onload = (e) => {
        if (typeof e.target?.result !== 'string') {
          return reject(new Error('FileReader did not return a string.'));
        }
        img.src = e.target.result;
      };
      
      reader.onerror = (error) => reject(error);
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (!ctx) {
          return reject(new Error('Could not get canvas context.'));
        }
  
        let { width, height } = img;
  
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
  
        canvas.width = width;
        canvas.height = height;
  
        ctx.drawImage(img, 0, 0, width, height);
        
        // Use JPEG for better compression of photos
        const mimeType = 'image/jpeg';
        const base64 = canvas.toDataURL(mimeType, 0.85); // 0.85 is a good quality/size balance
  
        resolve({ base64, mimeType });
      };

      img.onerror = (error) => reject(error);
  
      reader.readAsDataURL(file);
    });
  };
