/**
 * AMap configuration
 * Map API keys and configuration settings
 * 
 * You can configure these values via environment variables:
 * - VITE_AMAP_API_KEY
 * - VITE_AMAP_SECURITY_JS_CODE
 */
export const mapConfig = {
  // AMap security code for Web API
  // In production, set VITE_AMAP_SECURITY_JS_CODE environment variable
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_JS_CODE || '你的安全密钥',
  
  // AMap API key
  // In production, set VITE_AMAP_API_KEY environment variable
  apiKey: import.meta.env.VITE_AMAP_API_KEY || '你的API密钥',
  
  // AMap API version
  apiVersion: '2.0',
  
  // Default plugins to load
  plugins: ['AMap.Scale', 'AMap.ToolBar']
}

export default mapConfig 