import { Waypoint } from './waypoint';

export class ReplayWaypoint extends Waypoint {
  public timestamp: Date;
  
  constructor(params: ReplayWaypoint = {} as ReplayWaypoint) {
    super(params);
    this.timestamp = new Date(params.timestamp);
  }
}