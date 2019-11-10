import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
import {MavMissionResult} from '../enums/mav-mission-result';
/*
Acknowledgment message during waypoint handling. The type field states if this message is a positive ack (type=0) or if an error happened (type=non-zero).
*/
// type Mission result. uint8_t
export class MissionAck extends MAVLinkMessage {
	public type!: MavMissionResult;
	public _message_id: number = 47;
	public _message_name: string = 'MISSION_ACK';
	public _crc_extra: number = 132;
	public _message_fields: [string, string, boolean][] = [
		['type', 'uint8_t', false],
	];
}