import { UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router";

const index = () => {
  const navigate = useNavigate();

  const handleRoute = (key: string) => {
    navigate(key);
  };
  return (
    <Menu
      theme='dark'
      mode='inline'
      defaultSelectedKeys={["1"]}
      onClick={({ key }) => handleRoute(key)}
      // TODO:菜单logo替换
      items={[
        {
          key: "create",
          icon: <UserOutlined />,
          label: "create",
        },
        {
          key: "list",
          icon: <VideoCameraOutlined />,
          label: "list",
        },
      ]}
    />
  );
};

export default index;
