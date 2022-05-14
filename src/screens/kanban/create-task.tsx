import { Card, Input } from "antd";
import { useEffect, useState } from "react";
import { useAddTask } from "../../utils/task";
import { useProjectIdInUrl, useTasksQueryKey } from "./util";

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState("");
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey());

  const [inputMode, setInputMode] = useState(false);

  const submit = async () => {
    await addTask({ projectId, name, kanbanId });
    // 清除 输入框输入状态和清空名字
    setInputMode(false);
    setName("");
  };

  const toggle = () => setInputMode((mode) => !mode);

  useEffect(() => {
    if (!inputMode) {
      setName("");
    }
  }, [inputMode]);

  if (!inputMode) {
    return <div onClick={toggle}>创建事务</div>;
  }

  return (
    <Card>
      <Input
        onBlur={toggle}
        placeholder={"需要做些什么"}
        autoFocus={true}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Card>
  );
};