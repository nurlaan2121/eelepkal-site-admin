export interface City {
  id: number;
  title: string;
  countClients: number;
  countVenues: number;
}

export interface Cuisine {
  id: number;
  name: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
}

export interface Capacity {
  title: string;
  value: number;
}

export interface SocialLinks {
  instagram?: string;
  whatsapp?: string;
  telegram?: string;
  facebook?: string;
  website?: string;
}
