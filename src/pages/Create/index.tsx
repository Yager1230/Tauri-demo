import type { FormProps } from 'antd';
import { Space, Form, Input, Button, message, Table } from 'antd';

import styles from './style.module.scss';
import Header from '../../components/Header';
import { useForm } from 'antd/es/form/Form';
import { LOCAL_DEVICE_KEY, updateLocalStorageItem } from '../../utils';
import { DeviceDataType, RegisterDataType } from '../../interfaces';

import { PlusOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { genKey } from '../../utils';

const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableRowContext = React.createContext<FormInstance<any> | null>(null);
const EditableTableContext = React.createContext((_: DataType[]) => {});

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableTableProps {
  value: DataType[];
  onChange: (value: DataType[]) => void;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableRowContext.Provider value={form}>
        <tr {...props} />
      </EditableRowContext.Provider>
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
  const form = useContext(EditableRowContext)!;

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
      console.log('Save failed:', errInfo);
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

// TODO:提出书写未泛型，并变表格为通用表格，支持回填
interface DataType {
  key: React.Key;
  address: string;
  max: number;
  min: number;
  name: string;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

const ResponsiveTable = <T,>({
  onChange,
  value = [],
}: EditableTableProps<T>) => {
  const handleDelete = (key: React.Key) => {
    const newData = value.filter((item) => item.key !== key);
    onChange(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: '寄存器地址',
      editable: true,
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: '最大值',
      editable: true,
      ellipsis: true,
      dataIndex: 'max',
    },
    {
      title: '最小值',
      editable: true,
      ellipsis: true,
      dataIndex: 'min',
    },
    {
      title: '寄存指标',
      dataIndex: 'name',
      ellipsis: true,
      width: '30%',
      editable: true,
    },
    {
      title: '操作',
      width: 75,
      dataIndex: 'operation',
      render: (_, record) =>
        value.length >= 1 ? (
          <a onClick={() => handleDelete(record.key)}>删除</a>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: genKey(),
      name: `指标${Math.floor(Math.random() * 10)}`,
      min: 0,
      max: 100,
      address: `${Math.floor(Math.random() * 100)}`,
    };
    onChange([...value, newData]);
  };

  const handleSave = (row: DataType) => {
    const newData = [...value];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    onChange(newData);
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
    <div>
      <EditableTableContext.Provider value={onChange}>
        <Table<DataType>
          scroll={{ y: 195 }}
          // TODO:配置虚拟滚动行高
          // virtual={true}
          components={components}
          rowClassName={() => styles.editableRow}
          bordered
          // TODO:调整分页
          pagination={false}
          dataSource={value}
          columns={columns as ColumnTypes}
        />
      </EditableTableContext.Provider>

      <Button
        style={{ marginTop: 20 }}
        type="dashed"
        onClick={() => handleAdd()}
        block
        icon={<PlusOutlined />}
      ></Button>
    </div>
  );
};

export default function index() {
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const initialValue: DeviceDataType = {
    key: `${Math.floor(Math.random() * 10000)}`,
    ipAddress: '',
    port: 0,
    registers: [],
  };

  const onFinish: FormProps['onFinish'] = (values) => {
    updateLocalStorageItem(LOCAL_DEVICE_KEY, [
      {
        ...values,
        key: Math.floor(Math.random() * 10000),
      },
    ]);
    messageApi.info('创建成功');
  };

  return (
    <div className={styles.container}>
      {contextHolder}
      <Header></Header>
      <div className={styles.content}>
        <Form
          form={form}
          name="basic"
          initialValues={initialValue}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Space>
            <Form.Item
              rules={[{ required: true, message: '请输入ip地址' }]}
              className={styles.nameInput}
              name="ipAddress"
            >
              {/* TODO:应为IP输入框 */}
              <Input placeholder="请输入ip" />
            </Form.Item>
            {/* TODO:1.不用label实现冒号2.不用style实现form样式 */}
            <Form.Item style={{ width: 100 }} label=" " name="port">
              <Input placeholder="端口号" />
            </Form.Item>
          </Space>
          <Form.Item name="registers">
            {/* 添加 TODO: 省略号+hover展示全称 */}
            <ResponsiveTable<RegisterDataType>></ResponsiveTable>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认创建
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  form.setFieldValue('registers', []);
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
