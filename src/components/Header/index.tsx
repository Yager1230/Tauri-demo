import { Header } from "antd/es/layout/layout";
import styles from "./index.module.scss";

export default () => {
  return (
    <Header className={styles.container}>
      <div>返回</div>
      <div>确认</div>
    </Header>
  );
};
