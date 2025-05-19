
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions, QueryClient } from '@tanstack/react-query';
import { crudService, createResourceService } from '@/services/crudService';
import { toast } from 'sonner';
import type { Order } from '@/types/order';

// Initialize query client for global use
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Type for API error response
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Type for API response with pagination
export interface ApiPaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// Hook for GET operations
export const useApiQuery = <T>(
  queryKey: string | string[],
  endpoint: string,
  id?: string | number,
  params?: Record<string, any>,
  options?: UseQueryOptions<T, ApiError>
) => {
  const queryKeyArray = Array.isArray(queryKey) ? queryKey : [queryKey];
  
  return useQuery<T, ApiError>({
    queryKey: queryKeyArray,
    queryFn: async () => {
      return crudService.get<T>({ endpoint, id, params });
    },
    ...options,
  });
};

// Hook for GET operations with pagination
export const useApiPaginatedQuery = <T>(
  queryKey: string | string[],
  endpoint: string,
  params?: Record<string, any>,
  options?: UseQueryOptions<ApiPaginatedResponse<T>, ApiError>
) => {
  const queryKeyArray = Array.isArray(queryKey) ? queryKey : [queryKey];
  
  return useQuery<ApiPaginatedResponse<T>, ApiError>({
    queryKey: queryKeyArray,
    queryFn: async () => {
      return crudService.get<ApiPaginatedResponse<T>>({ endpoint, params });
    },
    ...options,
  });
};

// Hook for POST operations
export const useApiCreate = <T, R = T>(
  endpoint: string,
  options?: UseMutationOptions<R, ApiError, T>
) => {
  return useMutation<R, ApiError, T>({
    mutationFn: async (data: T) => {
      return crudService.create<T, R>({ endpoint, data });
    },
    ...options,
  });
};

// Hook for PUT operations
export const useApiUpdate = <T, R = T>(
  endpoint: string,
  id?: string | number,
  options?: UseMutationOptions<R, ApiError, T>
) => {
  return useMutation<R, ApiError, T>({
    mutationFn: async (data: T) => {
      return crudService.update<T, R>({ endpoint, id, data });
    },
    ...options,
  });
};

// Hook for PATCH operations
export const useApiPatch = <T, R = T>(
  endpoint: string,
  id?: string | number,
  options?: UseMutationOptions<R, ApiError, Partial<T>>
) => {
  return useMutation<R, ApiError, Partial<T>>({
    mutationFn: async (data: Partial<T>) => {
      return crudService.patch<Partial<T>, R>({ endpoint, id, data });
    },
    ...options,
  });
};

// Hook for DELETE operations
export const useApiDelete = <R = void>(
  endpoint: string,
  options?: UseMutationOptions<R, ApiError, string | number>
) => {
  return useMutation<R, ApiError, string | number>({
    mutationFn: async (id: string | number) => {
      return crudService.delete<R>({ endpoint, id });
    },
    ...options,
  });
};

// Factory function to create a set of hooks for a specific resource
export const createApiHooks = <T, R = T>(resourceEndpoint: string) => {
  const service = createResourceService<T, R>(resourceEndpoint);
  
  return {
    useGetAll: (params?: Record<string, any>, options?: UseQueryOptions<T[], ApiError>) => 
      useApiQuery<T[]>([resourceEndpoint, JSON.stringify(params)], resourceEndpoint, undefined, params, options),
    
    useGetAllPaginated: (params?: Record<string, any>, options?: UseQueryOptions<ApiPaginatedResponse<T>, ApiError>) => 
      useApiPaginatedQuery<T>([resourceEndpoint, JSON.stringify(params)], resourceEndpoint, params, options),
    
    useGetById: (id: string | number, options?: UseQueryOptions<T, ApiError>) => 
      useApiQuery<T>([resourceEndpoint, String(id)], resourceEndpoint, id, undefined, options),
    
    useCreate: (options?: UseMutationOptions<R, ApiError, T>) => 
      useApiCreate<T, R>(resourceEndpoint, {
        onSuccess: () => {
          toast.success('Successfully created');
          queryClient.invalidateQueries({ queryKey: [resourceEndpoint] });
        },
        onError: (error) => {
          toast.error(`Error creating: ${error.message}`);
        },
        ...options,
      }),
    
    useUpdate: (id: string | number, options?: UseMutationOptions<R, ApiError, T>) => 
      useApiUpdate<T, R>(resourceEndpoint, id, {
        onSuccess: () => {
          toast.success('Successfully updated');
          queryClient.invalidateQueries({ queryKey: [resourceEndpoint, String(id)] });
          queryClient.invalidateQueries({ queryKey: [resourceEndpoint] });
        },
        onError: (error) => {
          toast.error(`Error updating: ${error.message}`);
        },
        ...options,
      }),
    
    usePatch: (id: string | number, options?: UseMutationOptions<R, ApiError, Partial<T>>) => 
      useApiPatch<T, R>(resourceEndpoint, id, {
        onSuccess: () => {
          toast.success('Successfully updated');
          queryClient.invalidateQueries({ queryKey: [resourceEndpoint, String(id)] });
          queryClient.invalidateQueries({ queryKey: [resourceEndpoint] });
        },
        onError: (error) => {
          toast.error(`Error updating: ${error.message}`);
        },
        ...options,
      }),
    
    useDelete: (options?: UseMutationOptions<R, ApiError, string | number>) => 
      useApiDelete<R>(resourceEndpoint, {
        onSuccess: () => {
          toast.success('Successfully deleted');
          queryClient.invalidateQueries({ queryKey: [resourceEndpoint] });
        },
        onError: (error) => {
          toast.error(`Error deleting: ${error.message}`);
        },
        ...options,
      }),
  };
};

// Example of creating API hooks for orders
export const useOrderApi = createApiHooks<Order>('/orders');
