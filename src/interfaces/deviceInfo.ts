/** 设备寄存器信息 */ 
export interface RegisterDataType {
  key: string;
  address: string;
  max: number;
  min: number;
  name: string;
}

/** 设备信息 */ 
export interface DeviceDataType {
  key: string;
  ipAddress: string;
  port: number;

  /** 寄存器 */ 
  registers: RegisterDataType[];
}

/** Key枚举合集 */ 
export enum DeviceInfoKeys {
  ADRESS = 'address',
  MAX = 'max',
  MIN = 'min',
  NAME = 'name',
  IPADDRESS = 'ipAddress',
  PORT = 'port',
  REGISTERS = 'registers',
}