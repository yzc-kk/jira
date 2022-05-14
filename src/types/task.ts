export interface Task {
  id: number;
  name: string;
  // 经办人
  processorId: number;
  // 项目
  projectId: number;
  // 任务组
  epicId: number;
  // 看板
  kanbanId: number;
  // bug or task
  typeId: number;
  note: string;
}
