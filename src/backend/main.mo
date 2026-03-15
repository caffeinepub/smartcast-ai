import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Iter "mo:core/Iter";
import List "mo:core/List";



actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    company : Text;
    role : Text;
    phone : Text;
  };

  public type SensorReadings = {
    temperature : Nat;
    vibration : Nat;
    pressure : Nat;
    oilLevel : Nat;
    hoursSinceInspection : Nat;
    electricityUsage : Float;
    rpm : Nat;
  };

  public type TaskStatus = { #pending; #completed };

  public type MaintenanceTask = {
    description : Text;
    date : Text;
    status : TaskStatus;
    cost : Nat;
    remarks : Text;
  };

  public type Alert = {
    description : Text;
    severity : Text;
    likelihood : Nat;
    predictedFailureTime : Text;
  };

  public type AuthorityNotification = {
    machineId : Text;
    machineName : Text;
    message : Text;
    severity : Text;
    timestamp : Int;
  };

  public type Machine = {
    id : Text;
    manufacturer : Text;
    model : Text;
    location : Text;
    healthScore : Nat;
    sensorReadings : SensorReadings;
    maintenanceHistory : [MaintenanceTask];
    predictionAlerts : [Alert];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let machines = Map.empty<Text, Machine>();
  let notifications = List.empty<AuthorityNotification>();

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    checkUserPermission(caller);
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    checkUserPermission(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func hasUserProfile(userId : Principal) : async Bool {
    checkUserPermission(caller);
    userProfiles.containsKey(userId);
  };

  public query ({ caller }) func getUserProfile(userId : Principal) : async ?UserProfile {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(userId);
  };

  public query ({ caller }) func getMachine(machineId : Text) : async ?Machine {
    checkUserPermission(caller);
    machines.get(machineId);
  };

  public query ({ caller }) func getAllMachines() : async [Machine] {
    checkUserPermission(caller);
    machines.values().toArray();
  };

  public query ({ caller }) func getMaintenanceHistory(machineId : Text) : async [MaintenanceTask] {
    checkUserPermission(caller);
    switch (machines.get(machineId)) {
      case (?machine) { machine.maintenanceHistory };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getPredictionAlerts(machineId : Text) : async [Alert] {
    checkUserPermission(caller);
    switch (machines.get(machineId)) {
      case (?machine) { machine.predictionAlerts };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addMaintenanceTask(machineId : Text, task : MaintenanceTask) : async () {
    checkUserPermission(caller);
    switch (machines.get(machineId)) {
      case (?machine) {
        let tasks = List.fromArray<MaintenanceTask>(machine.maintenanceHistory);
        tasks.add(task);
        let updatedMachine = { machine with maintenanceHistory = tasks.toArray() };
        machines.add(machineId, updatedMachine);
      };
      case (null) {
        Runtime.trap("Machine not found");
      };
    };
  };

  public shared ({ caller }) func addAlert(machineId : Text, alert : Alert) : async () {
    checkUserPermission(caller);
    switch (machines.get(machineId)) {
      case (?machine) {
        let alerts = List.fromArray<Alert>(machine.predictionAlerts);
        alerts.add(alert);
        let updatedMachine = { machine with predictionAlerts = alerts.toArray() };
        machines.add(machineId, updatedMachine);
      };
      case (null) {
        Runtime.trap("Machine not found");
      };
    };
  };

  public shared ({ caller }) func updateSensorReadings(machineId : Text, readings : SensorReadings) : async () {
    checkUserPermission(caller);
    switch (machines.get(machineId)) {
      case (?machine) {
        let updatedMachine = { machine with sensorReadings = readings };
        machines.add(machineId, updatedMachine);
      };
      case (null) {
        Runtime.trap("Machine not found");
      };
    };
  };

  public shared ({ caller }) func updateHealthScore(machineId : Text, score : Nat) : async () {
    checkUserPermission(caller);
    switch (machines.get(machineId)) {
      case (?machine) {
        let updatedMachine = { machine with healthScore = score };
        machines.add(machineId, updatedMachine);
      };
      case (null) {
        Runtime.trap("Machine not found");
      };
    };
  };

  public shared ({ caller }) func addMachine(machine : Machine) : async () {
    checkUserPermission(caller);
    machines.add(machine.id, machine);
  };

  public shared ({ caller }) func removeMachine(machineId : Text) : async () {
    checkUserPermission(caller);
    machines.remove(machineId);
  };

  public shared ({ caller }) func notifyAuthorities(machineId : Text, machineName : Text, message : Text, severity : Text) : async () {
    checkUserPermission(caller);
    let notification : AuthorityNotification = {
      machineId;
      machineName;
      message;
      severity;
      timestamp = Time.now();
    };
    notifications.add(notification);
  };

  public query ({ caller }) func getNotifications() : async [AuthorityNotification] {
    checkUserPermission(caller);
    notifications.toArray();
  };

  public shared ({ caller }) func clearNotifications() : async () {
    checkAdminPermission(caller);
    notifications.clear();
  };

  func checkUserPermission(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func checkAdminPermission(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };
};
