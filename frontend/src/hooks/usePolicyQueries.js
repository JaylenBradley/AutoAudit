import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as policyServices from '../services/policyServices';

export function usePolicies(options = {}) {
  return useQuery({
    queryKey: ['policies'],
    queryFn: () => policyServices.getPolicies(),
    ...options,
  });
}

export function usePolicyById(id, options = {}) {
  return useQuery({
    queryKey: ['policy', id],
    queryFn: () => policyServices.getPolicyById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreatePolicy(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policyData) => policyServices.createPolicy(policyData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      queryClient.setQueryData(['policy', data.id], data);

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}

export function useUpdatePolicy(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, policyData }) => policyServices.updatePolicy(id, policyData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['policy', data.id] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}

export function useDeletePolicy(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => policyServices.deletePolicy(id),
    onSuccess: (data, variables) => {
      // Variables is the id we passed to the mutation
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      queryClient.removeQueries({ queryKey: ['policy', variables] });

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}