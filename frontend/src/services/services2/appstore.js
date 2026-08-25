// ======================================================
// Falkom Tayyeb - Application Store
// LocalStorage data management
// ======================================================

// ======================================================
// EVENTS
// ======================================================

export const USERS_EVENT = "falkom-users-change";
export const GALLERY_EVENT = "falkom-gallery-change";
export const CONTACT_EVENT = "falkom-contact-change";
export const SERVICES_EVENT = "falkom-services-change";
export const REQUIREMENTS_EVENT = "falkom-requirements-change";


// ======================================================
// USERS
// ======================================================

function seedUsersDB() {
  if (localStorage.getItem("usersDB")) return;

  localStorage.setItem(
    "usersDB",
    JSON.stringify([
      {
        id: 1,
        username: "Sami Jaber",
        email: "sami.jaber@example.com",
        package: "DIAMOND",
        joinedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      },
      {
        id: 2,
        username: "Lina Kareem",
        email: "lina.kareem@example.com",
        package: "GOLD",
        joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: 3,
        username: "Omar Haddad",
        email: "omar.haddad@example.com",
        package: "SILVER",
        joinedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ])
  );
}

export function getUsersDB() {
  seedUsersDB();

  try {
    return JSON.parse(localStorage.getItem("usersDB") || "[]");
  } catch {
    return [];
  }
}

export function saveUsersDB(list) {
  localStorage.setItem("usersDB", JSON.stringify(list));
  window.dispatchEvent(new Event(USERS_EVENT));
}

export function upsertUser({ username, email, package: pkg }) {
  const list = getUsersDB();

  const existing = list.find(
    (u) =>
      u.email &&
      email &&
      u.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    existing.username = username || existing.username;

    if (pkg) {
      existing.package = pkg;
    }
  } else {
    list.unshift({
      id: Date.now(),
      username:
        username || (email ? email.split("@")[0] : "Guest"),
      email,
      package: pkg || "—",
      joinedAt: new Date().toISOString(),
    });
  }

  saveUsersDB(list);
}

export function deleteUser(id) {
  saveUsersDB(
    getUsersDB().filter((user) => user.id !== id)
  );
}


// ======================================================
// EVENTS / BOOKINGS
// ======================================================

export function saveMyEvent(entry) {
  const existing = JSON.parse(
    localStorage.getItem("myEvents") || "[]"
  );

  const record = {
    id: Date.now(),
    submittedAt: new Date().toISOString(),
    status: "Pending",
    adminRemarks: "",
    ...entry,
  };

  existing.unshift(record);

  localStorage.setItem(
    "myEvents",
    JSON.stringify(existing)
  );

  return record;
}

export function getAllEvents() {
  try {
    return JSON.parse(
      localStorage.getItem("myEvents") || "[]"
    );
  } catch {
    return [];
  }
}

export function getMyEvents(email) {
  return getAllEvents().filter(
    (event) =>
      event.email &&
      email &&
      event.email.toLowerCase() === email.toLowerCase()
  );
}

export function getEventById(id) {
  return getAllEvents().find(
    (event) => String(event.id) === String(id)
  );
}

export function updateEvent(id, updates) {
  const events = getAllEvents();

  const updated = events.map((event) =>
    String(event.id) === String(id)
      ? { ...event, ...updates }
      : event
  );

  localStorage.setItem(
    "myEvents",
    JSON.stringify(updated)
  );

  return updated.find(
    (event) => String(event.id) === String(id)
  );
}

export function deleteEvent(id) {
  const events = getAllEvents();

  localStorage.setItem(
    "myEvents",
    JSON.stringify(
      events.filter(
        (event) => String(event.id) !== String(id)
      )
    )
  );
}


// ======================================================
// GALLERY
// ======================================================

export function getCustomGalleryImages() {
  try {
    return JSON.parse(
      localStorage.getItem("customGalleryImages") || "[]"
    );
  } catch {
    return [];
  }
}

export function addCustomGalleryImage(category, src) {
  const list = getCustomGalleryImages();

  list.unshift({
    id: Date.now(),
    category,
    src,
  });

  localStorage.setItem(
    "customGalleryImages",
    JSON.stringify(list)
  );

  window.dispatchEvent(
    new Event(GALLERY_EVENT)
  );
}

export function removeCustomGalleryImage(id) {
  const list = getCustomGalleryImages().filter(
    (image) => image.id !== id
  );

  localStorage.setItem(
    "customGalleryImages",
    JSON.stringify(list)
  );

  window.dispatchEvent(
    new Event(GALLERY_EVENT)
  );
}


// ======================================================
// CONTACT MESSAGES
// ======================================================

export function getContactMessages() {
  try {
    return JSON.parse(
      localStorage.getItem("contactMessages") || "[]"
    );
  } catch {
    return [];
  }
}

export function saveContactMessage(entry) {
  const list = getContactMessages();

  list.unshift({
    id: Date.now(),
    submittedAt: new Date().toISOString(),
    ...entry,
  });

  localStorage.setItem(
    "contactMessages",
    JSON.stringify(list)
  );

  window.dispatchEvent(
    new Event(CONTACT_EVENT)
  );
}

export function deleteContactMessage(id) {
  const list = getContactMessages().filter(
    (message) => message.id !== id
  );

  localStorage.setItem(
    "contactMessages",
    JSON.stringify(list)
  );

  window.dispatchEvent(
    new Event(CONTACT_EVENT)
  );
}


// ======================================================
// SERVICES
// ======================================================

export const DEFAULT_SERVICE_CARDS = [
  {
    title: "WEDDINGS",
    desc: "Beautifully planned weddings that reflect your love story.",
    iconName: "Heart",
  },
  {
    title: "CORPORATE EVENTS",
    desc: "Professional events that elevate your brand and engage your audience.",
    iconName: "Building2",
  },
  {
    title: "FASHION SHOWS",
    desc: "Creative production of stunning fashion shows that leave a lasting impression.",
    iconName: "Sparkles",
  },
  {
    title: "EXHIBITIONS",
    desc: "End-to-end exhibition solutions that showcase your brand.",
    iconName: "Store",
  },
  {
    title: "CONFERENCES",
    desc: "Seamless conference management for impactful and memorable events.",
    iconName: "Users",
  },
  {
    title: "PRIVATE EVENTS",
    desc: "Unique celebrations tailored to your special moments.",
    iconName: "PartyPopper",
  },
];

export const DEFAULT_EVENT_TYPES = [
  {
    title: "Government & Public Events",
    iconName: "Landmark",
  },
  {
    title: "Entertainment & Live Events",
    iconName: "Music",
  },
  {
    title: "Graduations & School Events",
    iconName: "GraduationCap",
  },
  {
    title: "Festivals & Cultural Events",
    iconName: "PartyPopper",
  },
  {
    title: "Product Launches",
    iconName: "Rocket",
  },
];

export const SERVICE_ICON_OPTIONS = [
  "Heart",
  "Building2",
  "Sparkles",
  "Store",
  "Users",
  "PartyPopper",
  "Music",
  "Landmark",
  "GraduationCap",
  "Rocket",
  "Star",
  "Crown",
  "ShieldCheck",
  "CheckCircle2",
];

export function getCustomServices() {
  try {
    return JSON.parse(
      localStorage.getItem("customServices") || "[]"
    );
  } catch {
    return [];
  }
}

export function getHiddenDefaultServices() {
  try {
    return JSON.parse(
      localStorage.getItem("hiddenDefaultServices") || "[]"
    );
  } catch {
    return [];
  }
}

export function getServicesBySection(section) {
  const hidden = getHiddenDefaultServices();

  const defaultsSource =
    section === "eventTypes"
      ? DEFAULT_EVENT_TYPES
      : DEFAULT_SERVICE_CARDS;

  const defaults = defaultsSource
    .filter(
      (item) =>
        !hidden.includes(
          `${section}:${item.title}`
        )
    )
    .map((item) => ({
      id: `default:${section}:${item.title}`,
      title: item.title,
      desc: item.desc || "",
      iconName: item.iconName,
      appearance: "icon",
      imageUrl: "",
      section,
      isDefault: true,
    }));

  const customs = getCustomServices()
    .filter((item) => item.section === section)
    .map((item) => ({
      ...item,
      isDefault: false,
    }));

  return [...defaults, ...customs];
}

export function addCustomService({
  title,
  desc,
  iconName,
  imageUrl,
  appearance,
  section,
}) {
  const cleanSection =
    section === "eventTypes"
      ? "eventTypes"
      : "cards";

  let cleanAppearance =
    appearance || "icon";

  if (
    cleanAppearance === "photo" &&
    cleanSection !== "cards"
  ) {
    cleanAppearance = "icon";
  }

  const list = getCustomServices();

  list.unshift({
    id: Date.now(),
    title,
    desc:
      cleanSection === "eventTypes"
        ? ""
        : desc || "",
    section: cleanSection,
    appearance: cleanAppearance,
    iconName: SERVICE_ICON_OPTIONS.includes(iconName)
      ? iconName
      : "Sparkles",
    imageUrl:
      cleanAppearance === "photo" ||
      cleanAppearance === "customIcon"
        ? imageUrl || ""
        : "",
  });

  localStorage.setItem(
    "customServices",
    JSON.stringify(list)
  );

  window.dispatchEvent(
    new Event(SERVICES_EVENT)
  );
}

export function removeService(service) {
  if (service.isDefault) {
    const key = `${service.section}:${service.title}`;

    const hidden = getHiddenDefaultServices();

    if (!hidden.includes(key)) {
      localStorage.setItem(
        "hiddenDefaultServices",
        JSON.stringify([
          ...hidden,
          key,
        ])
      );
    }
  } else {
    localStorage.setItem(
      "customServices",
      JSON.stringify(
        getCustomServices().filter(
          (item) => item.id !== service.id
        )
      )
    );
  }

  window.dispatchEvent(
    new Event(SERVICES_EVENT)
  );
}


// ======================================================
// PACKAGE REQUIREMENTS
// ======================================================

export const ALL_EVENT_TYPES = "ALL EVENT TYPES";

export const DEFAULT_PACKAGES = [
  ["SILVER", "Silver Package", []],
  ["GOLD", "Gold Package", []],
  ["DIAMOND", "Diamond Package", []],
];

function reqKey(eventType, packageType) {
  return `${eventType || ALL_EVENT_TYPES}||${packageType}`;
}

export function getPackageRequirementsStore() {
  try {
    return JSON.parse(
      localStorage.getItem("packageRequirements") || "{}"
    );
  } catch {
    return {};
  }
}

function savePackageRequirementsStore(store) {
  localStorage.setItem(
    "packageRequirements",
    JSON.stringify(store)
  );

  window.dispatchEvent(
    new Event(REQUIREMENTS_EVENT)
  );
}

export function getRequirementsFor(
  eventType,
  packageType
) {
  const store = getPackageRequirementsStore();

  const specific =
    store[reqKey(eventType, packageType)];

  if (specific) return specific;

  const general =
    store[reqKey(ALL_EVENT_TYPES, packageType)];

  if (general) return general;

  const fallback = DEFAULT_PACKAGES.find(
    (pkg) => pkg[0] === packageType
  );

  return fallback ? fallback[2] : [];
}

export function addRequirement(
  eventType,
  packageType,
  item
) {
  const store = getPackageRequirementsStore();

  const key = reqKey(
    eventType,
    packageType
  );

  const current =
    store[key] ||
    getRequirementsFor(
      eventType,
      packageType
    );

  if (current.includes(item)) return;

  store[key] = [
    ...current,
    item,
  ];

  savePackageRequirementsStore(store);
}

export function removeRequirements(
  eventType,
  packageType,
  itemsToRemove
) {
  const store = getPackageRequirementsStore();

  const key = reqKey(
    eventType,
    packageType
  );

  const current =
    store[key] ||
    getRequirementsFor(
      eventType,
      packageType
    );

  store[key] = current.filter(
    (item) =>
      !itemsToRemove.includes(item)
  );

  savePackageRequirementsStore(store);
}


// ======================================================
// BOOKING WIZARD
// ======================================================

export function clearWizardData() {
  [
    "eventDetails",
    "eventType",
    "package",
    "requirements",
  ].forEach((key) =>
    localStorage.removeItem(key)
  );
}

export function startBooking(navigate) {
  const target = "/book-event";
  clearWizardData();

  const token = localStorage.getItem("token");
  if (token) {
    navigate(target);
  } else {
    localStorage.setItem("afterLogin", target);
    navigate("/login", { state: { from: target } });
  }
}