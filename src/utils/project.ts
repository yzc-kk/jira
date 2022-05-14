import { Project } from "../types/project";
import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";

// 获取项目列表
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  // param 变化就会自动触发
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  // const queryKey = ['projects', useProjectsSearchParams()]
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
    // {
    //   // 请求成功后刷新
    //   onSuccess: () => queryClient.invalidateQueries(queryKey),
    //   onMutate: async (target) => {
    //     const previousItem = queryClient.getQueryData(queryKey)
    //     // 执行乐观更新
    //     queryClient.setQueryData(queryKey, (old?: Project[]) => {
    //       return old?.map(project => project.id === target.id ? {...project, ...target}: project) || []
    //     })
    //     return { previousItem }
    //   },
    //   onError: (error, newItem, context) => {
    //     queryClient.setQueryData(queryKey, (context as { previousItems: Project[] }).previousItems)
    //   }
    // }
  );
};

// 创建
export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};

// 删除
export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};

// 获取项目详情
export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      // 只有当 id 是有值的，才会触发这个函数
      enabled: Boolean(id),
    }
  );
};
