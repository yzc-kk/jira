import styled from "@emotion/styled";
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { EpicScreen } from "../epic/index.";
import { KanbanScreen } from "../kanban";
import { Menu } from "antd";

const useRouteType = () => {
  // 拿到 Url，解析获取当前路由是在任务组还是在看板
  const units = useLocation().pathname.split("/");
  return units[units.length - 1];
};

export const ProjectScreen = () => {
  const routeType = useRouteType();
  return (
    <Container>
      <Aside>
        <Menu mode={"inline"} selectedKeys={[routeType]}>
          <Menu.Item key={"kanban"}>
            <Link to={"kanban"}>看板</Link>
          </Menu.Item>
          <Menu.Item key={"epic"}>
            <Link to={"epic"}>任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          {/* projects/:projectId/kanban */}
          <Route path={"/kanban"} element={<KanbanScreen />}></Route>
          <Route path={"/epic"} element={<EpicScreen />}></Route>
          {/* 默认路由 */}
          <Route
            path={"*"}
            element={
              <Navigate
                to={window.location.pathname + "/kanban"}
                replace={true}
              />
            }
          />
        </Routes>
      </Main>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  width: 100%;
`;

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;

const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
`;
