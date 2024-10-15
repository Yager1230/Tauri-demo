import type { FormProps } from "antd";
import { Space, Form, Input, Button } from "antd";

import styles from "./style.module.scss";
import Header from "../../components/Header";
import { useForm } from "antd/es/form/Form";
import ResponsiveTable from "../../components/ResponsiveTable";

const onFinish: FormProps["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

interface RegisterProps {
  ipAddress: string;
  port: number;
  registers: [];
}

export default function index() {
  const [form] = useForm();
  const initialValue: RegisterProps = {
    ipAddress: "",
    port: 0,
    registers: [],
  };

  return (
    <div className={styles.container}>
      <Header></Header>
      <div className={styles.content}>
        <Form
          form={form}
          name='basic'
          initialValues={initialValue}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Space>
            <Form.Item className={styles.nameInput} name='ipAddress'>
              {/* TODO:应为IP输入框 */}
              <Input placeholder='请输入ip' />
            </Form.Item>
            {/* TODO:1.不用label实现冒号2.不用style实现form样式 */}
            <Form.Item style={{ width: 100 }} label=' ' name='port'>
              <Input placeholder='端口号' />
            </Form.Item>
          </Space>
          <Form.Item name='registers'>
            {/* 添加 TODO: 省略号+hover展示全称 */}
            <ResponsiveTable></ResponsiveTable>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit'>
                确认创建
              </Button>
              <Button
                type='primary'
                onClick={() => {
                  console.log(123);
                  form.setFieldValue("registers", []);
                }}
              >
                清空
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
