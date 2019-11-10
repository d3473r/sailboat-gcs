import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
import {MavCmd} from '../enums/mav-cmd';
/*
Message encoding a mission item.
*/
// seq Sequence uint16_t
// count Count int32_t
// command The scheduled action for the waypoint. uint16_t
// lat Latitude, expressed int32_t
// lon Longitude, expressed int32_t
export class MissionItemInt extends MAVLinkMessage {
	public seq!: number;
	public count!: number;
	public command!: MavCmd;
	public lat!: number;
	public lon!: number;
	public _message_id: number = 73;
	public _message_name: string = 'MISSION_ITEM_INT';
	public _crc_extra: number = 137;
	public _message_fields: [string, string, boolean][] = [
		['count', 'int32_t', false],
		['lat', 'int32_t', false],
		['lon', 'int32_t', false],
		['seq', 'uint16_t', false],
		['command', 'uint16_t', false],
	];
}