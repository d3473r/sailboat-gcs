export enum MavEstimatorType {
	MAV_ESTIMATOR_TYPE_NAIVE = 1, // This is a naive estimator without any real covariance feedback.
	MAV_ESTIMATOR_TYPE_VISION = 2, // Computer vision based estimate. Might be up to scale.
	MAV_ESTIMATOR_TYPE_VIO = 3, // Visual-inertial estimate.
	MAV_ESTIMATOR_TYPE_GPS = 4, // Plain GPS estimate.
	MAV_ESTIMATOR_TYPE_GPS_INS = 5, // Estimator integrating GPS and inertial sensing.
	MAV_ESTIMATOR_TYPE_ENUM_END = 6, // 
}