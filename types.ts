export interface Step {
  id: number;
  title: string;
  shortDesc: string;
  detailedContent: string[];
  checklist: string[];
  tips: string[];
  icon: string;
  color: string;
  videoPrompt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// StepId enum for different JAMB registration steps
export enum StepId {
  PROFILE_CODE = "profile-code",
  PIN_VENDING = "pin-vending",
  REGISTRATION = "registration",
}
