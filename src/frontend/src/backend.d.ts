import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AuthorityNotification {
    message: string;
    timestamp: bigint;
    severity: string;
    machineId: string;
    machineName: string;
}
export interface Machine {
    id: string;
    model: string;
    manufacturer: string;
    predictionAlerts: Array<Alert>;
    healthScore: bigint;
    sensorReadings: SensorReadings;
    location: string;
    maintenanceHistory: Array<MaintenanceTask>;
}
export interface SensorReadings {
    rpm: bigint;
    oilLevel: bigint;
    temperature: bigint;
    vibration: bigint;
    hoursSinceInspection: bigint;
    pressure: bigint;
    electricityUsage: number;
}
export interface Alert {
    description: string;
    severity: string;
    likelihood: bigint;
    predictedFailureTime: string;
}
export interface UserProfile {
    name: string;
    role: string;
    company: string;
    phone: string;
}
export interface MaintenanceTask {
    status: TaskStatus;
    cost: bigint;
    date: string;
    description: string;
    remarks: string;
}
export enum TaskStatus {
    pending = "pending",
    completed = "completed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAlert(machineId: string, alert: Alert): Promise<void>;
    addMachine(machine: Machine): Promise<void>;
    addMaintenanceTask(machineId: string, task: MaintenanceTask): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearNotifications(): Promise<void>;
    getAllMachines(): Promise<Array<Machine>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMachine(machineId: string): Promise<Machine | null>;
    getMaintenanceHistory(machineId: string): Promise<Array<MaintenanceTask>>;
    getNotifications(): Promise<Array<AuthorityNotification>>;
    getPredictionAlerts(machineId: string): Promise<Array<Alert>>;
    getUserProfile(userId: Principal): Promise<UserProfile | null>;
    hasUserProfile(userId: Principal): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    notifyAuthorities(machineId: string, machineName: string, message: string, severity: string): Promise<void>;
    removeMachine(machineId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateHealthScore(machineId: string, score: bigint): Promise<void>;
    updateSensorReadings(machineId: string, readings: SensorReadings): Promise<void>;
}
