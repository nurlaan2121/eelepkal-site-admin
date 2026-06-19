export interface MenuItemFull {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  addressVenue: string;
  unit: string;
  value: string;
  favorite: boolean;
}

export interface CreateMenuRequest {
  imageUrl: string;
  categoryId: number;
  title: string;
  description: string;
  price: number;
  meaning: string;
  unitAsEnumId: number;
}
export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface MenuResponse {
  totalMenus: number;
  getMenuResponse: MenuItem[];
}
export type MenuStatus = "ACTIVE" | "INACTIVE" | "DELETED";
