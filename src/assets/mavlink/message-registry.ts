import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {Heartbeat} from './messages/heartbeat';
import {BoatStatus} from './messages/boat-status';
import {RadioStatus} from './messages/radio-status';
import {GpsRawInt} from './messages/gps-raw-int';
import {MissionItem} from './messages/mission-item';
export const messageRegistry: Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]> = [
	[0, Heartbeat],
	[1, BoatStatus],
	[109, RadioStatus],
	[24, GpsRawInt],
	[39, MissionItem],
];