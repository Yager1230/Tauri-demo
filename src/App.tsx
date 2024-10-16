import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Create from './pages/Create';
import List from './pages/List';
import styles from './App.module.scss';
import SideMenu from './components/SideMenu';

import { Layout, theme } from 'antd';

const { Sider, Content } = Layout;

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Router>
      <Layout className={styles.container}>
        <Sider trigger={null}>
          <div className={styles.demoLogoVertical}>
            {/* TODO:Logo */}
            <span>Logo</span>
          </div>
          <SideMenu></SideMenu>
        </Sider>
        <Layout>
          <Content
            style={{
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/create" element={<Create />} />
              <Route path="/list" element={<List />} />
              <Route path="*" element={<List />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
