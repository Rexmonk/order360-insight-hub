
import apiClient from './apiClient';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Order } from '@/types/order';

// Generic type for CRUD operations
interface CrudOptions<T = any, R = any> {
  endpoint: string;
  data?: T;
  id?: string | number;
  params?: Record<string, any>;
  config?: AxiosRequestConfig;
}

// CRUD service with strongly typed methods
export const crudService = {
  // GET request
  get: async <T = any>({ 
    endpoint, 
    id = '', 
    params = {}, 
    config = {} 
  }: CrudOptions): Promise<T> => {
    const url = id ? `${endpoint}/${id}` : endpoint;
    const response: AxiosResponse<T> = await apiClient.get(url, { 
      params, 
      ...config 
    });
    return response.data;
  },
  
  // POST request for creating resources
  create: async <T = any, R = any>({ 
    endpoint, 
    data, 
    config = {} 
  }: CrudOptions<T>): Promise<R> => {
    const response: AxiosResponse<R> = await apiClient.post(endpoint, data, config);
    return response.data;
  },
  
  // PUT request for replacing resources
  update: async <T = any, R = any>({ 
    endpoint, 
    id, 
    data, 
    config = {} 
  }: CrudOptions<T>): Promise<R> => {
    const url = id ? `${endpoint}/${id}` : endpoint;
    const response: AxiosResponse<R> = await apiClient.put(url, data, config);
    return response.data;
  },
  
  // PATCH request for partial updates
  patch: async <T = any, R = any>({ 
    endpoint, 
    id, 
    data, 
    config = {} 
  }: CrudOptions<T>): Promise<R> => {
    const url = id ? `${endpoint}/${id}` : endpoint;
    const response: AxiosResponse<R> = await apiClient.patch(url, data, config);
    return response.data;
  },
  
  // DELETE request
  delete: async <R = any>({ 
    endpoint, 
    id, 
    config = {} 
  }: CrudOptions): Promise<R> => {
    const url = id ? `${endpoint}/${id}` : endpoint;
    const response: AxiosResponse<R> = await apiClient.delete(url, config);
    return response.data;
  },
  
  // Custom request for more complex scenarios
  custom: async <T = any, R = any>({ 
    endpoint, 
    data, 
    config = {} 
  }: CrudOptions<T>): Promise<R> => {
    const response: AxiosResponse<R> = await apiClient(
      { url: endpoint, data, ...config }
    );
    return response.data;
  }
};

// Example of a typed service for a specific resource
export const createResourceService = <T, R = T>(resourceEndpoint: string) => {
  return {
    getAll: (params?: Record<string, any>, config?: AxiosRequestConfig) => 
      crudService.get<T[]>({ endpoint: resourceEndpoint, params, config }),
    
    getById: (id: string | number, config?: AxiosRequestConfig) => 
      crudService.get<T>({ endpoint: resourceEndpoint, id, config }),
    
    create: (data: T, config?: AxiosRequestConfig) => 
      crudService.create<T, R>({ endpoint: resourceEndpoint, data, config }),
    
    update: (id: string | number, data: Partial<T>, config?: AxiosRequestConfig) => 
      crudService.update<Partial<T>, R>({ endpoint: resourceEndpoint, id, data, config }),
    
    patch: (id: string | number, data: Partial<T>, config?: AxiosRequestConfig) => 
      crudService.patch<Partial<T>, R>({ endpoint: resourceEndpoint, id, data, config }),
    
    delete: (id: string | number, config?: AxiosRequestConfig) => 
      crudService.delete<R>({ endpoint: resourceEndpoint, id, config })
  };
};

// Example of creating a typed service for orders
export const orderService = createResourceService<Order>('/orders');
