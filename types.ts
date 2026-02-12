export interface Pin {
  id: string;
  title: string;
  description: string;
  pin_url: string;
  image: string; // The URL to the image (could be GIF)
  uploader: {
    username: string;
    full_name: string;
    profile_url: string;
  };
  isGif?: boolean;
}

export interface ApiResponse {
  status: boolean;
  creator: string;
  data: Pin[];
}

export interface Collection {
  id: string;
  name: string;
  pins: Pin[];
}

export type SortOption = 'newest' | 'az' | 'shuffle';
export type FilterOption = 'all' | 'image' | 'gif';
