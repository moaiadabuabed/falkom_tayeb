const oracledb = require('oracledb');
const { executeQuery } = require('../config/db');

const safeJsonParse = (str, fallback = []) => {
  if (!str) return fallback;
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const userEmail = req.user ? req.user.email : null;

    if (!userId && !userEmail) {
      return res.status(401).json({ error: 'غير مصرح للوصول' });
    }

    const rows = await executeQuery(
      `SELECT * FROM EVENTS 
       WHERE USER_ID = :userId OR LOWER(EMAIL) = LOWER(:email) 
       ORDER BY SUBMITTED_AT DESC`,
      { 
        userId: userId || -1, 
        email: userEmail ? userEmail.trim() : '' 
      }
    );

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

exports.requestEvent = async (req, res) => {
  const {
    fullName, email, phone, eventName, eventType,
    package: pkg, packageItems, eventDate, location,
    guestCount, eventDescription, specialRequest, files
  } = req.body;

  const userId = req.user ? req.user.id : null;

  try {
    const result = await executeQuery(
      `INSERT INTO EVENTS (
        USER_ID, FULL_NAME, EMAIL, PHONE, EVENT_NAME, EVENT_TYPE,
        PACKAGE_NAME, PACKAGE_ITEMS, EVENT_DATE, LOCATION, GUEST_COUNT,
        EVENT_DESCRIPTION, SPECIAL_REQUEST, FILES, STATUS
      ) VALUES (
        :USER_ID, :FULL_NAME, :EMAIL, :PHONE, :EVENT_NAME, :EVENT_TYPE,
        :PACKAGE_NAME, :PACKAGE_ITEMS, TO_DATE(:EVENT_DATE, 'YYYY-MM-DD'), :LOCATION, :GUEST_COUNT,
        :EVENT_DESCRIPTION, :SPECIAL_REQUEST, :FILES, 'Pending'
      ) RETURNING ID INTO :OUT_ID`,
      {
        USER_ID: userId,
        FULL_NAME: fullName,
        EMAIL: email,
        PHONE: phone || '',
        EVENT_NAME: eventName,
        EVENT_TYPE: eventType,
        PACKAGE_NAME: pkg,
        PACKAGE_ITEMS: JSON.stringify(packageItems || []),
        EVENT_DATE: eventDate,
        LOCATION: location,
        GUEST_COUNT: parseInt(guestCount) || 0,
        EVENT_DESCRIPTION: eventDescription || '',
        SPECIAL_REQUEST: specialRequest || '',
        FILES: JSON.stringify(files || []),
        OUT_ID: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );

    const newId = result.outBinds.OUT_ID[0];
    res.status(201).json({ id: newId, status: 'Pending', message: 'Event request submitted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};