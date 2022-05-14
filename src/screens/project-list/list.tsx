import { User } from "../../types/user";
import { Table, TableProps, Dropdown, Menu, Modal } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Pin } from "../../components/pin";
import { useDeleteProject, useEditProject } from "../../utils/project";
import { ButtonNoPadding } from "../../components/lib";
import { useProjectModal, useProjectsQueryKey } from "./util";
import { Project } from "../../types/project";

interface listProps extends TableProps<Project> {
  users: User[];

  // list: Project[];
}

export const List = ({ users, ...props }: listProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());
  const pinProject = (id: number, pin: boolean) => mutate({ id, pin });
  // const pinProject = (id: number) => (pin: boolean) => mutate({id, pin})

  return (
    <Table
      rowKey={(props) => props.id}
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={(pin) => pinProject(project.id, pin)}
              />
            );
          },
        },
        {
          title: "名称",
          // 排序中文字符
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
};

const More = ({ project }: { project: Project }) => {
  // 编辑
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => startEdit(id);

  // 确认删除
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: "确认删除这个项目吗？",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteProject({ id });
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"edit"} onClick={() => editProject(project.id)}>
            编辑
          </Menu.Item>
          <Menu.Item
            key={"delete"}
            onClick={() => confirmDeleteProject(project.id)}
          >
            删除
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};
