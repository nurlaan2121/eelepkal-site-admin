import {apiClient} from "@/shared/api";
import {
  CreateTableRequest,
  GetTablesParams,
  TableDetail,
  TablesListResponse,
  UpdateTableBasicRequest,
} from "./types";
import {EventType} from "@/shared/types";

export const adminTableService = {
  getAllTables: async (
    params: GetTablesParams,
  ): Promise<TablesListResponse> => {
    const {date, floor = 1, offset = 0, limit = 50} = params;
    const response = await apiClient.get<TablesListResponse>(
      "/api/admin-table/get-all-tables-as-list",
      {
        params: {
          date,
          floor,
          offset,
          limit,
        },
      },
    );
    return response.data;
  },

  addTable: async (data: CreateTableRequest): Promise<void> => {
    await apiClient.post("/api/admin-table/add-new", data);
  },

  addTableImage: async (tableId: number, imageUrl: string): Promise<void> => {
    await apiClient.post(`/api/admin-table/add-image/${tableId}`, null, {
      params: {url: imageUrl},
    });
  },

  deleteTableImage: async (tableId: number, imageId: number): Promise<void> => {
    await apiClient.delete(
      `/api/admin-table/delete-image/${tableId}/${imageId}`,
    );
  },

  getTableById: async (tableId: number): Promise<TableDetail> => {
    const response = await apiClient.get<TableDetail>(
      `/api/admin-table/getTableByIdForUpdate/${tableId}`,
    );
    return response.data;
  },

  getTableEventTypes: async (tableId: number): Promise<EventType> => {
    const response = await apiClient.get<EventType>(
      `/api/admin-table/get-event-types/${tableId}`,
    );
    return response.data;
  },

  getTableServices: async (
    tableId: number,
  ): Promise<{[key: string]: string}> => {
    const response = await apiClient.get<{[key: string]: string}>(
      `/api/admin-table/get-et-services/${tableId}`,
    );
    return response.data;
  },

  updateTableBasic: async (
    tableId: number,
    data: UpdateTableBasicRequest,
  ): Promise<void> => {
    await apiClient.put(`/api/admin-table/update/${tableId}`, data);
  },

  updateTableEventTypes: async (
    tableId: number,
    eventTypeIds: number[],
  ): Promise<void> => {
    const params = new URLSearchParams();
    eventTypeIds.forEach((id) =>
      params.append("eventTypeIdsForAssign", id.toString()),
    );

    await apiClient.put(
      `/api/admin-table/update-event-types/${tableId}?${params.toString()}`,
    );
  },

  updateTableType: async (
    tableId: number,
    eTableTypeId: number,
  ): Promise<void> => {
    await apiClient.put(`/api/admin-table/update-et-type/${tableId}`, null, {
      params: {eTableTypeId},
    });
  },

  updateTableServices: async (
    tableId: number,
    eTableServiceIds: number[],
  ): Promise<void> => {
    const params = new URLSearchParams();
    eTableServiceIds.forEach((id) =>
      params.append("eTableServiceIdsForAssign", id.toString()),
    );

    await apiClient.put(
      `/api/admin-table/update-et-services/${tableId}?${params.toString()}`,
    );
  },

  deleteTable: async (
    tableId: number,
  ): Promise<{httpStatus: string; message: string}> => {
    const response = await apiClient.delete<{
      httpStatus: string;
      message: string;
    }>(`/api/admin-table/delete/${tableId}`);
    return response.data;
  },

  updateTableStatus: async (
    tableId: number,
    date: string,
    action: "OPEN" | "CLOSE",
  ): Promise<void> => {
    await apiClient.put(
      `/api/admin-table/update-status-table/${tableId}`,
      null,
      {
        params: {
          date,
          tableStatusActionRequest: action,
        },
      },
    );
  },
};
