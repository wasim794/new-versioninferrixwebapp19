import {StaticData} from "../../common";

export class Common {
  public static nodeTypes = new Map()
  .set('Normal Node', 0)
  .set('Enocean Relay', 1)
  .set('Sink Node', 2);
}

export const CURVE_DIM_TYPE: StaticData[] = [
  {key: "MS_100", value: "100 ms"},
  {key: "MS_200", value: "200 ms"},
  {key: "MS_300", value: "300 ms"},
  {key: "MS_400", value: "400 ms"},
  {key: "MS_500", value: "500 ms"},
  {key: "MS_1000", value: "1 sec"},
  {key: "MS_2000", value: "2 sec"},
  {key: "MS_3000", value: "3 sec"},
  {key: "MS_4000", value: "4 sec"},
  {key: "MS_5000", value: "5 sec"},
];
