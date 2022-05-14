import { QueryKey, useQueryClient } from "react-query";
import { Task } from "../types/task";
import { reorder } from "./recoder";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    onMutate: async (target: any) => {
      const previousItem = queryClient.getQueryData(queryKey);
      // 执行乐观更新
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });
      return { previousItem };
    },
    onError: (error: any, newItem: any, context: any) => {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target: any, old) => {
    return old?.filter((item) => item.id !== target.id) || [];
  });

export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target: any, old) => {
    return (
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
    );
  });

export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target: any, old) => {
    return old ? [...old, target] : [];
  });

export const useReorderConfig = (queryKey: QueryKey) => {
  return useConfig(queryKey, (target, old) => old || []);
};

export const useReorderKanbanConfig = (queryKey: QueryKey) => {
  return useConfig(queryKey, (target, old) =>
    reorder({ list: old, ...target })
  );
};

export const useReorderTaskConfig = (queryKey: QueryKey) => {
  return useConfig(queryKey, (target, old) => {
    // 乐观更新 task 序列中的位置
    const orderedList = reorder({ list: old, ...target }) as Task[];
    // 由于 task 排序还可能涉及到所属kanban的改变，所以不要忘记改变 kanbanId
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });
};
