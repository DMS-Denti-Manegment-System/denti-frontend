// src/modules/admin/services/companyApi.ts

import { api } from '../../../shared/services/api';
import { 
  Company, 
  CompanyStorePayload, 
  CompanyUpdatePayload, 
  CompanyStoreResponse 
} from '../types/company.types';

export const companyApi = {
  getCompanies: (): Promise<{ data: Company[] }> => 
    api.get('/admin/companies'),

  getCompany: (id: number): Promise<{ data: Company }> => 
    api.get(`/admin/companies/${id}`),

  createCompany: (payload: CompanyStorePayload): Promise<CompanyStoreResponse> => 
    api.post('/admin/companies', payload),

  updateCompany: (id: number, payload: CompanyUpdatePayload): Promise<{ data: Company; success: boolean }> => 
    api.put(`/admin/companies/${id}`, payload),

  deleteCompany: (id: number): Promise<{ success: boolean }> => 
    api.delete(`/admin/companies/${id}`),
};
