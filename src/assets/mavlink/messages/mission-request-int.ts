import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
/*
Request the information of the mission item with the sequence number seq.
*/
// seq Sequence uint16_t
// count Count int32_t
export class MissionRequestInt extends MAVLinkMessage {
	public seq!: number;
	public count!: number;
	public _message_id: number = 51;
	public _message_name: string = 'MISSION_REQUEST_INT';
	public _crc_extra: number = 1;
	public _message_fields: [string, string, boolean][] = [
		['count', 'int32_t', false],
		['seq', 'uint16_t', false],
	];
}