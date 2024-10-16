import { Header } from 'antd/es/layout/layout';
import styles from './index.module.scss';
import { Button } from 'antd';
import { useNavigate } from 'react-router';

export default () => {
  const navigate = useNavigate();
  return (
    <Header className={styles.container}>
      <Button onClick={() => navigate(-1)} type="primary">
        返回
      </Button>
      {/* <Button type="primary">确认</Button> */}
    </Header>
  );
};
