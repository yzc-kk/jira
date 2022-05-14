import { useUrlQueryParam } from "./../../utils/url";
import { useTask, useTasks } from "./../../utils/task";
import { useLocation } from "react-router";
import { useProject } from "../../utils/project";
import { useMemo, useCallback } from "react";

// 在 Url上拿到项目 id
export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  // console.log('pathname', pathname)
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

// 根据 项目id 获取项目名称, 返回项目详情
export const useProjectInUrl = () => useProject(useProjectIdInUrl());

// 返回项目 Id
export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useKanbansQueryKey = () => ["kanbans", useKanbanSearchParams()];

// 获取看板表单信息
export const useTasksSearchParams = () => {
  const [param, setParam] = useUrlQueryParam([
    "name",
    "typeId",
    "processorId",
    "tagId",
  ]);
  const projectId = useProjectIdInUrl();
  // const debouncedName = useDebounce(param.name, 200)
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: param.name,
    }),
    [projectId, param]
  );
};

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];

export const useTaskInProject = () => useTasks(useTasksSearchParams());

export const useTasksModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    "editingTaskId",
  ]);
  // 获取 task 详情
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId));
  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId]
  );

  const close = useCallback(() => {
    // 关闭模态框
    setEditingTaskId({ editingTaskId: "" });
  }, [setEditingTaskId]);

  return {
    editingTaskId,
    editingTask,
    startEdit,
    close,
    isLoading,
  };
};
