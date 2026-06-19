// Admin Menu
export interface MenuCategorySimple {
  id: number;
  name: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  count?: number;
}

export interface MenuUnit {
  id: number;
  name: string;
}

// Admin Table
export interface TableType {
  [key: string]: number;
}

export interface TableAmenity {
  id: number;
  title: string;
}


