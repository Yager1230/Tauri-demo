import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const index = () => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState('/create');
  const location = useLocation();

  useEffect(() => {
    setSelectedKeys(location.pathname);
  }, [location]);
  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKeys]}
      onClick={({ key }) => navigate(key)}
      // TODO:菜单logo替换
      items={[
        {
          key: '/create',
          icon: <UserOutlined />,
          label: 'create',
        },
        {
          key: '/list',
          icon: <VideoCameraOutlined />,
          label: 'list',
        },
      ]}
    />
  );
};

export default index;
