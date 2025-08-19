import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as companyServices from '../services/companyServices';

export function useCompanies(options = {}) {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => companyServices.getCompanies(),
    ...options,
  });
}

export function useCompanyById(id, options = {}) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => companyServices.getCompanyById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCompanyUsers(companyId, options = {}) {
  return useQuery({
    queryKey: ['company', companyId, 'users'],
    queryFn: () => companyServices.getCompanyUsers(companyId),
    enabled: !!companyId,
    ...options,
  });
}

export function useCompanyExpenses(companyId, options = {}) {
  return useQuery({
    queryKey: ['company', companyId, 'expenses'],
    queryFn: () => companyServices.getCompanyExpenses(companyId),
    enabled: !!companyId,
    ...options,
  });
}

export function useCreateCompany(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyData) => companyServices.createCompany(companyData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.setQueryData(['company', data.id], data);

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}

export function useUpdateCompany(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, companyData }) => companyServices.updateCompany(id, companyData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['company', data.id] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}

export function useDeleteCompany(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => companyServices.deleteCompany(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.removeQueries({ queryKey: ['company', variables] });
      queryClient.removeQueries({ queryKey: ['company', variables, 'users'] });
      queryClient.removeQueries({ queryKey: ['company', variables, 'expenses'] });

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}