require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const session = require('express-session');
const db = require('./data/database');
const coursesData = require('./data/coursesData');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin credentials from environment variables (never hardcoded in production)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '1234';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1234';

// Brute-force rate limiter for login
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip) {
    const now = Date.now();
    const record = loginAttempts.get(ip);
    if (!record) return true;
    // Clean expired entries
    if (now - record.firstAttempt > LOGIN_WINDOW_MS) {
        loginAttempts.delete(ip);
        return true;
    }
    return record.count < MAX_LOGIN_ATTEMPTS;
}

function recordLoginAttempt(ip) {
    const now = Date.now();
    const record = loginAttempts.get(ip);
    if (!record || (now - record.firstAttempt > LOGIN_WINDOW_MS)) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
    } else {
        record.count++;
    }
}

function clearLoginAttempts(ip) {
    loginAttempts.delete(ip);
}

// YouTube URL helper - extract video ID from various YouTube URL formats
function extractYouTubeVideoId(url) {
    if (!url || typeof url !== 'string') return null;
    url = url.trim();
    // Direct video ID (11 chars)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    try {
        const parsed = new URL(url);
        // youtube.com/watch?v=ID
        if (parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v')) {
            return parsed.searchParams.get('v');
        }
        // youtu.be/ID
        if (parsed.hostname === 'youtu.be') {
            return parsed.pathname.slice(1).split('/')[0];
        }
        // youtube.com/embed/ID
        if (parsed.pathname.startsWith('/embed/')) {
            return parsed.pathname.split('/embed/')[1].split('?')[0];
        }
        // youtube.com/shorts/ID
        if (parsed.pathname.startsWith('/shorts/')) {
            return parsed.pathname.split('/shorts/')[1].split('?')[0];
        }
    } catch (e) { /* invalid URL */ }
    return null;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Security headers for all responses
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Session middleware for admin authentication
app.use(session({
    secret: process.env.SESSION_SECRET || 'progress-it-institute-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Admin authentication middleware
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        // Prevent caching of admin pages
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        return next();
    }
    // For AJAX/API requests, return JSON 401
    if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
    }
    res.redirect('/admin/login');
};

// ============================================
//  EXISTING PAGE ROUTES
// ============================================
// Default fallback YouTube video ID
const DEFAULT_VIDEO_ID = 'wKddWBnAjjE';

// Seed reviews if needed
async function seedReviewsIfNeeded() {
    try {
        if (typeof db.getReviews === 'function') {
            const reviews = await db.getReviews();
            if (reviews.length === 0 && typeof db.seedDefaultReviews === 'function') {
                console.log('Seeding default reviews...');
                await db.seedDefaultReviews();
            }
        }
    } catch (err) {
        console.error('Error seeding reviews:', err);
    }
}

app.get('/', async (req, res) => {
    let latestVideoId = DEFAULT_VIDEO_ID;
    let reviews = [];
    
    try {
        // Get admin-selected YouTube video from settings
        const settings = await db.getSettings();
        if (settings && settings.youtubeVideoUrl) {
            const extracted = extractYouTubeVideoId(settings.youtubeVideoUrl);
            if (extracted) latestVideoId = extracted;
        }
    } catch (err) {
        console.error('Error fetching YouTube settings:', err.message);
    }
    
    try {
        // Get reviews for home page
        await seedReviewsIfNeeded();
        if (typeof db.getReviews === 'function') {
            reviews = await db.getReviews();
        }
    } catch (err) {
        console.error('Error fetching reviews:', err.message);
    }
    
    res.render('index', { 
        title: 'Home | Progress IT Institute', 
        path: '/',
        latestVideoId,
        reviews
    });
});

app.get('/courses', (req, res) => {
    res.render('courses', { title: 'Our Courses | Progress IT Institute', path: '/courses' });
});

app.get('/courses/:id', async (req, res) => {
    const courseId = req.params.id;
    const course = coursesData[courseId];
    if (!course) {
        return res.redirect('/courses');
    }
    
    let brochureUrl = null;
    try {
        if (typeof db.getBrochures === 'function') {
            const brochures = await db.getBrochures();
            const brochure = brochures.find(b => b.courseId === courseId);
            if (brochure) brochureUrl = brochure.brochureUrl;
        }
    } catch (err) {
        console.error('Error fetching brochure:', err.message);
    }
    
    res.render('course-detail', { 
        title: `${course.title} | Progress IT Institute`, 
        path: '/courses', 
        course,
        brochureUrl
    });
});

app.get('/gallery', (req, res) => {
    res.render('gallery', { title: 'Gallery & Placements | Progress IT Institute', path: '/gallery' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us | Progress IT Institute', path: '/contact' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us | Progress IT Institute', path: '/about' });
});

app.get('/admission', async (req, res) => {
    try {
        const coupons = await db.getCoupons();
        const activeCoupons = coupons ? coupons.filter(c => !c.isUsed) : [];
        res.render('admission', { 
            title: 'Admission Portal | Progress IT Institute', 
            path: '/admission',
            coupons: activeCoupons
        });
    } catch (err) {
        console.error('Error fetching coupons for admission page:', err);
        res.render('admission', { 
            title: 'Admission Portal | Progress IT Institute', 
            path: '/admission',
            coupons: []
        });
    }
});

// Default Seed Blogs
const defaultBlogs = [
    {
        title: 'How to Kickstart Your Career in SAP FICO in 2026',
        category: 'SAP ERP Modules',
        date: 'May 18, 2026',
        readTime: '6 Min Read',
        summary: 'SAP is the backbone of financial operations for global enterprise companies. Discover why SAP FICO continues to be one of the highest-paying modules and how to prepare for interviews...',
        content: `
            <p>SAP FICO is the core finance and controlling module in SAP ERP. Companies globally rely heavily on SAP to record financial data, manage accounting reports, and control budgets. Due to its strategic business role, demand for expert SAP FICO consultants remains at an all-time high.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--primary);">Why Choose SAP FICO?</h4>
            <p>1. <strong>Exceptional Career Mobility:</strong> Because almost all large companies employ SAP ERP, FICO certified professionals can work across sectors including banking, pharmaceuticals, manufacturing, and technology.<br>
            2. <strong>Lucrative Compensation:</strong> Experienced consultants routinely secure packages ranging from 8 LPA to 25+ LPA in India, with high global placement prospects.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--primary);">Standard FICO Interview Topics to Master</h4>
            <ul>
                <li><strong>General Ledger (GL):</strong> Understand chart of accounts, fiscal year variants, posting keys, and document types.</li>
                <li><strong>Accounts Payable & Receivable (AP & AR):</strong> Master house banks, payment programs, vendor groups, and customer master records.</li>
                <li><strong>Asset Accounting (AA):</strong> Know depreciation keys, asset classes, and values acquisition configurations.</li>
                <li><strong>Controlling (CO):</strong> Clear concepts of cost center accounting, internal orders, and profit center setups.</li>
            </ul>
            <p style="margin-top:1.5rem;">Join Progress IT Institute's certified SAP classroom programs in Nigdi, Pune, under the mentorship of <strong>Sourabh Sir</strong>, to practice live integration scenarios and build real-world experience.</p>
        `
    },
    {
        title: 'Why DevOps and AWS are the Highest Paying IT Jobs Today',
        category: 'Cloud & DevOps',
        date: 'May 14, 2026',
        readTime: '8 Min Read',
        summary: 'Cloud orchestration has changed software deployment forever. Learn how mastering Docker, Kubernetes, Jenkins, Terraform, and AWS Services can double your packages as a fresher...',
        content: `
            <p>DevOps is not just a job role—it is a collaborative culture combined with tools that automate software integration and delivery. Combined with AWS (Amazon Web Services), DevOps forms the foundation of modern digital SaaS giants.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--primary);">The DevOps Tools Pipeline</h4>
            <p>To succeed as a modern Cloud Engineer, you must master the fundamental layers of automated pipelines:</p>
            <ul>
                <li><strong>Version Control:</strong> Git & GitHub (Branching models, pull requests).</li>
                <li><strong>CI/CD Pipelines:</strong> Jenkins or GitHub Actions for building and testing code automatically.</li>
                <li><strong>Containerization:</strong> Docker (Writing Dockerfiles, managing container registries).</li>
                <li><strong>Orchestration:</strong> Kubernetes (Pods, deployments, services, replicas).</li>
                <li><strong>Infrastructure as Code (IaC):</strong> Terraform to provision servers programmatically.</li>
                <li><strong>Config Management:</strong> Ansible configuration runs.</li>
            </ul>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--primary);">Career Outlook</h4>
            <p>AWS DevOps is incredibly resilient to tech recessions. Companies prioritising cost optimization migrate to cloud serverless frameworks, generating huge vacancies. Average salaries for freshers start from 5-7 LPA, rising exponentially with certification credentials.</p>
            <p style="margin-top:1.5rem;">Our classroom labs in Pune offer 100% practical cloud sandbox environments. Prepare for global certificates under <strong>Rahul Sir</strong>'s senior guidance.</p>
        `
    },
    {
        title: 'Data Science vs. Cyber Security: Which Path to Choose?',
        category: 'Hot Domain',
        date: 'May 08, 2026',
        readTime: '7 Min Read',
        summary: 'Confused between analyzing predictive data and securing networks? We weigh both domains on job opportunities, skill learning curve, and long-term future viability...',
        content: `
            <p>Selecting between Data Science and Cyber Security can be challenging, as both are extremely popular, well-paying tech specializations. Here is an authentic structural breakdown to help you match your aptitude:</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--primary);">1. Data Science & Machine Learning</h4>
            <p><strong>Aptitude Match:</strong> If you enjoy statistics, analyzing mathematical figures, solving data puzzles, and predicting future trends, this is your path.</p>
            <p><strong>Core Stack:</strong> Python, SQL, Pandas, NumPy, Scikit-Learn, PowerBI, Tableau, and Machine Learning models.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--primary);">2. Cyber Security & Ethical Hacking</h4>
            <p><strong>Aptitude Match:</strong> If you are interested in network architectures, operating systems, finding security flaws, and defending servers against cyber attacks, choose security.</p>
            <p><strong>Core Stack:</strong> Linux commands, Penetration testing tools (Kali Linux, Wireshark, Metasploit), Cryptography, SIEM, and firewalls.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--primary);">Summary Recommendation</h4>
            <p>Data Science usually requires a strong mathematical bent. Cyber Security is highly analytical and hands-on with operating systems. Both offer standard packages of 6 LPA+ for freshers with immense remote work potential globally.</p>
        `
    },
    {
        title: 'Python: The Ultimate Programming Foundation for 2026',
        category: 'Programming',
        date: 'Apr 29, 2026',
        readTime: '5 Min Read',
        summary: 'Whether building backend web architectures or programming machine learning systems, Python is the top language of choice. Let\'s look at standard interview questions...',
        content: `
            <p>Python is consistently ranked as the most popular programming language globally. Thanks to its clean syntax and massive package library, Python is the foundation for Web Development, Automation, and Artificial Intelligence.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--primary);">Mastering Full-Stack Web Development</h4>
            <p>Learning Python isn't just about scripting loops. To build scalable enterprise apps, master Python Web Frameworks:</p>
            <ul>
                <li><strong>Django:</strong> The high-level "batteries-included" web framework. Perfect for rapid, secure database-driven apps.</li>
                <li><strong>REST APIs:</strong> Building backends using Django REST Framework (DRF) to feed frontend React systems.</li>
                <li><strong>Frontend Stack:</strong> HTML, CSS, JavaScript, and React.js to make responsive user interfaces.</li>
            </ul>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--primary);">Standard Prep Interview Tips</h4>
            <p>1. Master core data structures (Lists, Dicts, Sets, Tuples).<br>
            2. Be fluent in Object-Oriented Programming (OOP) concepts: Inheritance, Encapsulation, Polymorphism.<br>
            3. Understand database connections (ORMs, SQLite, PostgreSQL).</p>
            <p style="margin-top:1.5rem;">Start scripting your first projects in our specialized software laboratory blocks today!</p>
        `
    }
];

async function seedBlogsIfNeeded() {
    try {
        const blogs = await db.getBlogs();
        if (blogs.length === 0) {
            console.log('Seeding default blogs database...');
            for (const b of defaultBlogs) {
                await db.addBlog(b);
            }
        }
    } catch (err) {
        console.error('Error seeding blogs:', err);
    }
}

app.get('/blog', async (req, res) => {
    try {
        await seedBlogsIfNeeded();
        const blogs = await db.getBlogs();
        res.render('blog', { title: 'Blog & Articles | Progress IT Institute', path: '/blog', blogs });
    } catch (err) {
        console.error('Error rendering blogs page:', err);
        res.render('blog', { title: 'Blog & Articles | Progress IT Institute', path: '/blog', blogs: [] });
    }
});

app.get('/blog/:slug', async (req, res) => {
    try {
        const blogs = await db.getBlogs();
        const blog = blogs.find(b => b.slug === req.params.slug);
        if (!blog) {
            return res.redirect('/blog');
        }
        res.render('blog-detail', { 
            title: `${blog.title} | Progress IT Institute`, 
            path: '/blog', 
            blog 
        });
    } catch (err) {
        console.error('Error rendering blog detail page:', err);
        res.redirect('/blog');
    }
});

app.get('/privacy', (req, res) => {
    res.render('privacy', { title: 'Privacy Policy | Progress IT Institute', path: '/privacy' });
});

app.get('/terms', (req, res) => {
    res.render('terms', { title: 'Terms & Conditions | Progress IT Institute', path: '/terms' });
});

// ============================================
//  API ROUTES - Enquiry Submission (JSON DB)
// ============================================
app.post('/api/enquiry', async (req, res) => {
    const { name, email, phone, course, message } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Name and Phone are required.' });
    }

    try {
        await db.addEnquiry({
            name,
            email: email || 'N/A',
            phone,
            course: course || 'N/A',
            message: message || 'N/A'
        });
        res.json({ success: true, message: 'Enquiry submitted successfully!' });
    } catch (err) {
        console.error('Error saving enquiry:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// ============================================
//  API ROUTES - Admission Submission (JSON DB)
// ============================================
app.post('/api/admission', async (req, res) => {
    const { name, email, phone, course, finalFee, couponCode } = req.body;

    if (!name || !phone || !course) {
        return res.status(400).json({ success: false, message: 'Name, Phone, and Course are required.' });
    }

    try {
        // Mark coupon as used if one was applied
        if (couponCode && couponCode !== 'None') {
            await db.markCouponUsed(couponCode);
        }

        const admissionNumber = 'REG-' + Math.floor(100000 + Math.random() * 900000);
        const feesPaid = 'false';

        const record = await db.upsertAdmission({
            name,
            email: email || 'N/A',
            phone,
            course,
            finalFee: finalFee || 'N/A',
            couponCode: couponCode || 'None',
            admissionNumber,
            feesPaid
        });

        res.json({ 
            success: true, 
            id: record.id,
            admissionNumber: record.admissionNumber || admissionNumber,
            feesPaid: record.feesPaid || feesPaid,
            message: 'Admission submitted successfully!' 
        });
    } catch (err) {
        console.error('Error saving admission:', err);
        res.status(500).json({ success: false, message: 'Server Error saving admission.' });
    }
});

// ============================================
//  API ROUTES - OTP System
// ============================================
app.post('/api/send-otp', async (req, res) => {
    const { phone } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Valid 10-digit phone number is required.' });
    }

    // Generate 4-digit OTP
    const otp = phone === '9340050379' ? '1111' : Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP to database
    db.saveOTP(phone, otp);

    // Bypassing SMS sending for the static test number
    if (phone === '9340050379') {
        console.log(`[SMS OTP] Test phone number 9340050379: Using static OTP 1111`);
        return res.json({
            success: true,
            realSMS: false,
            otp: '1111',
            message: 'OTP sent successfully (Test Number Mode)!'
        });
    }

    const settings = await db.getSettings();
    const smsApiKey = settings ? settings.smsApiKey : "";

    if (smsApiKey && smsApiKey.trim() !== '') {
        try {
            console.log(`[SMS OTP] Sending real OTP ${otp} to ${phone} via Fast2SMS (route=otp)...`);
            const urlOtp = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(smsApiKey)}&route=otp&variables_values=${encodeURIComponent(otp)}&numbers=${encodeURIComponent(phone)}`;
            
            let response = await fetch(urlOtp, {
                method: 'GET',
                headers: {
                    'authorization': smsApiKey,
                    'Content-Type': 'application/json'
                }
            });
            let data = await response.json();
            
            if (data && data.return === true) {
                console.log(`[SMS OTP] Success: OTP sent via route=otp. Request ID: ${data.request_id || 'N/A'}`);
                return res.json({
                    success: true,
                    realSMS: true,
                    message: 'OTP sent successfully to your mobile number via SMS!'
                });
            } else {
                console.warn(`[SMS OTP] route=otp failed, error:`, data);
                console.log(`[SMS OTP] Retrying using Quick SMS route (route=q)...`);
                
                const customMessage = `Your OTP for Progress IT Institute is ${otp}`;
                const urlQ = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(smsApiKey)}&route=q&message=${encodeURIComponent(customMessage)}&language=english&numbers=${encodeURIComponent(phone)}`;
                
                response = await fetch(urlQ, {
                    method: 'GET',
                    headers: {
                        'authorization': smsApiKey,
                        'Content-Type': 'application/json'
                    }
                });
                data = await response.json();
                
                if (data && data.return === true) {
                    console.log(`[SMS OTP] Success: OTP sent via route=q (Quick SMS). Request ID: ${data.request_id || 'N/A'}`);
                    return res.json({
                        success: true,
                        realSMS: true,
                        message: 'OTP sent successfully to your mobile number via SMS (Quick Route)!'
                    });
                } else {
                    console.error(`[SMS OTP] Both route=otp and route=q failed. route=q error:`, data);
                    // Fallback to mock mode if Fast2SMS fails (API key invalid, low balance, etc.)
                    console.log(`
┌──────────────────────────────────────────────┐
│  [MOCK SMS FALLBACK] VERIFICATION CODE       │
├──────────────────────────────────────────────┤
│  Recipient: +91 ${phone}                     │
│  OTP Code : ${otp}                             │
│  Reason   : Fast2SMS API failure             │
└──────────────────────────────────────────────┘
                    `);
                    return res.json({
                        success: true,
                        realSMS: false,
                        otp: otp,
                        message: `Fast2SMS SMS sending failed (${data.message || 'Unknown error'}). Fallback to mock OTP.`
                    });
                }
            }
        } catch (error) {
            console.error(`[SMS OTP] Exception calling Fast2SMS:`, error);
            // Fallback to mock mode on fetch exception
            console.log(`
┌──────────────────────────────────────────────┐
│  [MOCK SMS FALLBACK] VERIFICATION CODE       │
├──────────────────────────────────────────────┤
│  Recipient: +91 ${phone}                     │
│  OTP Code : ${otp}                             │
│  Reason   : Fast2SMS gateway exception       │
└──────────────────────────────────────────────┘
            `);
            return res.json({
                success: true,
                realSMS: false,
                otp: otp,
                message: 'Error calling Fast2SMS gateway. Fallback to mock OTP.'
            });
        }
    } else {
        // Mock mode: no API key set
        console.log(`
┌──────────────────────────────────────────────┐
│  [MOCK SMS GATEWAY] VERIFICATION CODE        │
├──────────────────────────────────────────────┤
│  Recipient: +91 ${phone}                     │
│  OTP Code : ${otp}                             │
│  Expiry   : 5 Minutes                        │
└──────────────────────────────────────────────┘
        `);
        return res.json({
            success: true,
            realSMS: false,
            otp: otp,
            message: 'OTP sent successfully (Mock Mode)!'
        });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
    }

    const result = db.verifyOTP(phone, otp);

    if (result.valid) {
        // Upsert standard pending registration entry with just the phone number if not already fully registered
        const admissions = await db.getAdmissions();
        const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
        const existing = admissions.find(a => {
            if (!a.phone) return false;
            return a.phone.replace(/[^0-9]/g, '').slice(-10) === cleanPhone;
        });

        if (!existing || existing.course === 'Pending' || existing.name === 'OTP Verified (No Registration)') {
            await db.upsertAdmission({
                name: 'OTP Verified (No Registration)',
                email: 'N/A',
                phone: `+91 ${phone}`,
                course: 'Pending',
                finalFee: 'N/A',
                couponCode: 'None'
            });
        }

        res.json({ success: true, message: result.message });
    } else {
        res.status(400).json({ success: false, message: result.message });
    }
});

// ============================================
//  API ROUTES - Coupon Validation
// ============================================
app.post('/api/validate-coupon', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const result = await db.validateCoupon(code);

    if (result.valid) {
        res.json({
            success: true,
            code: result.code,
            discountPercent: result.discountPercent,
            message: result.message
        });
    } else {
        res.status(400).json({ success: false, message: result.message });
    }
});

app.post('/api/student-login', async (req, res) => {
    const { admissionNumber } = req.body;

    if (!admissionNumber) {
        return res.status(400).json({ success: false, message: 'Admission Number is required.' });
    }

    try {
        const admissions = await db.getAdmissions();
        const cleanReg = admissionNumber.toUpperCase().trim();

        const student = admissions.find(a => {
            const studentReg = a.admissionNumber ? a.admissionNumber.toUpperCase().trim() : '';
            return studentReg === cleanReg;
        });

        if (student) {
            res.json({
                success: true,
                student: {
                    id: student.id,
                    name: student.name,
                    course: student.course,
                    finalFee: student.finalFee,
                    admissionNumber: student.admissionNumber,
                    feesPaid: student.feesPaid || 'false',
                    createdAt: student.createdAt
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid Admission Number. Please check and try again.' });
        }
    } catch (err) {
        console.error('Student login error:', err);
        res.status(500).json({ success: false, message: 'Server Error validating student login.' });
    }
});

// ============================================
//  ADMIN ROUTES
// ============================================

// Catch-all redirect: /dashboard -> /admin/login (prevent direct URL access)
app.get('/dashboard', (req, res) => {
    res.redirect('/admin/login');
});

// Admin Login Page
app.get('/admin/login', (req, res) => {
    // If already logged in, redirect to dashboard
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin-login', { title: 'Admin Login', path: '/admin/login', error: null });
});

// Admin Login POST (with rate limiting and session regeneration)
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
        return res.render('admin-login', {
            title: 'Admin Login',
            path: '/admin/login',
            error: 'Too many login attempts. Please try again after 15 minutes.'
        });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Regenerate session to prevent session fixation attacks
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regeneration error:', err);
                return res.render('admin-login', {
                    title: 'Admin Login',
                    path: '/admin/login',
                    error: 'Server error. Please try again.'
                });
            }
            req.session.isAdmin = true;
            req.session.adminUser = username;
            req.session.loginTime = Date.now();
            clearLoginAttempts(clientIp);
            return res.redirect('/admin/dashboard');
        });
        return;
    }

    // Record failed attempt
    recordLoginAttempt(clientIp);
    
    res.render('admin-login', {
        title: 'Admin Login',
        path: '/admin/login',
        error: 'Invalid credentials. Please try again.'
    });
});

// Admin Dashboard (Protected)
app.get('/admin/dashboard', requireAdmin, async (req, res) => {
    try {
        let enquiries = [];
        let admissions = [];
        let coupons = [];
        let settings = { smsApiKey: "", youtubeVideoUrl: "" };
        let jobs = [];
        let applications = [];
        let blogs = [];
        let reviews = [];
        let brochures = [];

        try { enquiries = await db.getEnquiries(); } catch (e) { console.error('Error loading enquiries:', e.message); }
        try { admissions = await db.getAdmissions(); } catch (e) { console.error('Error loading admissions:', e.message); }
        try { coupons = await db.getCoupons(); } catch (e) { console.error('Error loading coupons:', e.message); }
        try { settings = await db.getSettings(); } catch (e) { console.error('Error loading settings:', e.message); }
        try { jobs = await db.getJobs(); } catch (e) { console.error('Error loading jobs:', e.message); }
        try { applications = await db.getApplications(); } catch (e) { console.error('Error loading applications:', e.message); }
        try { blogs = await db.getBlogs(); } catch (e) { console.error('Error loading blogs:', e.message); }
        try { if (typeof db.getReviews === 'function') reviews = await db.getReviews(); } catch (e) { console.error('Error loading reviews:', e.message); }
        try { if (typeof db.getBrochures === 'function') brochures = await db.getBrochures(); } catch (e) { console.error('Error loading brochures:', e.message); }

        res.render('admin-dashboard', {
            title: 'Admin Dashboard',
            path: '/admin/dashboard',
            enquiries,
            admissions,
            coupons,
            settings,
            jobs,
            applications,
            blogs,
            reviews,
            brochures,
            coursesData,
            dbConfigured: db.isConfigured()
        });
    } catch (err) {
        console.error('Error loading admin dashboard:', err);
        res.status(500).send('Error loading dashboard');
    }
});

// Admin Blog CRUD (Protected)
app.post('/admin/blog/create', requireAdmin, async (req, res) => {
    const { title, category, readTime, summary, content } = req.body;
    if (!title) {
        return res.redirect('/admin/dashboard#blogs');
    }
    try {
        await db.addBlog({ title, category, readTime, summary, content });
    } catch (err) {
        console.error('Error creating blog in admin:', err);
    }
    res.redirect('/admin/dashboard#blogs');
});

app.post('/admin/blog/update', requireAdmin, async (req, res) => {
    const { id, title, category, readTime, summary, content } = req.body;
    if (!id || !title) {
        return res.redirect('/admin/dashboard#blogs');
    }
    try {
        await db.updateBlog(id, { title, category, readTime, summary, content });
    } catch (err) {
        console.error('Error updating blog in admin:', err);
    }
    res.redirect('/admin/dashboard#blogs');
});

app.post('/admin/blog/delete', requireAdmin, async (req, res) => {
    const { id } = req.body;
    if (id) {
        try {
            await db.deleteBlog(id);
        } catch (err) {
            console.error('Error deleting blog in admin:', err);
        }
    }
    res.redirect('/admin/dashboard#blogs');
});

app.post('/admin/admission/toggle-fees', requireAdmin, async (req, res) => {
    const { id, feesPaid } = req.body;
    if (!id) {
        return res.status(400).json({ success: false, message: 'Admission ID is required.' });
    }

    try {
        const admissions = await db.getAdmissions();
        const student = admissions.find(a => a.id.toString() === id.toString());
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        student.feesPaid = feesPaid === 'true' ? 'true' : 'false';
        
        await db.upsertAdmission(student);
        res.json({ success: true, feesPaid: student.feesPaid });
    } catch (err) {
        console.error('Error toggling fees:', err);
        res.status(500).json({ success: false, message: 'Error updating fee status.' });
    }
});

// Create Coupon (Protected)
app.post('/admin/coupon/create', requireAdmin, async (req, res) => {
    const { code, discountPercent } = req.body;

    if (!code || !discountPercent) {
        return res.redirect('/admin/dashboard');
    }

    const percent = parseInt(discountPercent);
    if (isNaN(percent) || percent < 1 || percent > 100) {
        return res.redirect('/admin/dashboard');
    }

    try {
        await db.addCoupon({ code, discountPercent: percent });
    } catch (err) {
        console.error('Error creating coupon:', err);
    }
    res.redirect('/admin/dashboard');
});

// Delete Coupon (Protected)
app.post('/admin/coupon/delete', requireAdmin, async (req, res) => {
    const { code } = req.body;
    if (code) {
        try {
            await db.deleteCoupon(code);
        } catch (err) {
            console.error('Error deleting coupon:', err);
        }
    }
    res.redirect('/admin/dashboard#coupons');
});

// Delete Enquiry (Protected)
app.post('/admin/enquiry/delete', requireAdmin, async (req, res) => {
    const { id } = req.body;
    if (id) {
        try {
            await db.deleteEnquiry(id);
        } catch (err) {
            console.error('Error deleting enquiry:', err);
        }
    }
    res.redirect('/admin/dashboard#enquiries');
});

// Delete Admission (Protected)
app.post('/admin/admission/delete', requireAdmin, async (req, res) => {
    const { id } = req.body;
    if (id) {
        try {
            await db.deleteAdmission(id);
        } catch (err) {
            console.error('Error deleting admission:', err);
        }
    }
    res.redirect('/admin/dashboard#admissions');
});


// Save Settings (Protected) - now includes YouTube video URL
app.post('/admin/settings/save', requireAdmin, async (req, res) => {
    const { smsApiKey, youtubeVideoUrl } = req.body;
    try {
        await db.saveSettings({ smsApiKey, youtubeVideoUrl });
    } catch (err) {
        console.error('Error saving settings:', err);
    }
    res.redirect('/admin/dashboard#settings');
});

// ============================================
//  BROCHURE ADMIN ROUTES (Protected)
// ============================================
app.post('/admin/brochure/save', requireAdmin, async (req, res) => {
    const { courseId, brochureUrl } = req.body;
    if (!courseId || !brochureUrl) {
        return res.redirect('/admin/dashboard#brochures');
    }
    try {
        if (typeof db.upsertBrochure === 'function') {
            await db.upsertBrochure(courseId, brochureUrl);
        }
    } catch (err) {
        console.error('Error saving brochure:', err);
    }
    res.redirect('/admin/dashboard#brochures');
});

app.post('/admin/brochure/delete', requireAdmin, async (req, res) => {
    const { courseId } = req.body;
    if (courseId) {
        try {
            if (typeof db.deleteBrochure === 'function') {
                await db.deleteBrochure(courseId);
            }
        } catch (err) {
            console.error('Error deleting brochure:', err);
        }
    }
    res.redirect('/admin/dashboard#brochures');
});

// ============================================
//  REVIEWS ADMIN ROUTES (Protected)
// ============================================
app.post('/admin/review/create', requireAdmin, async (req, res) => {
    const { reviewerName, rating, reviewText, source, date } = req.body;
    if (!reviewerName || !reviewText) {
        return res.redirect('/admin/dashboard#reviews');
    }
    try {
        if (typeof db.addReview === 'function') {
            await db.addReview({
                reviewerName,
                rating: parseInt(rating) || 5,
                reviewText,
                source: source || 'Google',
                date: date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            });
        }
    } catch (err) {
        console.error('Error creating review:', err);
    }
    res.redirect('/admin/dashboard#reviews');
});

app.post('/admin/review/delete', requireAdmin, async (req, res) => {
    const { id } = req.body;
    if (id) {
        try {
            if (typeof db.deleteReview === 'function') {
                await db.deleteReview(id);
            }
        } catch (err) {
            console.error('Error deleting review:', err);
        }
    }
    res.redirect('/admin/dashboard#reviews');
});

// ============================================
//  CAREERS PUBLIC ROUTES
// ============================================

// Careers Page
app.get('/careers', async (req, res) => {
    try {
        const jobs = await db.getJobs();
        res.render('careers', { title: 'Careers | Progress IT Institute', path: '/careers', jobs });
    } catch (err) {
        console.error('Error loading careers page:', err);
        res.status(500).send('Server Error loading careers');
    }
});

// Candidate Job Application API
app.post('/api/careers/apply', async (req, res) => {
    const { jobId, name, email, phone, qualification, experience, resumeLink, coverLetter } = req.body;
    
    if (!jobId || !name || !phone || !qualification || !experience || !resumeLink) {
        return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    try {
        const result = await db.addApplication({
            jobId,
            name,
            email: email || 'N/A',
            phone,
            qualification,
            experience,
            resumeLink,
            coverLetter: coverLetter || 'N/A'
        });
        res.json({ success: true, message: 'Application submitted successfully!', applicationId: result.id });
    } catch (err) {
        console.error('Error saving job application:', err);
        res.status(500).json({ success: false, message: 'Server Error saving application.' });
    }
});

// ============================================
//  CAREERS ADMIN ROUTES (Protected)
// ============================================

// Create Job opening
app.post('/admin/careers/job/create', requireAdmin, async (req, res) => {
    const { title, location, description, requirements } = req.body;
    if (!title) {
        return res.redirect('/admin/dashboard#careers');
    }
    try {
        await db.addJob({ title, location, description, requirements });
    } catch (err) {
        console.error('Error creating job position:', err);
    }
    res.redirect('/admin/dashboard#careers');
});

// Delete Job opening
app.post('/admin/careers/job/delete', requireAdmin, async (req, res) => {
    const { id } = req.body;
    if (id) {
        try {
            await db.deleteJob(id);
        } catch (err) {
            console.error('Error deleting job position:', err);
        }
    }
    res.redirect('/admin/dashboard#careers');
});

// Evaluate Job Application (Status update)
app.post('/admin/careers/application/status', requireAdmin, async (req, res) => {
    const { id, status } = req.body;
    if (id && status) {
        try {
            await db.updateApplicationStatus(id, status);
        } catch (err) {
            console.error('Error updating application status:', err);
        }
    }
    res.redirect('/admin/dashboard#careers');
});

// Delete Candidate Application record
app.post('/admin/careers/application/delete', requireAdmin, async (req, res) => {
    const { id } = req.body;
    if (id) {
        try {
            await db.deleteApplication(id);
        } catch (err) {
            console.error('Error deleting application record:', err);
        }
    }
    res.redirect('/admin/dashboard#careers');
});

// Admin Logout
app.get('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/admin/login');
    });
});

// ============================================
//  START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
