import { Button } from "antd";
import styles from "./index.module.scss";
import { invoke } from "@tauri-apps/api/core";

export default function index() {
  const emitCommand = () => {
    // invoke("my_custom_command");
    console.log(invoke("greet", { name: "Yager" }));
  };

  return (
    <div className={styles.container}>
      <span className={styles.content}>编辑</span>
      <Button onClick={emitCommand}>测试命令</Button>
    </div>
  );
}
