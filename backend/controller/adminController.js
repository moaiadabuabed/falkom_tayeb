const oracledb = require('oracledb');
const { executeQuery } = require('../config/db');

// دالة مساعدة لتفادي أخطاء JSON.parse عند استقبال بيانات غير صالحة
const safeJsonParse = (str, fallback = []) => {
  if (!str) return fallback;
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

// --- EVENTS ---
exports.getEvents = async (req, res) => {
  try {
    const rows = await executeQuery(`SELECT * FROM EVENTS ORDER BY SUBMITTED_AT DESC`);
    
    const events = (rows || []).map(r => ({
      id: r.ID,
      userId: r.USER_ID || null,
      fullName: r.FULL_NAME,
      email: r.EMAIL,
      phone: r.PHONE,
      eventName: r.EVENT_NAME,
      eventType: r.EVENT_TYPE,
      package: r.PACKAGE_NAME,
      packageItems: safeJsonParse(r.PACKAGE_ITEMS, []),
      eventDate: r.EVENT_DATE,
      location: r.LOCATION,
      guestCount: r.GUEST_COUNT,
      eventDescription: r.EVENT_DESCRIPTION,
      specialRequest: r.SPECIAL_REQUEST,
      files: safeJsonParse(r.FILES, []),
      status: r.STATUS,
      adminRemarks: r.ADMIN_REMARKS,
      submittedAt: r.SUBMITTED_AT
    }));
    
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { status, adminRemarks } = req.body;

  try {
    await executeQuery(
      `UPDATE EVENTS SET 
        STATUS = NVL(:status, STATUS), 
        ADMIN_REMARKS = CASE 
                          WHEN :adminRemarks IS NULL THEN ADMIN_REMARKS 
                          ELSE TO_CLOB(:adminRemarks) 
                        END 
       WHERE ID = :id`,
      { 
        status: status || null, 
        adminRemarks: { val: adminRemarks !== undefined ? adminRemarks : null, type: oracledb.STRING }, 
        id: Number(id) 
      }
    );
    res.json({ message: 'Event updated successfully.' });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await executeQuery('DELETE FROM EVENTS WHERE ID = :id', { id: Number(id) });
    res.json({ message: 'Event deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- USERS ---
exports.getUsers = async (req, res) => {
  try {
    const rows = await executeQuery(`
      SELECT ID, USERNAME, EMAIL, PACKAGE, ROLE, CREATED_AT, PHONE 
      FROM USERS 
      ORDER BY CREATED_AT DESC
    `);
    
    const users = (rows || []).map(r => ({
      id: r.ID,
      username: r.USERNAME,
      email: r.EMAIL,
      phone: r.PHONE,
      package: r.PACKAGE,
      role: r.ROLE,
      createdAt: r.CREATED_AT
    }));
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await executeQuery('DELETE FROM USERS WHERE ID = :id', { id: Number(id) });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- CONTACT MESSAGES ---
// دالة استقبال رسالة "تواصل معنا" وحفظها في قاعدة البيانات لكي تظهر للأدمن
exports.submitContact = async (req, res) => {
  const { name, email, phone, eventType, message } = req.body;
  try {
    await executeQuery(
      `INSERT INTO CONTACT_MESSAGES (NAME, EMAIL, PHONE, EVENT_TYPE, MESSAGE) 
       VALUES (:name, :email, :phone, :eventType, :message)`,
      { 
        name: name || '', 
        email: email || '', 
        phone: phone || '', 
        eventType: eventType || '', 
        message: message || '' 
      }
    );
    res.status(201).json({ message: 'Contact message saved successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    const rows = await executeQuery('SELECT ID, NAME, EMAIL, PHONE, EVENT_TYPE, MESSAGE, CREATED_AT FROM CONTACT_MESSAGES ORDER BY CREATED_AT DESC');
    const messages = (rows || []).map(r => ({
      id: r.ID,
      name: r.NAME,
      email: r.EMAIL,
      phone: r.PHONE,
      eventType: r.EVENT_TYPE,
      message: r.MESSAGE,
      createdAt: r.CREATED_AT
    }));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteContactMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await executeQuery('DELETE FROM CONTACT_MESSAGES WHERE ID = :id', { id: Number(id) });
    res.json({ message: 'Contact message deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};