// src/modules/users/hooks/useUsers.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { userApi } from '../services/userApi';
import { UpdateUserPayload } from '../types/user.types';

export const useUsers = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  // Personel listesini getir
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAll,
    select: (data) => data.data,
  });

  // Personel güncelle
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserPayload }) => 
      userApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Personel bilgileri güncellendi.');
    },
  });

  // Personel sil
  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Personel klinikten kaldırıldı.');
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
