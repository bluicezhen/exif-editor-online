/**
 * Earth constants
 */
const a = 6378245.0; // Earth's semi-major axis
const ee = 0.00669342162296594323; // Earth's eccentricity squared

/**
 * Simple boundary check for mainland China
 * 
 * This is a simplified check that covers most of mainland China.
 * More precise boundary detection would require a comprehensive geofence.
 * 
 * @param lat - Latitude to check
 * @param lon - Longitude to check
 * @returns true if coordinates are likely in mainland China
 */
function isInChina(lat: number, lon: number): boolean {
  // Rough bounding box for mainland China
  // These are approximate values that cover most of mainland China
  return lat >= 18.0 && lat <= 53.0 && lon >= 73.0 && lon <= 135.0;
}

/**
 * Transform WGS84 coordinates to GCJ02
 * 
 * This transformation is only applied for coordinates within mainland China.
 * For coordinates outside China, the original coordinates are returned.
 * 
 * @param wgsLat - Latitude in WGS84
 * @param wgsLon - Longitude in WGS84
 * @returns [gcjLat, gcjLon] - Coordinates in GCJ02
 */
export function transformWGS84ToGCJ02(wgsLat: number, wgsLon: number): [number, number] {
  // Return original coordinates if not in mainland China
  if (!isInChina(wgsLat, wgsLon)) {
    return [wgsLat, wgsLon];
  }

  // Apply offset calculation
  const dLat = calculateLatOffset(wgsLon - 105.0, wgsLat - 35.0);
  const dLon = calculateLonOffset(wgsLon - 105.0, wgsLat - 35.0);
  
  // Calculate radians for the magic formula
  const radLat = wgsLat / 180.0 * Math.PI;
  const magic = Math.sin(radLat);
  const sqrtMagic = Math.sqrt(1 - ee * magic * magic);
  
  // Apply magic formula for offsets
  const dLatMagic = (dLat * 180.0) / ((a * (1 - ee)) / (sqrtMagic * sqrtMagic * sqrtMagic) * Math.PI);
  const dLonMagic = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  
  // Return GCJ02 coordinates
  const gcjLat = wgsLat + dLatMagic;
  const gcjLon = wgsLon + dLonMagic;
  
  return [gcjLat, gcjLon];
}

/**
 * Calculate latitude offset
 * 
 * @param x - Normalized longitude (lon - 105.0)
 * @param y - Normalized latitude (lat - 35.0)
 * @returns Latitude offset
 */
function calculateLatOffset(x: number, y: number): number {
  // Polynomial coefficients for latitude offset
  return -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 
         0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x)) +
         (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0 +
         (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0 +
         (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
}

/**
 * Calculate longitude offset
 * 
 * @param x - Normalized longitude (lon - 105.0)
 * @param y - Normalized latitude (lat - 35.0)
 * @returns Longitude offset
 */
function calculateLonOffset(x: number, y: number): number {
  // Polynomial coefficients for longitude offset
  return 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y +
         0.1 * Math.sqrt(Math.abs(x)) +
         (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0 +
         (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0 +
         (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
} 