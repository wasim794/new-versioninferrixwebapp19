import {PointLocatorModel} from '../../../model/pointLocatorModel';

export class MqttPointLocatorModel extends PointLocatorModel {
  override modelType = 'MQTT.PL';
  publishTopic!: string;
  publishTopicType!: string;
  publishQosType!: string;
  subscribeTopic!: string;
  subscribeTopicType!: string;
}
