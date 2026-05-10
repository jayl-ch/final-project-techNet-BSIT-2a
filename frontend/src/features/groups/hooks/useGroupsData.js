import { useCallback, useMemo } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearAuthToken,
  extractAuthErrorMessage,
  getAuthStudent,
} from "../../auth/api/authApi";
import {
  assignTaskToMember,
  unassignTaskFromMember,
  createGroup,
  fetchGroupDetails,
  fetchGroups,
  joinGroup,
  leaveGroup,
  removeGroupMember,
  removeGroup,
  updateAssignedTaskStatus,
} from "../api/groupsApi";
import { fetchTasks } from "../../tasks/api/tasksApi";

const toGroupItem = (group) => ({
  id: group._id,
  name: group.name || "Untitled Group",
  inviteCode: group.inviteCode || "N/A",
  isOwner: Boolean(group.isOwner),
  membersCount:
    typeof group.memberCount === "number"
      ? group.memberCount
      : Array.isArray(group.members)
        ? group.members.length
        : 0,
});

const isUnauthorizedError = (error) =>
  axios.isAxiosError(error) && error.response?.status === 401;

export const useGroupsData = (onUnauthorized, selectedGroupId = null) => {
  const queryClient = useQueryClient();

  const handleUnauthorized = useCallback(() => {
    clearAuthToken();
    onUnauthorized?.();
  }, [onUnauthorized]);

  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 30000,
    retry: (failureCount, error) =>
      !isUnauthorizedError(error) && failureCount < 1,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const studentQuery = useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const response = await getAuthStudent();
      return response?.data?.student ?? null;
    },
    staleTime: 30000,
    retry: (failureCount, error) =>
      !isUnauthorizedError(error) && failureCount < 1,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const groupDetailsQuery = useQuery({
    queryKey: ["groupDetails", selectedGroupId],
    queryFn: () => fetchGroupDetails(selectedGroupId),
    enabled: Boolean(selectedGroupId),
    staleTime: 15000,
    retry: (failureCount, error) =>
      !isUnauthorizedError(error) && failureCount < 1,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const assignableTasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    enabled: Boolean(selectedGroupId),
    staleTime: 30000,
    retry: (failureCount, error) =>
      !isUnauthorizedError(error) && failureCount < 1,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const groups = Array.isArray(groupsQuery.data) ? groupsQuery.data : [];
  const groupItems = useMemo(() => groups.map(toGroupItem), [groups]);
  const loading = groupsQuery.isLoading;
  const error =
    groupsQuery.error && !isUnauthorizedError(groupsQuery.error)
      ? extractAuthErrorMessage(groupsQuery.error)
      : "";

  const groupDetails = groupDetailsQuery.data ?? null;
  const detailsLoading = groupDetailsQuery.isLoading;
  const detailsError =
    groupDetailsQuery.error && !isUnauthorizedError(groupDetailsQuery.error)
      ? extractAuthErrorMessage(groupDetailsQuery.error)
      : "";
  const assignableTasks = Array.isArray(assignableTasksQuery.data)
    ? assignableTasksQuery.data
    : [];
  const currentStudentId = studentQuery.data?._id || null;

  const { mutateAsync: createGroupAsync } = useMutation({
    mutationFn: createGroup,
    onSuccess: (created) => {
      if (created?._id) {
        queryClient.setQueryData(["groups"], (current) => {
          const safeCurrent = Array.isArray(current) ? current : [];
          return [created, ...safeCurrent];
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["groups"] });
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const { mutateAsync: joinGroupAsync } = useMutation({
    mutationFn: joinGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const { mutateAsync: removeGroupAsync } = useMutation({
    mutationFn: removeGroup,
    onSuccess: (_, groupId) => {
      queryClient.setQueryData(["groups"], (current) => {
        const safeCurrent = Array.isArray(current) ? current : [];
        return safeCurrent.filter((group) => group._id !== groupId);
      });
      queryClient.invalidateQueries({ queryKey: ["groupDetails", groupId] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const { mutateAsync: leaveGroupAsync } = useMutation({
    mutationFn: leaveGroup,
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groupDetails", groupId] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const { mutateAsync: removeMemberAsync } = useMutation({
    mutationFn: ({ groupId, memberId }) => removeGroupMember(groupId, memberId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groupDetails", groupId] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const { mutateAsync: assignTaskAsync } = useMutation({
    mutationFn: assignTaskToMember,
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["groupDetails", groupId] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const { mutateAsync: unassignTaskAsync } = useMutation({
    mutationFn: unassignTaskFromMember,
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["groupDetails", groupId] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const { mutateAsync: updateStatusAsync } = useMutation({
    mutationFn: ({ taskId, status }) => updateAssignedTaskStatus(taskId, status),
    onSuccess: () => {
      if (selectedGroupId) {
        queryClient.invalidateQueries({
          queryKey: ["groupDetails", selectedGroupId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  });

  const addGroup = useCallback(
    async (payload) => {
      const created = await createGroupAsync(payload);
      return created?._id || null;
    },
    [createGroupAsync],
  );

  const joinExistingGroup = useCallback(
    async (payload) => {
      await joinGroupAsync(payload);
    },
    [joinGroupAsync],
  );

  const deleteGroupById = useCallback(
    async (groupId) => {
      await removeGroupAsync(groupId);
    },
    [removeGroupAsync],
  );

  const leaveSelectedGroup = useCallback(
    async (groupId) => {
      const targetGroupId = groupId || selectedGroupId;

      if (!targetGroupId) {
        throw new Error("No group selected");
      }

      await leaveGroupAsync(targetGroupId);
    },
    [leaveGroupAsync, selectedGroupId],
  );

  const removeMemberFromGroup = useCallback(
    async (memberId) => {
      if (!selectedGroupId) {
        throw new Error("No group selected");
      }

      await removeMemberAsync({ groupId: selectedGroupId, memberId });
    },
    [removeMemberAsync, selectedGroupId],
  );

  const assignTask = useCallback(
    async ({ taskId, assignedTo }) => {
      if (!selectedGroupId) {
        throw new Error("No group selected");
      }

      await assignTaskAsync({ taskId, assignedTo, groupId: selectedGroupId });
    },
    [assignTaskAsync, selectedGroupId],
  );

  const unassignTask = useCallback(
    async (taskId) => {
      if (!selectedGroupId) {
        throw new Error("No group selected");
      }

      await unassignTaskAsync({ taskId, groupId: selectedGroupId });
    },
    [unassignTaskAsync, selectedGroupId],
  );

  const updateMemberTaskStatus = useCallback(
    async (taskId, status) => {
      await updateStatusAsync({ taskId, status });
    },
    [updateStatusAsync],
  );

  return {
    groups: groupItems,
    loading,
    error,
    reload: groupsQuery.refetch,
    selectedGroupId,
    groupDetails,
    detailsLoading,
    detailsError,
    assignableTasks,
    currentStudentId,
    reloadDetails: groupDetailsQuery.refetch,
    addGroup,
    joinExistingGroup,
    deleteGroupById,
    leaveSelectedGroup,
    removeMemberFromGroup,
    assignTask,
    unassignTask,
    updateMemberTaskStatus,
  };
};
