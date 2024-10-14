import type { FormProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef, TableProps } from "antd";
import { Space, Form, Input, Popconfirm, Table, Button } from "antd";

import styles from "./style.module.scss";
import Header from "../../components/Header";
import { useForm } from "antd/es/form/Form";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      component={false}
      onFinish={(value) => console.log(1111, value)}
    >
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className={styles.editableCellValueWrap}
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  address: string;
  max: number;
  min: number;
  name: string;
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

const onFinish: FormProps["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export default function index() {
  const [form] = useForm();
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: "0",
      name: "1",
      min: 32,
      max: 0,
      address: "0099",
    },
  ]);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "寄存器地址",
      editable: true,
      dataIndex: "address",
      ellipsis: true,
    },
    {
      title: "最大值",
      editable: true,
      ellipsis: true,
      dataIndex: "max",
    },
    {
      title: "最小值",
      editable: true,
      ellipsis: true,
      dataIndex: "min",
    },
    {
      title: "寄存指标",
      dataIndex: "name",
      ellipsis: true,
      width: "30%",
      editable: true,
    },
    {
      title: "操作",
      width: 75,
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title='Sure to delete?'
            onConfirm={() => handleDelete(record.key)}
          >
            <a>删除</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      name: `Edward King ${count}`,
      min: 0,
      max: 100,
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <div className={styles.container}>
      <Header></Header>
      <div className={styles.content}>
        <Form
          form={form}
          name='basic'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Space>
            <Form.Item className={styles.nameInput} name='ipAddress'>
              <Input placeholder='请输入ip' />
            </Form.Item>
            {/* TODO:1.不用label实现冒号2.不用style实现form样式 */}
            <Form.Item style={{ width: 100 }} label=' ' name='port'>
              <Input placeholder='端口号' />
            </Form.Item>
          </Space>
          <Form.Item name='register'>
            {/* 添加 TODO: 省略号+hover展示全称 */}
            <Table<DataType>
              components={components}
              rowClassName={() => "editableRow"}
              bordered
              // TODO:调整分页
              pagination={false}
              dataSource={dataSource}
              columns={columns as ColumnTypes}
            />
          </Form.Item>
          <Form.Item style={{ marginTop: 20 }}>
            <Button
              type='dashed'
              onClick={() => handleAdd()}
              block
              icon={<PlusOutlined />}
            ></Button>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              确认创建
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
