import { Pin, ApiResponse } from '../types';

const API_BASE = 'https://api-rebix.vercel.app/api/pinterest';

export const fetchPins = async (query: string): Promise<Pin[]> => {
  try {
    // Note: The API might not strictly support pagination via 'page' param 
    // depending on the backend, but we pass it just in case or for caching busting.
    const encodedQuery = encodeURIComponent(query);
    const url = `${API_BASE}?q=${encodedQuery}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    const json: ApiResponse = await res.json();
    
    if (!json.status || !json.data) {
      return [];
    }

    // Sanitize and enhance data
    return json.data.map(item => ({
      ...item,
      // Create a stable ID if missing
      id: item.id || Math.random().toString(36).substr(2, 9),
      // Detect GIF
      isGif: item.image.toLowerCase().endsWith('.gif') || item.image.includes('.gif')
    }));

  } catch (error) {
    console.error("Failed to fetch pins:", error);
    return [];
  }
};