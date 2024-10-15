import React, { useState } from 'react';
import { Button, Flex, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { ProColumns, ProTable } from '@ant-design/pro-components';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface Params {
  pageSize?: number;
  current?: number;
}

const columns: ProColumns<DataType>[] = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Address', dataIndex: 'address' },
];

const dataSource = Array.from<DataType>({ length: 46 }).map<DataType>(
  (_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  })
);

const App: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Flex gap="middle" vertical>
      <ProTable<DataType, Params>
        // params 是需要自带的参数
        // 这个参数优先级更高，会覆盖查询表单的参数
        params={{}}
        columns={columns}
        scroll={{ y: 195 }}
        rowSelection={true}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: Params,
          sort,
          filter
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          // const msg = await myQuery({
          //   page: params.current,
          //   pageSize: params.pageSize,
          // });
          const msg: { result: DataType[] } = {
            result: new Array(50).fill(0).map((_, index) => ({
              key: index,
              name: '123',
              age: index,
              address: '2',
            })),
          };
          return {
            data: msg.result,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: 1,
          };
        }}
      />
    </Flex>
  );
};

export default App;
