import { useEffect, useState } from "react";
import { api } from "./api.js";

/*
  =========================================================================
  CUSTOMER AUTH & ADMIN AUTH
  =========================================================================
*/
const AUTH_EVENT = "falkom-auth-change";
const ADMIN_AUTH_EVENT = "falkom-admin-auth-change";

export function getToken() { return localStorage.getItem("token"); }
export function getAdminToken() { return localStorage.getItem("adminToken"); }

export function getUser() { 
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } 
}

export function setAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  
  if (user && user.role === 'admin') {
    localStorage.setItem("adminToken", token);
    window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function setAdminAuth(token = "admin-demo-token") {
  localStorage.setItem("adminToken", token);
  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("adminToken");
  window.dispatchEvent(new Event(AUTH_EVENT));
  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}

export function clearAdminAuth() {
  localStorage.removeItem("adminToken");
  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}

export function useAuth() {
  const [user, setUserState] = useState(getUser());
  useEffect(() => {
    const sync = () => setUserState(getUser());
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(AUTH_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  return user;
}

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(!!getAdminToken());
  useEffect(() => {
    const sync = () => {
      const user = getUser();
      setIsAdmin(!!getAdminToken() || (user && user.role === 'admin'));
    };
    window.addEventListener(ADMIN_AUTH_EVENT, sync);
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { 
      window.removeEventListener(ADMIN_AUTH_EVENT, sync); 
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync); 
    };
  }, []);
  return isAdmin;
}

/*
  =========================================================================
  USER MANAGEMENT HELPERS
  =========================================================================
*/
export function upsertUser(userData) {
  try {
    const currentUser = getUser() || {};
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event(AUTH_EVENT));
    return updatedUser;
  } catch (err) {
    console.error("Error in upsertUser:", err);
    return null;
  }
}

/*
  =========================================================================
  EVENTS (DIRECT DATABASE ACCESS VIA API)
  =========================================================================
*/
export async function saveMyEvent(entry) {
  const user = getUser();
  const fullEntry = {
    ...entry,
    email: entry.email || user?.email || ""
  };

  return await api.requestEvent(fullEntry);
}

export async function getMyEvents() {
  try {
    // الاستعلام مباشرة من Oracle DB عبر الـ API
    const data = await api.getMyEvents();
    if (Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.error("خطأ في جلب الفعاليات من قاعدة البيانات:", err);
  }
  return [];
}

export async function getAllEvents() {
  try {
    const res = await api.adminGetEvents();
    return Array.isArray(res) ? res : [];
  } catch (err) {
    console.error("Error loading events:", err);
    return [];
  }
}

export async function updateEvent(id, changes = {}) {
  return await api.adminUpdateEvent(id, changes.status, changes.adminRemarks);
}

export async function deleteEvent(id) {
  return await api.adminDeleteEvent(id);
}

/*
  =========================================================================
  USERS DIRECTORY (API INTEGRATION)
  =========================================================================
*/
export const USERS_EVENT = "falkom-users-change";

export async function getUsersDB() {
  try {
    const res = await api.adminGetUsers();
    return Array.isArray(res) ? res : [];
  } catch (err) {
    console.error("Error loading users:", err);
    return [];
  }
}

export async function deleteUser(id) {
  const res = await api.adminDeleteUser(id);
  window.dispatchEvent(new Event(USERS_EVENT));
  return res;
}

/*
  =========================================================================
  GALLERY (API INTEGRATION)
  =========================================================================
*/
export const GALLERY_EVENT = "falkom-gallery-change";

export async function getCustomGalleryImages() {
  try {
    const res = await api.getGallery();
    return Array.isArray(res) ? res : [];
  } catch (err) {
    console.error("Error fetching gallery:", err);
    return [];
  }
}

export async function addCustomGalleryImage(category, src) {
  const res = await api.adminAddGalleryImage({ category, src });
  window.dispatchEvent(new Event(GALLERY_EVENT));
  return res;
}

export async function removeCustomGalleryImage(id) {
  const res = await api.adminDeleteGalleryImage(id);
  window.dispatchEvent(new Event(GALLERY_EVENT));
  return res;
}

/*
  =========================================================================
  SERVICES (API INTEGRATION)
  =========================================================================
*/
export const SERVICES_EVENT = "falkom-services-change";

export async function getServicesBySection(section) {
  try {
    const allServices = await api.getServices();
    if (!Array.isArray(allServices)) return [];
    return allServices.filter(s => s.section === section);
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
}

export async function addCustomService({ title, desc, iconName, imageUrl, appearance, section }) {
  const res = await api.adminAddService({
    title,
    description: desc,
    iconName,
    imageUrl,
    appearance,
    section
  });
  window.dispatchEvent(new Event(SERVICES_EVENT));
  return res;
}

export async function removeService(service) {
  const res = await api.adminDeleteService(service.id);
  window.dispatchEvent(new Event(SERVICES_EVENT));
  return res;
}

/*
  =========================================================================
  PACKAGE REQUIREMENTS (API INTEGRATION)
  =========================================================================
*/
export const REQUIREMENTS_EVENT = "falkom-requirements-change";
export const ALL_EVENT_TYPES = "ALL EVENT TYPES";

export async function getRequirementsFor(eventType, packageType) {
  try {
    const res = await api.getPackageRequirements(eventType, packageType);
    if (!Array.isArray(res)) return [];
    return res.map(r => r.requirementItem);
  } catch (err) {
    console.error("Error loading package requirements:", err);
    return [];
  }
}

export async function addRequirement(eventType, packageType, item) {
  const res = await api.adminAddPackageRequirement({
    eventType: eventType || ALL_EVENT_TYPES,
    packageType,
    requirementItem: item
  });
  window.dispatchEvent(new Event(REQUIREMENTS_EVENT));
  return res;
}

export async function removeRequirement(id) {
  const res = await api.adminDeletePackageRequirement(id);
  window.dispatchEvent(new Event(REQUIREMENTS_EVENT));
  return res;
}

export async function removeRequirements(id) {
  return await removeRequirement(id);
}

/*
  =========================================================================
  CONTACT MESSAGES (API INTEGRATION)
  =========================================================================
*/
export async function saveContactMessage(contactData) {
  try {
    return await api.submitContact(contactData);
  } catch (err) {
    console.error("Error sending contact message:", err);
    throw err;
  }
}

/*
  =========================================================================
  WIZARD HELPERS
  =========================================================================
*/
export function clearWizardData() {
  ["eventDetails", "eventType", "package", "requirements"].forEach(key => localStorage.removeItem(key));
}

export function startBooking(navigate) {
  const target = "/event-details";
  clearWizardData();
  if (getToken()) navigate(target);
  else {
    localStorage.setItem("afterLogin", target);
    navigate("/login", { state: { from: target } });
  }
}