import styled from "@emotion/styled";
import { ScreenContainer } from "../../components/lib";
import { useDocumentTitle } from "../../utils";
import { useKanbans, useReorderKanban } from "../../utils/kanban";
import { useReorderTask, useTasks } from "../../utils/task";
import { KanbanColumn } from "./kanban-column";
import { SearchPanel } from "./search-panel";
import {
  useKanbanSearchParams,
  useKanbansQueryKey,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams,
} from "./util";
import { Spin } from "antd";
import { CreateKanban } from "./create-kanban";
import { TaskModal } from "./task-modal";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Drag, Drop, DropChild } from "../../components/drag-and-drop";
import { useCallback } from "react";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");

  // 获取项目详情，拿到项目名
  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );

  // 获取任务列表的isLoading
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = taskIsLoading || kanbanIsLoading;

  // 拖拽持久化
  const onDragEnd = useDragEnd();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size={"large"} />
        ) : (
          <ColumnsContainer>
            <Drop
              droppableId={"kanban"}
              type={"COLUMN"}
              direction={"horizontal"}
            >
              <DropChild style={{ display: "flex" }}>
                {kanbans?.map((kanban, index) => (
                  <Drag
                    key={kanban.id}
                    draggableId={"kanban" + kanban.id}
                    index={index}
                  >
                    <KanbanColumn kanban={kanban} />
                  </Drag>
                ))}
              </DropChild>
            </Drop>
            <CreateKanban />
          </ColumnsContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};

export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { data: allTasks = [] } = useTasks(useTasksSearchParams());
  const { mutate: recorderKanban } = useReorderKanban(useKanbansQueryKey());
  const { mutate: recorderTask } = useReorderTask(useTasksQueryKey());
  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) return;
      // 看板排序
      if (type === "COLUMN") {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[destination.index].id;
        if (!fromId || !toId || fromId === toId) {
          return;
        }
        // 判断是向前移动还是向后移动
        const type = destination.index > source.index ? "after" : "before";
        recorderKanban({ fromId, referenceId: toId, type });
      }
      if (type === "ROW") {
        // 出发地看板 Id
        const fromKanbanId = Number(source.droppableId); // +source.droppableId
        // 目的地看板 Id
        const toKanbanId = Number(destination.droppableId); // +destination.droppableId
        // if (fromKanbanId === toKanbanId) {
        //   // 跨看板排序
        //   return
        // }
        const fromTask = allTasks.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index];
        const toTask = allTasks.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ];
        if (fromTask?.id === toTask?.id) {
          return;
        }

        recorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          fromKanbanId,
          toKanbanId,
          type:
            fromKanbanId === toKanbanId && destination.index > source.index
              ? "after"
              : "before",
        });
      }
    },
    [allTasks, kanbans, recorderKanban, recorderTask]
  );
};

export const ColumnsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
`;
