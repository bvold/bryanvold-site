export const siteConfig = {
  name: "Bryan Vold",

  tagline: "Speculative Christian Fiction Writer",

  description:
    "The personal website and writing journal of Bryan Vold.",

  features: {
    showBooks: true,
  },

  social: {
    instagram: "https://www.instagram.com/bryanvold/",
    pinterest: "https://www.pinterest.com/bryanvold/",
    facebook: "https://www.facebook.com/bryanvold/",
  },
};

export const navigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Blog",
    href: "/blog/",
  },
  {
    label: "My Books",
    href: "/my-books/",
    enabled: siteConfig.features.showBooks,
  },
  {
    label: "About",
    href: "/about/",
  },
  {
    label: "Contact",
    href: "/contact/",
  },
];