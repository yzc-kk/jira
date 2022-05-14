import styled from "@emotion/styled";
import { useAuth } from "./context/auth-content";
import { ProjectListScreen } from "./screens/project-list";
import { ButtonNoPadding, Row } from "./components/lib";
import { ReactComponent as SoftwareLogo } from "./assets/software-logo.svg";
import { Dropdown, Menu, Button } from "antd";
import {} from "react-router";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProjectScreen } from "./screens/project";
import { resetRoute } from "./utils";
import { ProjectModal } from "./screens/project-list/project-modal";
import { ProjectPopover } from "./components/project-popover";
import { UserPopover } from "./components/user-popover";

export const AuthenticatedApp = () => {
  return (
    <Container>
      <BrowserRouter>
        <PageHeader />
        <Main>
          <Routes>
            <Route path={"/projects"} element={<ProjectListScreen />}></Route>
            <Route
              path={"/projects/:projectId/*"}
              element={<ProjectScreen />}
            ></Route>
            {/* 默认路由 */}
            <Route
              path={"*"}
              element={<Navigate to={"/projects"} replace={true} />}
            />
          </Routes>
        </Main>
        <ProjectModal />
      </BrowserRouter>
    </Container>
  );
};

const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        {/* 切换根路由 */}
        <ButtonNoPadding type={"link"} onClick={resetRoute}>
          <SoftwareLogo width={"18rem"} color={"rgb(38, 132, 255)"} />
        </ButtonNoPadding>
        <ProjectPopover />
        <UserPopover />
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};

const User = () => {
  const { logout, user } = useAuth();
  // 登出按钮
  const ButtonLogout = () => {
    return (
      <Button type={"link"} onClick={logout}>
        登出
      </Button>
    );
  };
  // 菜单设置
  const menuItems = [
    {
      key: "logout",
      label: <ButtonLogout />,
    },
  ];
  return (
    <Dropdown overlay={<Menu items={menuItems} />}>
      <Button type={"link"} onClick={(e) => e.preventDefault()}>
        Hi, {user?.name}
      </Button>
    </Dropdown>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr 6rem;
  height: 100vh;
`;

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HeaderLeft = styled(Row)`
  display: flex;
  align-items: center;
`;

const HeaderRight = styled.div``;
const Main = styled.main`
  display: flex;
  overflow: hidden;
`;
