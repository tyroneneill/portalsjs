import { Portal } from './portal'

export interface PortalOutlet {
  attach(portal: Portal): Promise<void>;

  hasAttached(): boolean;

  release(): Promise<void>;
}
