import postBinary from "./postBinary";

export type ServiceLevel = "Free" | "Pro" | "Trial" | "Trial Expired" | "Lite";

export type StateResult = {
  service_level: ServiceLevel;
};

export default async function postState(): Promise<StateResult> {
  return postBinary<{ State: Record<any, never> }, StateResult>({ State: {} });
}
