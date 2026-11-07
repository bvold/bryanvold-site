export const siteConfig = {
  name: "Bryan Vold",

  tagline: "Speculative Christian Fiction Writer",

  description:
    "The personal website and writing journal of Bryan Vold.",

  features: {
    showBooks: false, // set to true to show "My Books"
  },

  contact: {
    // Public Turnstile site key (Cloudflare dashboard → Turnstile).
    // Safe to commit; the matching secret key is a Worker secret.
    turnstileSiteKey: "0x4AAAAAAF37aoPyTiIqPXYe",
    reasons: [
      "Just saying hello",
      "Something I wrote",
      "Writing & books",
      "Speaking or podcast",
      "Something else",
    ],
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
