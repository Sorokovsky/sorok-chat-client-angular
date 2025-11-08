export const SidebarPosition = {
  left: "left",
  right: "right",
} as const;

export type SidebarPosition = keyof typeof SidebarPosition;
