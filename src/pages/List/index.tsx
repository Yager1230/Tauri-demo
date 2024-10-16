import React, { useRef } from 'react';
import { Button, Flex, Space, Tag } from 'antd';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { DeviceDataType, RegisterDataType } from '../../interfaces';
import { useNavigate } from 'react-router-dom';
import {
  getLocalStorageItem,
  LOCAL_DEVICE_KEY,
  updateLocalStorageItem,
} from '../../utils';
import styles from './index.module.scss';

interface Params {
  pageSize?: number;
  current?: number;
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();

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
            {value.map((item) => (
              <Tag key={item.key}>{item.name}</Tag>
            ))}
          </>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, data: DeviceDataType) => (
        <Space>
          <Button>编辑</Button>
          <Button
            onClick={() => {
              updateLocalStorageItem(LOCAL_DEVICE_KEY, data, 'delete');
              actionRef.current?.reload();
            }}
          >
            删除
          </Button>
        </Space>
      ),
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
            </Space>,
          ],
        }}
        rowSelection={{
          alwaysShowAlert: true,
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
