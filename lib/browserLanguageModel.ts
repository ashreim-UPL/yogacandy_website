export type BuiltInLanguageModelAvailability =
  | "available"
  | "downloadable"
  | "downloading"
  | "unavailable";

type LanguageModelMonitor = {
  addEventListener(
    type: "downloadprogress",
    listener: (event: ProgressEvent<EventTarget>) => void,
  ): void;
};

type LanguageModelSession = {
  prompt(text: string): Promise<string>;
  destroy(): void;
};

type LanguageModelCreateOptions = {
  monitor?: (monitor: LanguageModelMonitor) => void;
  systemPrompt?: string;
  expectedInputs?: Array<{ type: "text"; languages?: string[] }>;
  expectedOutputs?: Array<{ type: "text"; languages?: string[] }>;
};

type LanguageModelAvailabilityOptions = Pick<
  LanguageModelCreateOptions,
  "expectedInputs" | "expectedOutputs"
>;

type LanguageModelConstructor = {
  availability(
    options?: LanguageModelAvailabilityOptions,
  ): Promise<BuiltInLanguageModelAvailability>;
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
};

declare global {
  // Chrome exposes the built-in AI Prompt API as a top-level LanguageModel global.
  // The typing is intentionally narrow so the client components can use it without
  // pulling in a browser-specific package.
  var LanguageModel: LanguageModelConstructor | undefined;
}

const LANGUAGE_MODEL_OPTIONS: LanguageModelAvailabilityOptions = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};

export function hasBuiltInLanguageModel(): boolean {
  return typeof globalThis.LanguageModel !== "undefined";
}

export async function getBuiltInLanguageModelAvailability(): Promise<BuiltInLanguageModelAvailability> {
  if (!hasBuiltInLanguageModel()) {
    return "unavailable";
  }

  try {
    return await globalThis.LanguageModel!.availability(LANGUAGE_MODEL_OPTIONS);
  } catch {
    return "unavailable";
  }
}

export async function canUseBuiltInLanguageModel(): Promise<boolean> {
  return (await getBuiltInLanguageModelAvailability()) !== "unavailable";
}

export async function createBuiltInLanguageModelSession(options: {
  systemPrompt: string;
  monitor?: (monitor: LanguageModelMonitor) => void;
}): Promise<LanguageModelSession> {
  if (!hasBuiltInLanguageModel()) {
    throw new Error("LanguageModel is not supported in this browser.");
  }

  const availability = await globalThis.LanguageModel!.availability(LANGUAGE_MODEL_OPTIONS);
  if (availability === "unavailable") {
    throw new Error("LanguageModel is not available on this device.");
  }

  return globalThis.LanguageModel!.create({
    ...LANGUAGE_MODEL_OPTIONS,
    systemPrompt: options.systemPrompt,
    monitor: options.monitor,
  });
}
