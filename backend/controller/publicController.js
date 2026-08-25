const oracledb = require('oracledb');
const { executeQuery } = require('../config/db');

exports.getGallery = async (req, res) => {
  try {
    const rows = await executeQuery('SELECT ID, CATEGORY, SRC FROM GALLERY ORDER BY CREATED_AT DESC');
    const gallery = (rows || []).map(r => ({
      id: r.ID,
      category: r.CATEGORY,
      src: r.SRC
    }));
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addGalleryImage = async (req, res) => {
  const { category, src } = req.body;
  try {
    const result = await executeQuery(
      `INSERT INTO GALLERY (CATEGORY, SRC) VALUES (:category, :src) RETURNING ID INTO :id`,
      { category, src, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );
    res.status(201).json({ id: result.outBinds.id[0], category, src });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  const { id } = req.params;
  try {
    await executeQuery('DELETE FROM GALLERY WHERE ID = :id', { id });
    res.json({ message: 'Image deleted from gallery.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const rows = await executeQuery('SELECT ID, TITLE, DESCRIPTION, APPEARANCE, IMAGE_URL, ICON_NAME, SECTION, IS_DEFAULT FROM SERVICES ORDER BY ID ASC');
    const services = (rows || []).map(r => ({
      id: r.ID,
      title: r.TITLE,
      description: r.DESCRIPTION,
      appearance: r.APPEARANCE,
      imageUrl: r.IMAGE_URL,
      iconName: r.ICON_NAME,
      section: r.SECTION,
      isDefault: r.IS_DEFAULT
    }));
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addService = async (req, res) => {
  const { title, description, appearance, imageUrl, iconName, section } = req.body;
  try {
    const result = await executeQuery(
      `INSERT INTO SERVICES (TITLE, DESCRIPTION, APPEARANCE, IMAGE_URL, ICON_NAME, SECTION, IS_DEFAULT)
       VALUES (:title, :description, :appearance, :imageUrl, :iconName, :section, 0)
       RETURNING ID INTO :id`,
      {
        title,
        description: description || '',
        appearance: appearance || 'icon',
        imageUrl: imageUrl || '',
        iconName: iconName || 'Sparkles',
        section: section || 'cards',
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    res.status(201).json({ id: result.outBinds.id[0], title, section });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    await executeQuery('DELETE FROM SERVICES WHERE ID = :id', { id });
    res.json({ message: 'Service deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPackageRequirements = async (req, res) => {
  const { eventType, packageType } = req.query;
  try {
    let sql = 'SELECT ID, EVENT_TYPE, PACKAGE_TYPE, REQUIREMENT_ITEM FROM PACKAGE_REQUIREMENTS WHERE 1=1';
    const binds = {};

    if (eventType) {
      sql += ' AND (EVENT_TYPE = :eventType OR EVENT_TYPE = \'ALL EVENT TYPES\')';
      binds.eventType = eventType;
    }
    if (packageType) {
      sql += ' AND PACKAGE_TYPE = :packageType';
      binds.packageType = packageType;
    }

    const rows = await executeQuery(sql, binds);
    const requirements = (rows || []).map(r => ({
      id: r.ID,
      eventType: r.EVENT_TYPE,
      packageType: r.PACKAGE_TYPE,
      requirementItem: r.REQUIREMENT_ITEM
    }));
    res.json(requirements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addPackageRequirement = async (req, res) => {
  const { eventType, packageType, requirementItem } = req.body;
  try {
    const result = await executeQuery(
      `INSERT INTO PACKAGE_REQUIREMENTS (EVENT_TYPE, PACKAGE_TYPE, REQUIREMENT_ITEM)
       VALUES (:eventType, :packageType, :requirementItem) RETURNING ID INTO :id`,
      {
        eventType: eventType || 'ALL EVENT TYPES',
        packageType,
        requirementItem,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    res.status(201).json({ id: result.outBinds.id[0], requirementItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- أُضيفَت حديثاً لحل خطأ الـ Router وإرسال رسائل التواصل ---
exports.submitContact = async (req, res) => {
  const { name, email, phone, eventType, message } = req.body;
  try {
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    const result = await executeQuery(
      `INSERT INTO CONTACT_MESSAGES (NAME, EMAIL, PHONE, EVENT_TYPE, MESSAGE)
       VALUES (:name, :email, :phone, :eventType, :message) RETURNING ID INTO :id`,
      {
        name,
        email,
        phone: phone || '',
        eventType: eventType || '',
        message,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );

    res.status(201).json({ 
      success: true, 
      id: result.outBinds.id[0], 
      message: 'Your message was sent successfully.' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};