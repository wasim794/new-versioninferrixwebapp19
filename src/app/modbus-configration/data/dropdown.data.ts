import {NumericKeyStaticData, StaticData} from "../../common/static-data/static-data";

export const POINT_SIZE: StaticData[] = [
  {key: 'BIT', value: 'Bit'},
  {key: 'BYTE', value: 'Byte'},
  {key: 'TWO_BYTE', value: 'Two Bytes'},
  {key: 'FOUR_BYTE', value: 'Four Bytes'},
  {key: 'TWO_BYTE_SIGNED', value: 'Two Bytes Signed'},
  {key: 'FOUR_BYTE_SIGNED', value: 'Four Bytes Signed'},
  {key: 'FLOAT', value: 'Float'},
  {key: 'DOUBLE', value: 'Double'},
  {key: 'FLOAT_SWAPPED', value: 'Float Swapped'}
];

export const FUNCTION_CODE: NumericKeyStaticData[] =[
  {key: 1, value: 'Read Coils'},
  {key: 2, value: 'Read Discrete Inputs'},
  {key: 3, value: 'Read Holding Registers'},
  {key: 4, value: 'Read Input Registers'}
];
