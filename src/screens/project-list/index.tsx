import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumentTitle } from "../../utils";
import { useProjects } from "../../utils/project";
import { useUsers } from "../../utils/user";
import styled from "@emotion/styled";
import { useProjectModal, useProjectsSearchParams } from "./util";
import { ButtonNoPadding, ErrorBox, Row } from "../../components/lib";

export const ProjectListScreen = () => {
  // 设置页面标题
  useDocumentTitle("项目列表", false);

  const [param, setParam] = useProjectsSearchParams();
  // 防抖
  const debounceParam = useDebounce(param, 500);
  // 获取项目
  const { isLoading, error, data: list } = useProjects(debounceParam);
  // 获取用户
  const { data: users } = useUsers();
  // 控制打开关闭项目状态
  const { open } = useProjectModal();

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding type={"link"} onClick={open}>
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel
        param={param}
        setParam={setParam}
        users={users || []}
      ></SearchPanel>
      <ErrorBox error={error} />
      <List
        loading={isLoading}
        dataSource={list || []}
        users={users || []}
      ></List>
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = false;

const Container = styled.div`
  flex: 1;
  padding: 3.2rem;
`;
