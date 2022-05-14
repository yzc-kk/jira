import { useMemo } from "react";
import { useProject } from "../../utils/project";
import { useSetUrlSearchParam, useUrlQueryParam } from "../../utils/url";

// 项目列表搜索的参数
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectsQueryKey = () => {
  const [params] = useProjectsSearchParams();
  return ["projects", params];
};

export const useProjectModal = () => {
  // 判断是不是创建
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);

  // 判断是不是编辑
  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    "editingProjectId",
  ]);

  const setUrlParams = useSetUrlSearchParam();
  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );

  // 打开、关闭
  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => {
    // if (projectCreate) setProjectCreate({projectCreate: undefined})
    // if (editingProject) setEditingProjectId({editingProjectId: undefined})
    return setUrlParams({
      projectCreate: "",
      editingProjectId: "",
    });
  };
  // 开始编辑
  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id });

  return {
    // 创建、打开、关闭
    // projectModalOpen: projectCreate === "true" || Boolean(editingProject),
    projectModalOpen: projectCreate === "true" || Boolean(editingProjectId),
    open,
    close,
    // 编辑
    editingProject,
    isLoading,
    startEdit,
  };
};
