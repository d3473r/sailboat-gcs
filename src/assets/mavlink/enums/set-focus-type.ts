export enum SetFocusType {
	FOCUS_TYPE_STEP = 0, // Focus one step increment (-1 for focusing in, 1 for focusing out towards infinity).
	FOCUS_TYPE_CONTINUOUS = 1, // Continuous focus up/down until stopped (-1 for focusing in, 1 for focusing out towards infinity, 0 to stop focusing)
	FOCUS_TYPE_RANGE = 2, // Zoom value as proportion of full camera range (a value between 0.0 and 100.0)
	SET_FOCUS_TYPE_ENUM_END = 3, // 
}