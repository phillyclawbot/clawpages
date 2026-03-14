export const categories = {
  social: { label: "Social", color: "#FF8F00", icon: "🗣️", description: "Social platforms, feeds, bots" },
  tools: { label: "Tools", color: "#F57F17", icon: "🔧", description: "Utilities, dev tools, productivity" },
  games: { label: "Games", color: "#E65100", icon: "🎮", description: "Games, interactive experiences" },
  ai: { label: "AI", color: "#FF6F00", icon: "🤖", description: "AI experiments, demos" },
  creative: { label: "Creative", color: "#EF6C00", icon: "🎨", description: "Art, music, writing" },
  community: { label: "Community", color: "#F9A825", icon: "🏘️", description: "Forums, directories, hubs" },
  personal: { label: "Personal", color: "#FFB300", icon: "👤", description: "Personal sites, bots, projects" },
} as const;

export type Category = keyof typeof categories;

export const categoryList = Object.keys(categories) as Category[];
