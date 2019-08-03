import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
/*
The status of the boat.
*/
// roll Roll angle (-90..90) float
// pitch Pitch angle (-90..90) float
// heading Heading angle (0..359) float
// lat Latitude, expressed int32_t
// lon Longitude, expressed int32_t
// speed Speed over ground float
export class BoatStatus extends MAVLinkMessage {
	public roll!: number;
	public pitch!: number;
	public heading!: number;
	public lat!: number;
	public lon!: number;
	public speed!: number;
	public _message_id: number = 1;
	public _message_name: string = 'BOAT_STATUS';
	public _crc_extra: number = 69;
	public _message_fields: [string, string, boolean][] = [
		['roll', 'float', false],
		['pitch', 'float', false],
		['heading', 'float', false],
		['lat', 'int32_t', false],
		['lon', 'int32_t', false],
		['speed', 'float', false],
	];
}