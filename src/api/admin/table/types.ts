export interface TableResponse {
  etableId: number;
  tableTitle: string;
  tableType: string;
  capacity: string;
  tableStatus: "OPEN" | "BUSY" | "RSVN" | string;
}

export interface TableDetail {
  images: {
    [imageId: string]: string; // key is imageId, value is imageUrl
  };
  capacity: string;
  title: string;
  inFloor: number;
  price: string;
  description: string;
  amenities: string[];
  eventTypes: string[];
  etableId: number;
  etableType: string;
}

export interface TablesListResponse {
  tableGetAllResponses: TableResponse[];
  countOpen: number;
  countBusy: number;
  countWaiting: number;
}

export interface GetTablesParams {
  date: string;
  floor?: number;
  offset?: number;
  limit?: number;
}

export interface CreateTableRequest {
  inFloor: number;
  tableTypeId: number;
  imageUrls: string[];
  title: string;
  capacityMin: number;
  capacityMax: number;
  deposit: string;
  description: string;
  tableAmenitiesIds: number[];
  eventTypeIds: number[];
}

export interface UpdateTableBasicRequest {
  inFloor: number;
  title: string;
  capacityMin: number;
  capacityMax: number;
  deposit: string;
  description: string;
}
