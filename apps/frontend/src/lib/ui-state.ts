export type UiActionState = "idle" | "pending" | "done" | "failed";

export const ACTION_LABELS: Record<UiActionState, string> = {
  idle: "",
  pending: "Выполняем...",
  done: "Готово",
  failed: "Ошибка",
};
