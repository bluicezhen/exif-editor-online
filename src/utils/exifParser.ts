import PQueue from 'p-queue';
import * as exifr from 'exifr';

// Interface for parse result
export interface ExifParseResult {
  photoId: string;
  exifData: any;
}

// Interface for progress tracking
export interface ParseProgressInfo {
  total: number;
  completed: number;
  inProgress: number;
}

/**
 * Parse EXIF data from photos with concurrency control
 */
export async function parseExifFromPhotos(
  photos: Array<{ id: string; url: string; name: string }>,
  onProgress?: (progress: ParseProgressInfo) => void,
): Promise<ExifParseResult[]> {
  // Create queue with concurrency based on CPU cores
  const concurrency = navigator.hardwareConcurrency || 4;
  const queue = new PQueue({ concurrency });
  
  const results: ExifParseResult[] = [];
  let completed = 0;
  const total = photos.length;
  
  // Update progress function
  const updateProgress = () => {
    if (onProgress) {
      onProgress({
        total,
        completed,
        inProgress: queue.size,
      });
    }
  };
  
  // Initial progress update
  updateProgress();
  
  // Create parsing tasks for each photo
  const parsePromises = photos.map(photo => {
    return queue.add(async () => {
      try {
        // Parse EXIF data from the photo
        const exifData = await exifr.parse(photo.url);
        
        // Store result
        const result: ExifParseResult = {
          photoId: photo.id,
          exifData,
        };
        
        results.push(result);
        
        // Log parsed data to console
        console.log(`Parsed EXIF for photo ${photo.name}:`, exifData);
        
        // Update progress
        completed++;
        updateProgress();
        
        return result;
      } catch (error) {
        console.error(`Error parsing EXIF for photo ${photo.name}:`, error);
        
        // Still count as completed for progress tracking
        completed++;
        updateProgress();
        
        return {
          photoId: photo.id,
          exifData: null,
        };
      }
    });
  });
  
  // Wait for all parsing tasks to complete
  await Promise.all(parsePromises);
  
  return results;
} 