import type { CareerPageConfig } from "./types";

/**
 * Default career page template — used when an employer first enables their career page.
 * Employers customize from this baseline.
 */
export const DEFAULT_CAREER_PAGE_CONFIG: CareerPageConfig = {
  sections: [
    {
      type: "hero",
      headline: "Join Our Team",
      subheadline:
        "Help us build a more sustainable future. Explore open roles and find your next opportunity.",
    },
    {
      type: "about",
      title: "About Us",
      content:
        "We are a mission-driven organization committed to making a positive environmental impact. Our team is passionate about creating innovative solutions for a more sustainable world.",
    },
    {
      type: "values",
      title: "Our Values",
      items: [
        {
          icon: "Leaf",
          title: "Sustainability First",
          description: "Every decision we make considers its environmental impact.",
        },
        {
          icon: "Users",
          title: "Inclusive Culture",
          description: "We believe diverse perspectives lead to better solutions.",
        },
        {
          icon: "Lightbulb",
          title: "Innovation",
          description: "We continuously push boundaries to create meaningful change.",
        },
      ],
    },
    {
      type: "openRoles",
      title: "Open Positions",
      showFilters: true,
    },
    {
      type: "cta",
      headline: "Ready to make an impact?",
      buttonText: "View All Roles",
    },
  ],
  theme: {
    primaryColor: "#0A3D2C",
    fontFamily: "DM Sans",
  },
};
