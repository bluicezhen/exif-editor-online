<script setup lang="ts">
import { ref, onUnmounted, onBeforeMount, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import mapConfig from '../utils/mapConfig'
import { transformWGS84ToGCJ02 } from '../utils/coordinateTransform'

// Define props interface
interface Props {
  // Photos with GPS data to display on map
  photosWithGps: Array<{
    photoId: string;
    exifData: {
      latitude?: number;
      longitude?: number;
      GPSLatitude?: number[];
      GPSLongitude?: number[];
      [key: string]: any;
    }
  }>;
}

// Declare props with validation
const props = defineProps<Props>();

// AMap instance reference
let map: any = null;
let markers: any[] = [];

// Flag to track if map is initialized
const isMapInitialized = ref(false);

/**
 * Initialize AMap and update markers based on GPS data
 */
function initMap() {
  if (!props.photosWithGps?.length) return;
  
  if (map) {
    // Clear existing markers
    if (markers.length) {
      map.remove(markers);
      markers = [];
    }
    
    // Update map with new markers
    addMarkersToMap();
    return;
  }
  
  // Set AMap security config
  window._AMapSecurityConfig = {
    securityJsCode: mapConfig.securityJsCode,
  };

  // Load AMap
  AMapLoader.load({
    key: mapConfig.apiKey,
    version: mapConfig.apiVersion,
    plugins: mapConfig.plugins,
  })
    .then((AMap) => {
      // Create map instance
      map = new AMap.Map('map-container', {
        viewMode: '2D',
        zoom: 13,
        center: getCenterCoordinates(),
        canvas: {
          willReadFrequently: true
        }
      });
      
      // Add map controls
      map.addControl(new AMap.Scale());
      map.addControl(new AMap.ToolBar());
      
      // Add markers for photos with GPS data
      addMarkersToMap(AMap);
      
      // Set initialization flag
      isMapInitialized.value = true;
    })
    .catch((e) => {
      console.error('Failed to load AMap:', e);
    });
}

/**
 * Calculate center coordinates based on all GPS coordinates
 * @returns [longitude, latitude] coordinates for map center
 */
function getCenterCoordinates() {
  if (!props.photosWithGps?.length) return [116.397428, 39.90923]; // Default to Beijing
  
  const validCoordinates = props.photosWithGps
    .filter((item) => 
      item?.exifData?.latitude !== undefined && 
      item?.exifData?.longitude !== undefined
    )
    .map((item) => {
      // TypeScript safety: We already filtered for existence above
      const longitude = item.exifData.longitude!;
      const latitude = item.exifData.latitude!;
      
      // Transform WGS84 to GCJ02 for Chinese mainland coordinates
      const [gcjLat, gcjLon] = transformWGS84ToGCJ02(latitude, longitude);
      
      return [gcjLon, gcjLat];
    });
  
  if (!validCoordinates.length) return [116.397428, 39.90923];
  
  // Calculate average coordinates
  const sum = validCoordinates.reduce(
    (acc: number[], coord: number[]) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0]
  );
  
  return [
    sum[0] / validCoordinates.length,
    sum[1] / validCoordinates.length
  ];
}

/**
 * Add markers to the map for each photo with GPS data
 * @param AMap Optional AMap instance (used during initialization)
 */
function addMarkersToMap(AMap?: any) {
  if (!map) return;
  
  const AMapInstance = AMap || window.AMap;
  
  const validPhotos = props.photosWithGps.filter((item) => 
    item?.exifData?.latitude !== undefined && 
    item?.exifData?.longitude !== undefined
  );
  
  if (!validPhotos.length) return;
  
  markers = validPhotos.map((item) => {
    // TypeScript safety: We already filtered for existence above
    const longitude = item.exifData.longitude!;
    const latitude = item.exifData.latitude!;
    
    // Transform WGS84 to GCJ02 for Chinese mainland coordinates
    const [gcjLat, gcjLon] = transformWGS84ToGCJ02(latitude, longitude);

    const marker = new AMapInstance.Marker({
      position: [gcjLon, gcjLat],
      title: item.photoId,
    });
    
    map.add(marker);
    return marker;
  });
  
  // If we have only one marker, center on it
  if (markers.length === 1) {
    map.setCenter(markers[0].getPosition());
  }
  
  // If we have multiple markers, fit view to include all
  if (markers.length > 1) {
    map.setFitView(markers);
  }
}

// Clean up map instance when component is unmounted
onUnmounted(() => {
  if (map) {
    map.destroy();
    map = null;
    markers = [];
    isMapInitialized.value = false;
  }
});

// Add Canvas performance optimization configuration before component mounting
onBeforeMount(() => {
  // Add global styles to handle touch behavior
  const style = document.createElement('style');
  style.textContent = `
    canvas.amap-layer {
      touch-action: none;
      -ms-touch-action: none;
    }
  `;
  document.head.appendChild(style);
  
  // Add script to patch Canvas creation
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      // Save original Canvas creation methods
      const originalHTMLCanvasElementPrototype = window.HTMLCanvasElement.prototype;
      const originalGetContext = originalHTMLCanvasElementPrototype.getContext;
      
      // Replace with method supporting willReadFrequently attribute
      originalHTMLCanvasElementPrototype.getContext = function(type, attributes) {
        attributes = attributes || {};
        if (type === '2d') {
          attributes.willReadFrequently = true;
        }
        return originalGetContext.call(this, type, attributes);
      };
    })();
  `;
  document.head.appendChild(script);
});

// Watch for changes in photos with GPS data and update map
watch(() => props.photosWithGps, () => {
  // Initialize or update map when photos change
  setTimeout(() => {
    initMap();
  }, 0);
}, { immediate: true, deep: true });

// Declare AMap types for TypeScript
declare global {
  interface Window {
    _AMapSecurityConfig: {
      securityJsCode: string
    };
    AMap: any;
  }
}
</script>

<template>
  <div class="map-container-wrapper">
    <div id="map-container" class="map-container"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/abstracts' as *;

/* Map container styling with 4:3 aspect ratio */
.map-container-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  margin-bottom: $spacing-base;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: $border-radius;
  overflow: hidden;
}
</style> 