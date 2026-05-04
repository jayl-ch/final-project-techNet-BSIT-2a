import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { clearAuthToken, extractAuthErrorMessage } from "../../auth/api/authApi";
import {
  assignTaskToMember,
  createGroup,
  fetchAssignableTasks,
  fetchGroupDetails,
  fetchGroups,
  joinGroup,
  leaveGroup,
  removeGroupMember,
  removeGroup,
  updateAssignedTaskStatus,
} from "../api/groupsApi";
import { apiClient } from "../../auth/api/authApi";

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

export const useGroupsData = (onUnauthorized, selectedGroupId = null) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groupDetails, setGroupDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [assignableTasks, setAssignableTasks] = useState([]);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [groupsResult, studentResult] = await Promise.allSettled([
        fetchGroups(),
        apiClient.get("/api/student")
      ]);

      if (groupsResult.status === "rejected") throw groupsResult.reason;
      setGroups(Array.isArray(groupsResult.value) ? groupsResult.value : []);

      if (studentResult.status === "fulfilled") {
        setCurrentStudentId(studentResult.value?.data?.student?._id || null);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearAuthToken();
        onUnauthorized?.();
        return;
      }

      setError(extractAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const groupItems = useMemo(() => groups.map(toGroupItem), [groups]);

  const loadGroupDetails = useCallback(async () => {
    if (!selectedGroupId) {
      setGroupDetails(null);
      setAssignableTasks([]);
      return;
    }

    setDetailsLoading(true);
    setDetailsError("");

    try {
      const [detailsData, taskData] = await Promise.all([
        fetchGroupDetails(selectedGroupId),
        fetchAssignableTasks(),
      ]);

      setGroupDetails(detailsData);
      setAssignableTasks(Array.isArray(taskData) ? taskData : []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearAuthToken();
        onUnauthorized?.();
        return;
      }

      setDetailsError(extractAuthErrorMessage(err));
    } finally {
      setDetailsLoading(false);
    }
  }, [onUnauthorized, selectedGroupId]);

  useEffect(() => {
    loadGroupDetails();
  }, [loadGroupDetails]);

  const addGroup = useCallback(async (payload) => {
    const created = await createGroup(payload);

    if (created?._id) {
      setGroups((prev) => [created, ...prev]);
      return created._id;
    }

    await loadGroups();
    return null;
  }, [loadGroups]);

  const joinExistingGroup = useCallback(async (payload) => {
    await joinGroup(payload);
    await loadGroups();
  }, [loadGroups]);

  const deleteGroupById = useCallback(async (groupId) => {
    await removeGroup(groupId);
    setGroups((prev) => prev.filter((group) => group._id !== groupId));
  }, []);

  const leaveSelectedGroup = useCallback(async (groupId) => {
    const targetGroupId = groupId || selectedGroupId;

    if (!targetGroupId) {
      throw new Error("No group selected");
    }

    await leaveGroup(targetGroupId);
    await loadGroups();
  }, [loadGroups, selectedGroupId]);

  const removeMemberFromGroup = useCallback(
    async (memberId) => {
      if (!selectedGroupId) {
        throw new Error("No group selected");
      }

      await removeGroupMember(selectedGroupId, memberId);
      await Promise.all([loadGroups(), loadGroupDetails()]);
    },
    [loadGroupDetails, loadGroups, selectedGroupId],
  );

  const assignTask = useCallback(async ({ taskId, assignedTo }) => {
    if (!selectedGroupId) {
      throw new Error("No group selected");
    }

    await assignTaskToMember({ taskId, assignedTo, groupId: selectedGroupId });
    await loadGroupDetails();
  }, [loadGroupDetails, selectedGroupId]);

  const updateMemberTaskStatus = useCallback(async (taskId, status) => {
    await updateAssignedTaskStatus(taskId, status);
    await loadGroupDetails();
  }, [loadGroupDetails]);

  return {
    groups: groupItems,
    loading,
    error,
    reload: loadGroups,
    selectedGroupId,
    groupDetails,
    detailsLoading,
    detailsError,
    assignableTasks,
    currentStudentId,
    reloadDetails: loadGroupDetails,
    addGroup,
    joinExistingGroup,
    deleteGroupById,
    leaveSelectedGroup,
    removeMemberFromGroup,
    assignTask,
    updateMemberTaskStatus,
  };
};
