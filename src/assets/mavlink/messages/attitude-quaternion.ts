import {MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';
import {readInt64LE, readUInt64LE} from '@ifrunistuttgart/node-mavlink';
/*
The attitude in the aeronautical frame (right-handed, Z-down, X-front, Y-right), expressed as quaternion. Quaternion order is w, x, y, z and a zero rotation would be expressed as (1 0 0 0).
*/
// time_boot_ms Timestamp (time since system boot). uint32_t
// q1 Quaternion component 1, w (1 in null-rotation) float
// q2 Quaternion component 2, x (0 in null-rotation) float
// q3 Quaternion component 3, y (0 in null-rotation) float
// q4 Quaternion component 4, z (0 in null-rotation) float
// rollspeed Roll angular speed float
// pitchspeed Pitch angular speed float
// yawspeed Yaw angular speed float
export class AttitudeQuaternion extends MAVLinkMessage {
	public time_boot_ms!: number;
	public q1!: number;
	public q2!: number;
	public q3!: number;
	public q4!: number;
	public rollspeed!: number;
	public pitchspeed!: number;
	public yawspeed!: number;
	public _message_id: number = 31;
	public _message_name: string = 'ATTITUDE_QUATERNION';
	public _crc_extra: number = 246;
	public _message_fields: [string, string, boolean][] = [
		['time_boot_ms', 'uint32_t', false],
		['q1', 'float', false],
		['q2', 'float', false],
		['q3', 'float', false],
		['q4', 'float', false],
		['rollspeed', 'float', false],
		['pitchspeed', 'float', false],
		['yawspeed', 'float', false],
	];
}