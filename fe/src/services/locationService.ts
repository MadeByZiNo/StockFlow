import api from "./api"; 
import { LocationResponse, LocationRequest, LocationDetailResponse } from '../types/location';
import { PageResponse } from '../types/page';
export interface LocationSearchCriteria {
    centerName?: string;
    zone?: string;
    isActive?: boolean;
}

export const locationService = {

    async searchLocations(
        criteria: LocationSearchCriteria, 
        page: number = 0, 
        size: number = 10
    ): Promise<PageResponse<LocationResponse>> {
        const response = await api.get<PageResponse<LocationResponse>>(`/api/locations`, {
            params: { 
                ...criteria,
                page, 
                size, 
                sort: 'centerName,asc' 
            }
        });
        return response.data;
    },

    async createLocation(data: LocationRequest): Promise<LocationResponse> {
        const response = await api.post<LocationResponse>('/api/locations', data);
        return response.data;
    },

    async updateLocation(id: number, data: LocationRequest): Promise<LocationResponse> {
        const response = await api.put<LocationResponse>(`/api/locations/${id}`, data);
        return response.data;
    },

    async getLocationDetail(id: number): Promise<LocationDetailResponse> {
        const response = await api.get<LocationDetailResponse>(`/api/locations/${id}`);
        return response.data;
    },
    
    async toggleLocationActivation(id: number): Promise<LocationResponse> {
        const response = await api.patch<LocationResponse>(`/api/locations/${id}/toggle-active`);
        return response.data;
    },


   async fetchAllCenterNames(): Promise<string[]> {
        try {
            const response = await api.get<string[]>('/api/locations/center-names');
            return response.data;
        } catch (error) {
            console.error('Error fetching center names:', error);
            return [];
        }
    },

    async fetchZonesByCenterName(centerName: string): Promise<string[]> {
        if (!centerName || centerName === 'all') {
            return [];
        }
        
        try {
            const response = await api.get<string[]>('/api/locations/zones-by-center', {
                params: {
                    centerName: centerName
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching zones for center ${centerName}:`, error);
            return [];
        }
    },

   getLocationsBinCode: async (criteria: LocationSearchCriteria): Promise<PageResponse<Location>> => {
        const defaultCriteria = { 
            size: 1000, 
            page: 0 
        }; 
        const response = await api.get(`/api/locations/bin`, {
            params: { 
                ...defaultCriteria,
                zone: criteria.zone, 
                centerName: criteria.centerName,
            },
        });
        
        return response.data;
    }
    
};