const ROLE_ROUTES = {
  ADMINISTRATOR: ["home", "shops", "owners", "profile"],
  SHOP_OWNER: [
    "home",
    "operators",
    "categories",
    "products",
    "stock",
    "sales",
    "onholdbills",
    "pos",
    "returns",
    "history",
    "reports",
    "settings",
    "profile",
  ],
  SHOP_OPERATOR: [
    "home",
    "categories",
    "products",
    "stock",
    "sales",
    "onholdbills",
    "pos",
    "returns",
    "history",
    "reports",
    "profile",
  ],
  EXP_SUBCRIPTION: ["home", "profile"],
};

const PUBLIC_ROUTES = ["signin", "signup", "about", "help", "password-reset"];

const NO_AUTH_ROUTES = ["signin", "signup", "password-reset"];

export default {
  ...ROLE_ROUTES,
  PUBLIC_ROUTES,
  NO_AUTH_ROUTES,
};
