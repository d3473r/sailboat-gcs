import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
/*
Initiate a new mission.
*/
// count Number of mission items in the sequence uint16_t
export class MissionCount extends MAVLinkMessage {
	public count!: number;
	public _message_id: number = 44;
	public _message_name: string = 'MISSION_COUNT';
	public _crc_extra: number = 114;
	public _message_fields: [string, string, boolean][] = [
		['count', 'uint16_t', false],
	];
}