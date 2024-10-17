import React, { useRef, useState } from 'react';
import {
  Button,
  Dropdown,
  Flex,
  MenuProps,
  Space,
  Tag,
  Typography,
} from 'antd';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { DeviceDataType, RegisterDataType } from '../../interfaces';
import { useNavigate } from 'react-router-dom';
import {
  getLocalStorageItem,
  LOCAL_DEVICE_KEY,
  updateLocalStorageItem,
} from '../../utils';
import styles from './index.module.scss';
import { DownOutlined } from '@ant-design/icons';

interface Params {
  pageSize?: number;
  current?: number;
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { Paragraph } = Typography;

  const columns: ProColumns<DeviceDataType>[] = [
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      search: true,
      hideInSetting: true,
    },
    {
      title: '端口',
      dataIndex: 'port',
    },
    {
      title: '寄存器',
      dataIndex: 'registers',
      render: (value: RegisterDataType[]) => {
        return (
          <>
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>
              {value.map((item) => (
                <Tag key={item.key}>{item.name}</Tag>
              ))}
            </Paragraph>
          </>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, data: DeviceDataType) => {
        const items: MenuProps['items'] = [
          {
            label: '编辑',
            key: 'edit',
            onClick: () => {},
          },
          {
            label: '删除',
            key: 'delete',
            onClick: () => {
              updateLocalStorageItem(LOCAL_DEVICE_KEY, data, 'delete');
              actionRef.current?.reload();
            },
          },
        ];
        return (
          <Space>
            <Dropdown
              menu={{
                items,
              }}
              trigger={['click']}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  操作
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <Flex gap="middle" vertical>
      <ProTable<DeviceDataType, Params>
        actionRef={actionRef}
        params={{}}
        search={false}
        options={{
          density: false,
        }}
        toolbar={{
          title: '设备列表',
          actions: [
            <Space>
              <Button type="primary" onClick={() => {}}>
                启动
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  navigate('/create');
                }}
              >
                创建
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  if (!selectedRowKeys.length) {
                    return;
                  }
                  updateLocalStorageItem(
                    LOCAL_DEVICE_KEY,
                    selectedRowKeys.map((key) => ({ key })) as Array<{
                      key: string;
                    }>,
                    'delete'
                  );
                  actionRef.current?.reload();
                }}
              >
                删除
              </Button>
            </Space>,
          ],
        }}
        rowSelection={{
          alwaysShowAlert: true,
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        rowClassName={() => styles.customRow}
        columns={columns}
        scroll={{ y: 240 }}
        pagination={{
          pageSize: 20,
        }}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: Params,
          sort,
          filter
        ) => {
          // const msg = await myQuery({
          //   page: params.current,
          //   pageSize: params.pageSize,
          // });
          const msg: { result: DeviceDataType[] } = {
            result: getLocalStorageItem<DeviceDataType[]>(LOCAL_DEVICE_KEY),
          };
          return {
            data: msg.result,
            success: true,
            total: msg.result.length,
          };
        }}
      />
    </Flex>
  );
};

export default App;
