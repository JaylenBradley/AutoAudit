import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as expenseServices from '../services/expenseServices';

export function useExpenses(options = {}) {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: () => expenseServices.getExpenses(),
    ...options,
  });
}

export function useExpenseById(id, options = {}) {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: () => expenseServices.getExpenseById(id),
    enabled: !!id,
    ...options,
  });
}

export function useUserExpenses(userId, options = {}) {
  return useQuery({
    queryKey: ['user', userId, 'expenses'],
    queryFn: () => expenseServices.getUserExpenses(userId),
    enabled: !!userId,
    ...options,
  });
}

export function useFlaggedExpenses(options = {}) {
  return useQuery({
    queryKey: ['expenses', 'flagged'],
    queryFn: () => expenseServices.getFlaggedExpenses(),
    ...options,
  });
}

export function useUserFlaggedExpenses(userId, options = {}) {
  return useQuery({
    queryKey: ['user', userId, 'expenses', 'flagged'],
    queryFn: () => expenseServices.getUserFlaggedExpenses(userId),
    enabled: !!userId,
    ...options,
  });
}

export function useCreateExpense(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData) => expenseServices.createExpense(expenseData),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.user_id, 'expenses'] });

      // If the expense is flagged, invalidate flagged expenses
      if (data.flagged) {
        queryClient.invalidateQueries({ queryKey: ['expenses', 'flagged'] });
        queryClient.invalidateQueries({ queryKey: ['user', data.user_id, 'expenses', 'flagged'] });
      }

      // If the user belongs to a company, invalidate company expenses
      if (data.company_id) {
        queryClient.invalidateQueries({ queryKey: ['company', data.company_id, 'expenses'] });
      }

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}

export function useUpdateExpense(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, expenseData }) => expenseServices.updateExpense(id, expenseData),
    onSuccess: (data) => {
      // Invalidate queries that contain this expense
      queryClient.invalidateQueries({ queryKey: ['expense', data.id] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.user_id, 'expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', 'flagged'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.user_id, 'expenses', 'flagged'] });

      if (data.company_id) {
        queryClient.invalidateQueries({ queryKey: ['company', data.company_id, 'expenses'] });
      }

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}

export function useBulkUpdateExpenses(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, ...expenseData }) => expenseServices.bulkUpdateExpenses(ids, expenseData),
    onSuccess: (data) => {
      // Invalidate all expense-related queries since we don't know which specific ones changed
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', 'flagged'] });

      // We could be smarter if the API returns affected users and companies
      if (data.affected_users) {
        data.affected_users.forEach(userId => {
          queryClient.invalidateQueries({ queryKey: ['user', userId, 'expenses'] });
          queryClient.invalidateQueries({ queryKey: ['user', userId, 'expenses', 'flagged'] });
        });
      }

      if (data.affected_companies) {
        data.affected_companies.forEach(companyId => {
          queryClient.invalidateQueries({ queryKey: ['company', companyId, 'expenses'] });
        });
      }

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}

export function useDeleteExpense(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => expenseServices.deleteExpense(id),
    onSuccess: (data, variables) => {
      // Variables is the id we passed to the mutation
      queryClient.removeQueries({ queryKey: ['expense', variables] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });

      // If the API returns the deleted expense data, we can be more specific
      if (data.user_id) {
        queryClient.invalidateQueries({ queryKey: ['user', data.user_id, 'expenses'] });

        if (data.flagged) {
          queryClient.invalidateQueries({ queryKey: ['user', data.user_id, 'expenses', 'flagged'] });
          queryClient.invalidateQueries({ queryKey: ['expenses', 'flagged'] });
        }
      }

      if (data.company_id) {
        queryClient.invalidateQueries({ queryKey: ['company', data.company_id, 'expenses'] });
      }

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}

export function useUploadExpensesCSV(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, file }) => expenseServices.uploadExpensesCSV(userId, file),
    onSuccess: (data, { userId }) => {
      // Invalidate user expenses after upload
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'expenses'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'expenses', 'flagged'] });

      // If we know the company_id from the response, invalidate company expenses too
      if (data.company_id) {
        queryClient.invalidateQueries({ queryKey: ['company', data.company_id, 'expenses'] });
      }

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
}