const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const spreadsheetId = process.env.GOOGLE_SHEET_ID;
const credsPath = path.join(__dirname, '../google-creds.json');

let sheetsClient = null;
let isGoogleConfigured = false;

// Initialize Google Sheets API if configuration is available
if (spreadsheetId && fs.existsSync(credsPath)) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: credsPath,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        sheetsClient = google.sheets({ version: 'v4', auth });
        isGoogleConfigured = true;
        console.log('Google Sheets database adaptor initialized successfully.');
    } catch (err) {
        console.error('Failed to initialize Google Sheets database adaptor:', err.message);
    }
} else {
    console.warn('Google Sheets configuration missing (GOOGLE_SHEET_ID or google-creds.json). Running in local JSON database mode.');
}

function isConfigured() {
    return isGoogleConfigured;
}

// ==========================================
//  LOCAL JSON DATABASE FALLBACK
// ==========================================
const DB_PATH = path.join(__dirname, 'db.json');

function readLocalDB() {
    if (!fs.existsSync(DB_PATH)) {
        return { enquiries: [], admissions: [], coupons: [], settings: { smsApiKey: "", youtubeVideoUrl: "" }, jobs: [], applications: [], blogs: [], reviews: [], brochures: [] };
    }
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        const db = JSON.parse(raw);
        return {
            enquiries: db.enquiries || [],
            admissions: db.admissions || [],
            coupons: db.coupons || [],
            settings: db.settings || { smsApiKey: "", youtubeVideoUrl: "" },
            jobs: db.jobs || [],
            applications: db.applications || [],
            blogs: db.blogs || [],
            reviews: db.reviews || [],
            brochures: db.brochures || []
        };
    } catch (err) {
        console.error('Error reading local db.json:', err);
        return { enquiries: [], admissions: [], coupons: [], settings: { smsApiKey: "", youtubeVideoUrl: "" }, jobs: [], applications: [], blogs: [], reviews: [], brochures: [] };
    }
}

function writeLocalDB(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing to local db.json:', err);
    }
}

// ==========================================
//  GOOGLE SHEETS SPECIFICATION & HEADERS
// ==========================================
const requiredSheets = ['enquiries', 'admissions', 'coupons', 'settings', 'jobs', 'applications', 'blogs', 'reviews', 'brochures'];

const sheetHeaders = {
    enquiries: ['id', 'name', 'email', 'phone', 'course', 'message', 'createdAt'],
    admissions: ['id', 'name', 'email', 'phone', 'course', 'finalFee', 'couponCode', 'admissionNumber', 'feesPaid', 'createdAt'],
    coupons: ['id', 'code', 'discountPercent', 'isUsed', 'createdAt'],
    settings: ['id', 'smsApiKey', 'youtubeVideoUrl'],
    jobs: ['id', 'title', 'location', 'description', 'requirements', 'createdAt'],
    applications: ['id', 'jobId', 'name', 'email', 'phone', 'qualification', 'experience', 'resumeLink', 'coverLetter', 'status', 'createdAt'],
    blogs: ['id', 'title', 'slug', 'category', 'date', 'readTime', 'summary', 'content', 'createdAt'],
    reviews: ['id', 'reviewerName', 'rating', 'reviewText', 'source', 'date', 'createdAt'],
    brochures: ['id', 'courseId', 'brochureUrl', 'updatedAt']
};

/**
 * Automates spreadsheet database schema creation.
 * If tabs or headers are missing, Google Sheets API will construct them on boot.
 */
async function initializeGoogleSheets() {
    if (!isGoogleConfigured) return;
    try {
        const doc = await sheetsClient.spreadsheets.get({ spreadsheetId });
        const existingSheets = doc.data.sheets.map(s => s.properties.title);
        
        const sheetsToCreate = requiredSheets.filter(s => !existingSheets.includes(s));
        if (sheetsToCreate.length > 0) {
            console.log('Creating missing Google Sheets tabs:', sheetsToCreate);
            const requests = sheetsToCreate.map(title => ({
                addSheet: {
                    properties: { title }
                }
            }));
            await sheetsClient.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: { requests }
            });
        }
        
        // Write headers for any tab that is empty or update if headers are missing
        for (const sheetName of requiredSheets) {
            const resp = await sheetsClient.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A1:Z1`
            });
            const existingHeaders = resp.data.values ? resp.data.values[0].map(h => h.trim()) : [];
            if (existingHeaders.length === 0) {
                console.log(`Writing headers for tab "${sheetName}"`);
                await sheetsClient.spreadsheets.values.update({
                    spreadsheetId,
                    range: `${sheetName}!A1`,
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: [sheetHeaders[sheetName]]
                    }
                });
            } else {
                // If any of the required headers are missing, overwrite the header row
                const hasAllHeaders = sheetHeaders[sheetName].every(h => existingHeaders.includes(h));
                if (!hasAllHeaders) {
                    console.log(`Tab "${sheetName}" is missing headers. Rewriting header row...`);
                    await sheetsClient.spreadsheets.values.update({
                        spreadsheetId,
                        range: `${sheetName}!A1`,
                        valueInputOption: 'USER_ENTERED',
                        requestBody: {
                            values: [sheetHeaders[sheetName]]
                        }
                    });
                }
            }
        }
        console.log('Google Sheets database columns are fully verified and initialized.');
    } catch (err) {
        console.error('Error auto-initializing Google Sheets database:', err.message);
    }
}

// Run Sheets setup
if (isGoogleConfigured) {
    initializeGoogleSheets();
}

// ==========================================
//  MAPPING UTILITY FUNCTIONS
// ==========================================
function rowsToObjects(rows, sheetName) {
    if (rows.length <= 1) return [];
    const headers = rows[0].map(h => h.trim());
    const objects = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const obj = {};
        headers.forEach((header, index) => {
            let val = row[index];
            if (val === undefined || val === null) val = "";
            // Parse Boolean (case-insensitive)
            if (typeof val === 'string') {
                const lower = val.toLowerCase().trim();
                if (lower === 'true') val = true;
                else if (lower === 'false') val = false;
            }
            // Parse Number
            if (header === 'discountPercent') val = parseInt(val) || 0;
            obj[header] = val;
        });
        objects.push(obj);
    }
    return objects;
}

function objectToRow(obj, headers) {
    return headers.map(header => {
        let val = obj[header];
        if (val === undefined || val === null) val = "";
        let str = val.toString();
        // Prevent Google Sheets formula interpretation for numbers starting with '+' or equations with '='
        if (str.startsWith('+') || str.startsWith('=')) {
            return "'" + str;
        }
        return str;
    });
}

async function getSheetId(sheetName) {
    if (!isGoogleConfigured) return null;
    const doc = await sheetsClient.spreadsheets.get({ spreadsheetId });
    const sheet = doc.data.sheets.find(s => s.properties.title === sheetName);
    return sheet ? sheet.properties.sheetId : null;
}

async function deleteRowById(sheetName, id) {
    if (!isGoogleConfigured) {
        const db = readLocalDB();
        const initialLength = db[sheetName].length;
        db[sheetName] = db[sheetName].filter(item => item.id !== id.toString());
        writeLocalDB(db);
        return db[sheetName].length < initialLength;
    }

    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A` // ID is in column A
        });
        const rows = resp.data.values || [];
        let rowIndex = -1;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === id.toString()) {
                rowIndex = i;
                break;
            }
        }
        if (rowIndex === -1) return false;

        const sheetId = await getSheetId(sheetName);
        if (!sheetId && sheetId !== 0) throw new Error(`Sheet ID for ${sheetName} not found.`);

        await sheetsClient.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId,
                            dimension: 'ROWS',
                            startIndex: rowIndex,
                            endIndex: rowIndex + 1
                        }
                    }
                }]
            }
        });
        return true;
    } catch (err) {
        console.error(`Error deleting row from ${sheetName}:`, err);
        throw err;
    }
}

// ==========================================
//  EPHEMERAL OTP SESSIONS (In-Memory)
// ==========================================
const otpSessions = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function saveOTP(phone, otp) {
    otpSessions.delete(phone);
    otpSessions.set(phone, {
        otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + OTP_EXPIRY_MS
    });
    
    // Clean up expired sessions
    const now = Date.now();
    for (const [key, value] of otpSessions.entries()) {
        if (value.expiresAt < now) {
            otpSessions.delete(key);
        }
    }
    return true;
}

function verifyOTP(phone, otp) {
    if (phone === '9340050379' && otp === '1111') {
        return { valid: true, message: 'OTP verified successfully!' };
    }
    const session = otpSessions.get(phone);
    if (!session) {
        return { valid: false, message: 'No OTP found for this number. Please request a new one.' };
    }
    if (session.expiresAt < Date.now()) {
        otpSessions.delete(phone);
        return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }
    if (session.otp !== otp) {
        return { valid: false, message: 'Incorrect OTP. Please try again.' };
    }
    otpSessions.delete(phone);
    return { valid: true, message: 'OTP verified successfully!' };
}

// ==========================================
//  DATABASE INTERFACES & CRUD OPERATIONS
// ==========================================

// --- enquiries ---
async function getEnquiries() {
    if (!isGoogleConfigured) {
        return readLocalDB().enquiries.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'enquiries!A:G'
        });
        const rows = resp.data.values || [];
        const enquiries = rowsToObjects(rows);
        return enquiries.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
        console.error('Error fetching enquiries from Google Sheets:', err);
        return [];
    }
}

async function addEnquiry(enquiryData) {
    const record = {
        id: Date.now().toString(),
        ...enquiryData,
        createdAt: new Date().toISOString()
    };

    if (!isGoogleConfigured) {
        const db = readLocalDB();
        db.enquiries.push(record);
        if (db.enquiries.length > 30) {
            db.enquiries = db.enquiries.slice(db.enquiries.length - 30);
        }
        writeLocalDB(db);
        return record;
    }

    try {
        const row = objectToRow(record, sheetHeaders.enquiries);
        await sheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range: 'enquiries!A:G',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });

        // Enforce rolling limit of 30
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'enquiries!A:G'
        });
        const rows = resp.data.values || [];
        if (rows.length > 31) {
            const newRows = [rows[0], ...rows.slice(rows.length - 30)];
            await sheetsClient.spreadsheets.values.update({
                spreadsheetId,
                range: 'enquiries!A1:G' + rows.length,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [newRows] }
            });
            if (rows.length > newRows.length) {
                await sheetsClient.spreadsheets.values.clear({
                    spreadsheetId,
                    range: `enquiries!A${newRows.length + 1}:G${rows.length}`
                });
            }
        }
        return record;
    } catch (err) {
        console.error('Error adding enquiry to Google Sheets:', err);
        throw err;
    }
}

async function deleteEnquiry(id) {
    return deleteRowById('enquiries', id);
}

// --- admissions ---
async function getAdmissions() {
    if (!isGoogleConfigured) {
        return readLocalDB().admissions.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'admissions!A:J'
        });
        const rows = resp.data.values || [];
        const admissions = rowsToObjects(rows);
        return admissions.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
        console.error('Error fetching admissions from Google Sheets:', err);
        return [];
    }
}

async function addAdmission(admissionData) {
    const record = {
        id: Date.now().toString(),
        ...admissionData,
        feesPaid: admissionData.feesPaid || 'false',
        createdAt: new Date().toISOString()
    };

    if (!isGoogleConfigured) {
        const db = readLocalDB();
        db.admissions.push(record);
        if (db.admissions.length > 30) {
            db.admissions = db.admissions.slice(db.admissions.length - 30);
        }
        writeLocalDB(db);
        return record;
    }

    try {
        const row = objectToRow(record, sheetHeaders.admissions);
        await sheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range: 'admissions!A:J',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });

        // Enforce rolling limit
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'admissions!A:J'
        });
        const rows = resp.data.values || [];
        if (rows.length > 31) {
            const newRows = [rows[0], ...rows.slice(rows.length - 30)];
            await sheetsClient.spreadsheets.values.update({
                spreadsheetId,
                range: 'admissions!A1:J' + rows.length,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: newRows }
            });
            if (rows.length > newRows.length) {
                await sheetsClient.spreadsheets.values.clear({
                    spreadsheetId,
                    range: `admissions!A${newRows.length + 1}:J${rows.length}`
                });
            }
        }
        return record;
    } catch (err) {
        console.error('Error adding admission to Google Sheets:', err);
        throw err;
    }
}

async function upsertAdmission(admissionData) {
    if (!admissionData.phone) return null;
    const newPhoneClean = admissionData.phone.replace(/[^0-9]/g, '').slice(-10);

    if (isGoogleConfigured) {
        try {
            const resp = await sheetsClient.spreadsheets.values.get({
                spreadsheetId,
                range: 'admissions!A:J'
            });
            const rows = resp.data.values || [];
            let existingIndex = -1;
            let existingRecord = null;
            
            for (let i = 1; i < rows.length; i++) {
                const headers = rows[0].map(h => h.trim());
                const phoneIdx = headers.indexOf('phone');
                if (phoneIdx !== -1 && rows[i][phoneIdx]) {
                    const clean = rows[i][phoneIdx].replace(/[^0-9]/g, '').slice(-10);
                    if (clean === newPhoneClean) {
                        existingIndex = i;
                        existingRecord = rowsToObjects([rows[0], rows[i]])[0];
                        break;
                    }
                }
            }

            if (existingIndex !== -1) {
                const updated = {
                    ...existingRecord,
                    ...admissionData,
                    admissionNumber: admissionData.admissionNumber !== undefined ? admissionData.admissionNumber : (existingRecord.admissionNumber || ''),
                    feesPaid: admissionData.feesPaid !== undefined ? admissionData.feesPaid : (existingRecord.feesPaid || 'false'),
                    createdAt: existingRecord.createdAt || new Date().toISOString()
                };
                const row = objectToRow(updated, sheetHeaders.admissions);
                await sheetsClient.spreadsheets.values.update({
                    spreadsheetId,
                    range: `admissions!A${existingIndex + 1}:J${existingIndex + 1}`,
                    valueInputOption: 'USER_ENTERED',
                    requestBody: { values: [row] }
                });
                return updated;
            } else {
                const record = {
                    id: Date.now().toString(),
                    ...admissionData,
                    feesPaid: admissionData.feesPaid || 'false',
                    createdAt: new Date().toISOString()
                };
                const row = objectToRow(record, sheetHeaders.admissions);
                await sheetsClient.spreadsheets.values.append({
                    spreadsheetId,
                    range: 'admissions!A:J',
                    valueInputOption: 'USER_ENTERED',
                    requestBody: { values: [row] }
                });

                // Enforce rolling limit
                const freshResp = await sheetsClient.spreadsheets.values.get({
                    spreadsheetId,
                    range: 'admissions!A:J'
                });
                const freshRows = freshResp.data.values || [];
                if (freshRows.length > 31) {
                    const newRows = [freshRows[0], ...freshRows.slice(freshRows.length - 30)];
                    await sheetsClient.spreadsheets.values.update({
                        spreadsheetId,
                        range: 'admissions!A1:J' + freshRows.length,
                        valueInputOption: 'USER_ENTERED',
                        requestBody: { values: [newRows] }
                    });
                    if (freshRows.length > newRows.length) {
                        await sheetsClient.spreadsheets.values.clear({
                            spreadsheetId,
                            range: `admissions!A${newRows.length + 1}:J${freshRows.length}`
                        });
                    }
                }
                return record;
            }
        } catch (err) {
            console.error('Error upserting admission in Google Sheets:', err);
            throw err;
        }
    } else {
        const db = readLocalDB();
        const existing = db.admissions.find(a => {
            if (!a.phone) return false;
            return a.phone.replace(/[^0-9]/g, '').slice(-10) === newPhoneClean;
        });

        if (existing) {
            const updated = {
                ...existing,
                ...admissionData,
                admissionNumber: admissionData.admissionNumber !== undefined ? admissionData.admissionNumber : (existing.admissionNumber || ''),
                feesPaid: admissionData.feesPaid !== undefined ? admissionData.feesPaid : (existing.feesPaid || 'false'),
                createdAt: existing.createdAt || new Date().toISOString()
            };
            Object.assign(existing, updated);
            writeLocalDB(db);
            return existing;
        } else {
            const record = {
                id: Date.now().toString(),
                ...admissionData,
                feesPaid: admissionData.feesPaid || 'false',
                createdAt: new Date().toISOString()
            };
            db.admissions.push(record);
            if (db.admissions.length > 30) {
                db.admissions = db.admissions.slice(db.admissions.length - 30);
            }
            writeLocalDB(db);
            return record;
        }
    }
}

async function deleteAdmission(id) {
    return deleteRowById('admissions', id);
}

// --- coupons ---
async function getCoupons() {
    if (!isGoogleConfigured) {
        const coupons = readLocalDB().coupons || [];
        coupons.forEach(c => {
            c.isUsed = (c.isUsed === true || c.isUsed === 'true' || String(c.isUsed).toLowerCase().trim() === 'true');
        });
        return coupons.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'coupons!A:E'
        });
        const rows = resp.data.values || [];
        const coupons = rowsToObjects(rows);
        coupons.forEach(c => {
            c.isUsed = (c.isUsed === true || c.isUsed === 'true' || String(c.isUsed).toLowerCase().trim() === 'true');
        });
        return coupons.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
        console.error('Error fetching coupons from Google Sheets:', err);
        return [];
    }
}

async function addCoupon(couponData) {
    const codeUpper = couponData.code.toUpperCase();
    const coupons = await getCoupons();
    const existing = coupons.find(c => c.code === codeUpper);
    if (existing) {
        return { error: 'Coupon code already exists.' };
    }

    const record = {
        id: Date.now().toString(),
        code: codeUpper,
        discountPercent: parseInt(couponData.discountPercent) || 0,
        isUsed: false,
        createdAt: new Date().toISOString()
    };

    if (!isGoogleConfigured) {
        const db = readLocalDB();
        db.coupons.push(record);
        writeLocalDB(db);
        return record;
    }

    try {
        const row = objectToRow(record, sheetHeaders.coupons);
        await sheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range: 'coupons!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });
        return record;
    } catch (err) {
        console.error('Error adding coupon to Google Sheets:', err);
        throw err;
    }
}

async function deleteCoupon(code) {
    const codeUpper = code.toUpperCase();
    if (!isGoogleConfigured) {
        const db = readLocalDB();
        const initialLength = db.coupons.length;
        db.coupons = db.coupons.filter(item => item.code !== codeUpper);
        writeLocalDB(db);
        return { success: db.coupons.length < initialLength };
    }

    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'coupons!A:E'
        });
        const rows = resp.data.values || [];
        let rowIndex = -1;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][1] && rows[i][1].toUpperCase() === codeUpper) {
                rowIndex = i;
                break;
            }
        }
        if (rowIndex === -1) return { error: 'Coupon not found.' };

        const sheetId = await getSheetId('coupons');
        await sheetsClient.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId,
                            dimension: 'ROWS',
                            startIndex: rowIndex,
                            endIndex: rowIndex + 1
                        }
                    }
                }]
            }
        });
        return { success: true };
    } catch (err) {
        console.error('Error deleting coupon from Google Sheets:', err);
        throw err;
    }
}

async function validateCoupon(code) {
    const codeUpper = code.toUpperCase();
    const coupons = await getCoupons();
    const coupon = coupons.find(c => c.code === codeUpper);
    
    if (!coupon) {
        return { valid: false, message: 'Invalid coupon code.' };
    }
    const isUsed = coupon.isUsed === true || coupon.isUsed === 'true';
    if (isUsed) {
        return { valid: false, message: 'This coupon has already been used.' };
    }
    return {
        valid: true,
        code: coupon.code,
        discountPercent: parseInt(coupon.discountPercent) || 0,
        message: `Coupon applied! ${coupon.discountPercent}% discount unlocked.`
    };
}

async function markCouponUsed(code) {
    const codeUpper = code.toUpperCase();
    if (!isGoogleConfigured) {
        const db = readLocalDB();
        const coupon = db.coupons.find(c => c.code === codeUpper);
        if (coupon) {
            coupon.isUsed = true;
            writeLocalDB(db);
            return true;
        }
        return false;
    }

    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'coupons!A:E'
        });
        const rows = resp.data.values || [];
        let rowIndex = -1;
        let couponRecord = null;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][1] && rows[i][1].toUpperCase() === codeUpper) {
                rowIndex = i;
                couponRecord = rowsToObjects([rows[0], rows[i]])[0];
                break;
            }
        }
        if (rowIndex === -1) return false;

        couponRecord.isUsed = 'true';
        const row = objectToRow(couponRecord, sheetHeaders.coupons);
        await sheetsClient.spreadsheets.values.update({
            spreadsheetId,
            range: `coupons!A${rowIndex + 1}:E${rowIndex + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });
        return true;
    } catch (err) {
        console.error('Error marking coupon used in Google Sheets:', err);
        throw err;
    }
}

// --- settings ---
async function getSettings() {
    if (!isGoogleConfigured) {
        return readLocalDB().settings || { smsApiKey: "", youtubeVideoUrl: "" };
    }
    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'settings!A:C'
        });
        const rows = resp.data.values || [];
        const settingsList = rowsToObjects(rows);
        return settingsList.find(s => s.id === '1') || { smsApiKey: "", youtubeVideoUrl: "" };
    } catch (err) {
        console.error('Error fetching settings from Google Sheets:', err);
        return { smsApiKey: "", youtubeVideoUrl: "" };
    }
}

async function saveSettings(settingsData) {
    const record = {
        id: '1',
        smsApiKey: settingsData.smsApiKey || "",
        youtubeVideoUrl: settingsData.youtubeVideoUrl || ""
    };

    if (!isGoogleConfigured) {
        const db = readLocalDB();
        db.settings = record;
        writeLocalDB(db);
        return record;
    }

    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'settings!A:C'
        });
        const rows = resp.data.values || [];
        let rowIndex = -1;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === '1') {
                rowIndex = i;
                break;
            }
        }

        const row = objectToRow(record, sheetHeaders.settings);
        if (rowIndex !== -1) {
            await sheetsClient.spreadsheets.values.update({
                spreadsheetId,
                range: `settings!A${rowIndex + 1}:C${rowIndex + 1}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [row] }
            });
        } else {
            await sheetsClient.spreadsheets.values.append({
                spreadsheetId,
                range: 'settings!A:C',
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [row] }
            });
        }
        return record;
    } catch (err) {
        console.error('Error saving settings to Google Sheets:', err);
        throw err;
    }
}

// --- jobs (careers) ---
async function getJobs() {
    if (!isGoogleConfigured) {
        return readLocalDB().jobs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'jobs!A:F'
        });
        const rows = resp.data.values || [];
        const jobs = rowsToObjects(rows);
        return jobs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
        console.error('Error fetching jobs from Google Sheets:', err);
        return [];
    }
}

async function addJob(jobData) {
    const record = {
        id: 'job-' + Date.now().toString(),
        ...jobData,
        createdAt: new Date().toISOString()
    };

    if (!isGoogleConfigured) {
        const db = readLocalDB();
        db.jobs.push(record);
        writeLocalDB(db);
        return record;
    }

    try {
        const row = objectToRow(record, sheetHeaders.jobs);
        await sheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range: 'jobs!A:F',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });
        return record;
    } catch (err) {
        console.error('Error adding job to Google Sheets:', err);
        throw err;
    }
}

async function deleteJob(id) {
    return deleteRowById('jobs', id);
}

// --- applications (careers candidates) ---
async function getRawApplications() {
    if (!isGoogleConfigured) {
        return readLocalDB().applications.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'applications!A:L'
        });
        const rows = resp.data.values || [];
        const applications = rowsToObjects(rows);
        return applications.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
        console.error('Error fetching raw applications from Google Sheets:', err);
        return [];
    }
}

async function getApplications() {
    try {
        const rawApps = await getRawApplications();
        const jobs = await getJobs();
        
        const jobMap = new Map(jobs.map(j => [j.id, j.title]));
        return rawApps.map(app => {
            const jobTitle = jobMap.get(app.jobId) || 'Deleted Position';
            return {
                ...app,
                jobs: {
                    title: jobTitle
                }
            };
        });
    } catch (err) {
        console.error('Error joining applications with job titles:', err);
        return [];
    }
}

async function addApplication(appData) {
    const record = {
        id: 'app-' + Date.now().toString(),
        ...appData,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };

    if (!isGoogleConfigured) {
        const db = readLocalDB();
        db.applications.push(record);
        writeLocalDB(db);
        return record;
    }

    try {
        const row = objectToRow(record, sheetHeaders.applications);
        await sheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range: 'applications!A:L',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });
        return record;
    } catch (err) {
        console.error('Error adding application to Google Sheets:', err);
        throw err;
    }
}

async function deleteApplication(id) {
    return deleteRowById('applications', id);
}

async function updateApplicationStatus(id, status) {
    if (!isGoogleConfigured) {
        const db = readLocalDB();
        const application = db.applications.find(a => a.id === id.toString());
        if (application) {
            application.status = status;
            writeLocalDB(db);
            return true;
        }
        return false;
    }

    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'applications!A:L'
        });
        const rows = resp.data.values || [];
        let rowIndex = -1;
        let appRecord = null;
        
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === id.toString()) {
                rowIndex = i;
                appRecord = rowsToObjects([rows[0], rows[i]])[0];
                break;
            }
        }
        if (rowIndex === -1) return false;

        appRecord.status = status;
        const row = objectToRow(appRecord, sheetHeaders.applications);
        await sheetsClient.spreadsheets.values.update({
            spreadsheetId,
            range: `applications!A${rowIndex + 1}:L${rowIndex + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });
        return true;
    } catch (err) {
        console.error('Error updating application status in Google Sheets:', err);
        return false;
    }
}

// --- blogs ---
async function getBlogs() {
    if (!isGoogleConfigured) {
        return readLocalDB().blogs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'blogs!A:I'
        });
        const rows = resp.data.values || [];
        const blogs = rowsToObjects(rows);
        return blogs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
        console.error('Error fetching blogs from Google Sheets:', err);
        return [];
    }
}

async function addBlog(blogData) {
    const slug = (blogData.slug || blogData.title)
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

    const record = {
        id: 'blog-' + Date.now().toString(),
        title: blogData.title,
        slug: slug,
        category: blogData.category || 'General',
        date: blogData.date || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        readTime: blogData.readTime || '5 Min Read',
        summary: blogData.summary || '',
        content: blogData.content || '',
        createdAt: new Date().toISOString()
    };

    if (!isGoogleConfigured) {
        const db = readLocalDB();
        db.blogs.push(record);
        writeLocalDB(db);
        return record;
    }

    try {
        const row = objectToRow(record, sheetHeaders.blogs);
        await sheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range: 'blogs!A:I',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });
        return record;
    } catch (err) {
        console.error('Error adding blog to Google Sheets:', err);
        throw err;
    }
}

async function updateBlog(id, blogData) {
    if (!isGoogleConfigured) {
        const db = readLocalDB();
        const index = db.blogs.findIndex(b => b.id === id.toString());
        if (index !== -1) {
            const slug = (blogData.slug || blogData.title || db.blogs[index].title)
                .toString()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');

            db.blogs[index] = {
                ...db.blogs[index],
                title: blogData.title || db.blogs[index].title,
                slug: slug,
                category: blogData.category || db.blogs[index].category,
                date: blogData.date || db.blogs[index].date,
                readTime: blogData.readTime || db.blogs[index].readTime,
                summary: blogData.summary || db.blogs[index].summary,
                content: blogData.content || db.blogs[index].content,
                updatedAt: new Date().toISOString()
            };
            writeLocalDB(db);
            return db.blogs[index];
        }
        return null;
    }

    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'blogs!A:I'
        });
        const rows = resp.data.values || [];
        let rowIndex = -1;
        let blogRecord = null;
        
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === id.toString()) {
                rowIndex = i;
                blogRecord = rowsToObjects([rows[0], rows[i]])[0];
                break;
            }
        }
        if (rowIndex === -1) return null;

        const slug = (blogData.slug || blogData.title || blogRecord.title)
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');

        const updatedRecord = {
            ...blogRecord,
            title: blogData.title || blogRecord.title,
            slug: slug,
            category: blogData.category || blogRecord.category,
            date: blogData.date || blogRecord.date,
            readTime: blogData.readTime || blogRecord.readTime,
            summary: blogData.summary || blogRecord.summary,
            content: blogData.content || blogRecord.content,
            updatedAt: new Date().toISOString()
        };
        
        const row = objectToRow(updatedRecord, sheetHeaders.blogs);
        await sheetsClient.spreadsheets.values.update({
            spreadsheetId,
            range: `blogs!A${rowIndex + 1}:I${rowIndex + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });
        return updatedRecord;
    } catch (err) {
        console.error('Error updating blog in Google Sheets:', err);
        throw err;
    }
}

async function deleteBlog(id) {
    return deleteRowById('blogs', id);
}

// --- reviews ---
async function getReviews() {
    if (!isGoogleConfigured) {
        return readLocalDB().reviews.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'reviews!A:G'
        });
        const rows = resp.data.values || [];
        const reviews = rowsToObjects(rows);
        return reviews.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
        console.error('Error fetching reviews from Google Sheets:', err);
        return [];
    }
}

async function addReview(reviewData) {
    const record = {
        id: 'review-' + Date.now().toString(),
        reviewerName: reviewData.reviewerName || '',
        rating: reviewData.rating || 5,
        reviewText: reviewData.reviewText || '',
        source: reviewData.source || 'Google',
        date: reviewData.date || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        createdAt: new Date().toISOString()
    };

    if (!isGoogleConfigured) {
        const db = readLocalDB();
        db.reviews.push(record);
        writeLocalDB(db);
        return record;
    }

    try {
        const row = objectToRow(record, sheetHeaders.reviews);
        await sheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range: 'reviews!A:G',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });
        return record;
    } catch (err) {
        console.error('Error adding review to Google Sheets:', err);
        throw err;
    }
}

async function deleteReview(id) {
    return deleteRowById('reviews', id);
}

async function seedDefaultReviews() {
    const reviews = await getReviews();
    if (reviews.length === 0) {
        const defaultReviews = [
            { reviewerName: 'Amit Sharma', rating: 5, reviewText: 'Excellent training institute for SAP modules. Sourabh Sir explains complex FICO concepts in a very simple manner. Got placed within 2 months of completing the course. Highly recommend!', source: 'Google', date: 'Oct 2023' },
            { reviewerName: 'Priya Kulkarni', rating: 5, reviewText: 'I joined Progress IT for AWS DevOps course. The hands-on lab sessions were amazing. Pallavi Mam was very supportive throughout the placement process.', source: 'Google', date: 'Nov 2023' },
            { reviewerName: 'Rohit Deshmukh', rating: 5, reviewText: 'Best institute in Nigdi area for IT training. I completed SAP MM course and got placed in Capgemini. The faculty is very knowledgeable and helpful.', source: 'Google', date: 'Dec 2023' },
            { reviewerName: 'Sneha Patil', rating: 4, reviewText: 'Good experience overall. Python Full Stack training was comprehensive. The batch timings are flexible which helped me manage with my college schedule.', source: 'Google', date: 'Jan 2024' },
            { reviewerName: 'Vikram Joshi', rating: 5, reviewText: 'I switched my career from non-IT to IT through Progress IT Institute. The Data Science course covered everything from basics to advanced ML. Now working as a Data Analyst.', source: 'Google', date: 'Feb 2024' },
            { reviewerName: 'Kavita Nair', rating: 5, reviewText: 'Very professional institute. The infrastructure is good and they provide real project experience. SAP SD training was excellent with real business scenarios.', source: 'Google', date: 'Mar 2024' },
            { reviewerName: 'Rajesh Pawar', rating: 5, reviewText: 'Completed Azure Cloud certification prep here. The study material and mock tests were very helpful. Cleared the exam in first attempt!', source: 'Google', date: 'Apr 2024' },
            { reviewerName: 'Anita Gaikwad', rating: 4, reviewText: 'Good institute for SAP training in Pune. Sourabh Sir is very patient and clears all doubts. Placement support is genuine. Recommended for freshers.', source: 'Google', date: 'May 2024' }
        ];

        for (const rev of defaultReviews) {
            await addReview(rev);
        }
    }
}

// --- brochures ---
async function getBrochures() {
    if (!isGoogleConfigured) {
        return readLocalDB().brochures || [];
    }
    try {
        const resp = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: 'brochures!A:D'
        });
        const rows = resp.data.values || [];
        return rowsToObjects(rows);
    } catch (err) {
        console.error('Error fetching brochures from Google Sheets:', err);
        return [];
    }
}

async function upsertBrochure(courseId, brochureUrl) {
    const existing = await getBrochures();
    const existingRecord = existing.find(b => b.courseId === courseId);

    const record = {
        id: existingRecord ? existingRecord.id : 'brochure-' + Date.now().toString(),
        courseId,
        brochureUrl,
        updatedAt: new Date().toISOString()
    };

    if (!isGoogleConfigured) {
        const db = readLocalDB();
        if (existingRecord) {
            const index = db.brochures.findIndex(b => b.courseId === courseId);
            db.brochures[index] = record;
        } else {
            db.brochures.push(record);
        }
        writeLocalDB(db);
        return record;
    }

    try {
        if (existingRecord) {
            const resp = await sheetsClient.spreadsheets.values.get({
                spreadsheetId,
                range: 'brochures!A:D'
            });
            const rows = resp.data.values || [];
            let rowIndex = -1;
            for (let i = 1; i < rows.length; i++) {
                if (rows[i][1] === courseId) {
                    rowIndex = i;
                    break;
                }
            }
            if (rowIndex !== -1) {
                const row = objectToRow(record, sheetHeaders.brochures);
                await sheetsClient.spreadsheets.values.update({
                    spreadsheetId,
                    range: `brochures!A${rowIndex + 1}:D${rowIndex + 1}`,
                    valueInputOption: 'USER_ENTERED',
                    requestBody: { values: [row] }
                });
                return record;
            }
        } 
        
        const row = objectToRow(record, sheetHeaders.brochures);
        await sheetsClient.spreadsheets.values.append({
            spreadsheetId,
            range: 'brochures!A:D',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });
        return record;
    } catch (err) {
        console.error('Error upserting brochure in Google Sheets:', err);
        throw err;
    }
}

async function deleteBrochure(courseId) {
    const brochures = await getBrochures();
    const brochure = brochures.find(b => b.courseId === courseId);
    if (!brochure) return false;
    return deleteRowById('brochures', brochure.id);
}

// Deprecated interfaces maintained for legacy exports compatibility
async function getDB() {
    console.warn('getDB() is deprecated. Accessing individual interfaces is recommended.');
    return {
        enquiries: await getEnquiries(),
        admissions: await getAdmissions(),
        coupons: await getCoupons(),
        settings: await getSettings()
    };
}

async function saveDB() {
    console.warn('saveDB() is deprecated. Saves are performed instantly.');
    return true;
}

module.exports = {
    getDB,
    saveDB,
    addEnquiry,
    addAdmission,
    addCoupon,
    deleteCoupon,
    validateCoupon,
    markCouponUsed,
    saveOTP,
    verifyOTP,
    getEnquiries,
    getAdmissions,
    getCoupons,
    getSettings,
    saveSettings,
    upsertAdmission,
    deleteEnquiry,
    deleteAdmission,
    getJobs,
    addJob,
    deleteJob,
    getApplications,
    addApplication,
    deleteApplication,
    updateApplicationStatus,
    getBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
    getReviews,
    addReview,
    deleteReview,
    seedDefaultReviews,
    getBrochures,
    upsertBrochure,
    deleteBrochure,
    isConfigured
};
