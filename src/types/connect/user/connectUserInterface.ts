import type { PresenceStatus } from "./presenceStatusType";
import type { UserBaseIdentity } from "./userBaseIdentity";

export * from "./userBaseIdentity";

export interface ConnectUser extends UserBaseIdentity {
  presence?: PresenceStatus;
  status?: string;
  lastSeen?: string;
  customStatus?: string;
  phone?: string;
  [key: string]: any;
}
