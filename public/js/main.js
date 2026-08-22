// Handle Scroll Animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
};

// Header Scroll Effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.boxShadow = 'none';
        header.style.background = 'rgba(255, 255, 255, 0.85)';
    }
});

// Popup Logic (General Enquiry Popup)
const popupOverlay = document.getElementById('enquiryPopup');
const courseSelect = document.getElementById('course');
const enquiryForm = document.getElementById('enquiryForm');
const formMessage = document.getElementById('formMessage');

const openEnquiryPopup = (courseName = '') => {
    if (courseName && courseSelect) {
        for (let i = 0; i < courseSelect.options.length; i++) {
            if (courseSelect.options[i].text.includes(courseName) || courseSelect.options[i].value === courseName) {
                courseSelect.selectedIndex = i;
                break;
            }
        }
    }
    if (popupOverlay) popupOverlay.classList.add('active');
};

const closeEnquiryPopup = () => {
    if (popupOverlay) popupOverlay.classList.remove('active');
    if (enquiryForm) enquiryForm.reset();
    if (formMessage) formMessage.style.display = 'none';
};

if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closeEnquiryPopup();
        }
    });
}

if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = enquiryForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = 'Submitting... <i class="bx bx-loader bx-spin"></i>';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            course: document.getElementById('course').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            formMessage.style.display = 'block';
            if (result.success) {
                formMessage.style.color = '#10b981'; // Success Green
                formMessage.textContent = 'Thank you! Your enquiry has been submitted. We will contact you soon.';
                enquiryForm.reset();
                setTimeout(() => { closeEnquiryPopup(); }, 3000);
            } else {
                formMessage.style.color = '#ef4444'; // Error Red
                formMessage.textContent = result.message || 'Something went wrong. Please try again.';
            }
        } catch (error) {
            formMessage.style.display = 'block';
            formMessage.style.color = '#ef4444';
            formMessage.textContent = 'Server connection error. Please try again later.';
        } finally {
            submitBtn.innerHTML = 'Submit Enquiry <i class="bx bx-send"></i>';
            submitBtn.disabled = false;
        }
    });
}

/* ==========================================
   HERO SLIDER CAROUSEL LOGIC
   ========================================== */
const initHeroSlider = () => {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    const sliderContainer = slider;

    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;
    let autoSlideInterval;

    const showSlide = (index) => {
        // Remove active class from all slides and dots
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        // Reset index boundary checks
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Apply active class to target slide & dot
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlide - 1);
    };

    // Auto-rotation with 3-second delay
    const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 3000);
    };

    const stopAutoSlide = () => {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    };

    // Button click listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide(); // reset timer
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide(); // reset timer
        });
    }

    // Dot indicators click listeners
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-slide'));
            showSlide(index);
            startAutoSlide(); // reset timer
        });
    });

    // Pause auto slide on hover to let users interact (e.g. view videos, fill forms)
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;
    
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });
    
    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoSlide();
    }, { passive: true });

    // Initial activation
    startAutoSlide();

    // Slide 3 Integrated Inquiry Form logic
    const slideQueryForm = document.getElementById('slideQueryForm');
    const slideFormMsg = document.getElementById('slideFormMsg');

    if (slideQueryForm) {
        slideQueryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = slideQueryForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Sending... <i class="bx bx-loader bx-spin"></i>';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('slideName').value,
                phone: document.getElementById('slidePhone').value,
                course: document.getElementById('slideCourse').value,
                message: document.getElementById('slideMessage').value
            };

            try {
                const response = await fetch('/api/enquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (result.success) {
                    slideFormMsg.style.color = '#10b981';
                    slideFormMsg.textContent = 'Enquiry sent! We will contact you soon.';
                    slideQueryForm.reset();
                } else {
                    slideFormMsg.style.color = '#f43f5e';
                    slideFormMsg.textContent = result.message || 'Error occurred. Please try again.';
                }
            } catch (err) {
                slideFormMsg.style.color = '#f43f5e';
                slideFormMsg.textContent = 'Connection error.';
            } finally {
                submitBtn.innerHTML = 'Send Query <i class="bx bx-paper-plane"></i>';
                submitBtn.disabled = false;
            }
        });
    }
};

/* ==========================================
   EXPANDING SOCIAL LINKS FLOATING BUTTON LOGIC
   ========================================== */
const initExpandingSocialMenu = () => {
    const menu = document.getElementById('socialExpandMenu');
    const trigger = document.getElementById('socialTriggerBtn');

    if (!menu || !trigger) return;

    // Toggle menu state on click
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('expanded');
        
        // Rotate trigger icon
        const icon = trigger.querySelector('i');
        if (menu.classList.contains('expanded')) {
            icon.className = 'bx bx-x';
        } else {
            icon.className = 'bx bx-plus';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
        if (menu.classList.contains('expanded')) {
            menu.classList.remove('expanded');
            trigger.querySelector('i').className = 'bx bx-plus';
        }
    });
};

/* ==========================================
   ADMISSION PORTAL OTP & FEES MATH LOGIC
   ========================================== */
const initAdmissionPortal = () => {
    const otpForm = document.getElementById('otpLoginForm');
    if (!otpForm) return;

    // Elements
    const getOtpBtn = document.getElementById('getOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const regPhone = document.getElementById('regPhone');
    const otpCode = document.getElementById('otpCode');
    const phoneInputGroup = document.getElementById('phoneInputGroup');
    const otpInputGroup = document.getElementById('otpInputGroup');
    const otpStatusMessage = document.getElementById('otpStatusMessage');

    const step1Container = document.getElementById('step1Container');
    const step2Container = document.getElementById('step2Container');
    const dotStep1 = document.getElementById('dotStep1');
    const dotStep2 = document.getElementById('dotStep2');
    const lineStep = document.getElementById('lineStep');

    const admForm = document.getElementById('admissionForm');
    const studPhone = document.getElementById('studPhone');
    const admCourse = document.getElementById('admCourse');
    const couponInput = document.getElementById('couponInput');
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponFeedback = document.getElementById('couponFeedback');

    const standardFeeText = document.getElementById('standardFee');
    const discountRow = document.getElementById('discountRow');
    const couponPercentText = document.getElementById('couponPercent');
    const discountValueText = document.getElementById('discountValue');
    const netFeeText = document.getElementById('netFee');

    let currentBaseFee = 0;
    let currentDiscountPercent = 0;
    let appliedCouponName = '';

    // Step 1: OTP Generation via API
    getOtpBtn.addEventListener('click', async () => {
        const phone = regPhone.value.trim();
        if (!/^[0-9]{10}$/.test(phone)) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }

        getOtpBtn.innerHTML = 'Sending... <i class="bx bx-loader bx-spin"></i>';
        getOtpBtn.disabled = true;

        if (otpStatusMessage) {
            otpStatusMessage.style.display = 'none';
            otpStatusMessage.textContent = '';
            otpStatusMessage.className = 'otp-status-message';
        }

        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            const result = await response.json();

            if (result.success) {
                if (otpStatusMessage) {
                    if (result.realSMS) {
                        otpStatusMessage.textContent = 'OTP sent successfully to your mobile number via SMS!';
                        otpStatusMessage.className = 'otp-status-message success';
                    } else {
                        // Fallback mock mode: show the code inline so it can still be tested locally
                        otpStatusMessage.textContent = `[Local Test Mode] OTP code is: ${result.otp}`;
                        otpStatusMessage.className = 'otp-status-message warning';
                    }
                    otpStatusMessage.style.display = 'block';
                }

                // Hide trigger, reveal inputs & verify trigger
                getOtpBtn.style.display = 'none';
                regPhone.readOnly = true;
                otpInputGroup.style.display = 'block';
                verifyOtpBtn.style.display = 'block';
            } else {
                if (otpStatusMessage) {
                    otpStatusMessage.textContent = result.message || 'Failed to send OTP.';
                    otpStatusMessage.className = 'otp-status-message danger';
                    otpStatusMessage.style.display = 'block';
                } else {
                    alert(result.message || 'Failed to send OTP.');
                }
                getOtpBtn.innerHTML = 'Generate Verification Code <i class="bx bx-mobile-vibration"></i>';
                getOtpBtn.disabled = false;
            }
        } catch (err) {
            if (otpStatusMessage) {
                otpStatusMessage.textContent = 'Server connection error. Please try again.';
                otpStatusMessage.className = 'otp-status-message danger';
                otpStatusMessage.style.display = 'block';
            } else {
                alert('Server connection error. Please try again.');
            }
            getOtpBtn.innerHTML = 'Generate Verification Code <i class="bx bx-mobile-vibration"></i>';
            getOtpBtn.disabled = false;
        }
    });

    // Step 1 Submission: OTP Verification via API on click
    verifyOtpBtn.addEventListener('click', async (e) => {
        if (e) e.preventDefault();
        const code = otpCode.value.trim();
        const phone = regPhone.value.trim();

        if (otpStatusMessage) {
            otpStatusMessage.style.display = 'none';
        }

        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp: code })
            });
            const result = await response.json();

            if (result.success) {
                // Success! Transition to Step 2
                // Visual step indicators update
                dotStep1.classList.remove('active');
                dotStep1.classList.add('completed');
                lineStep.classList.add('completed');
                dotStep2.classList.add('active');

                // Copy phone number to Step 2 read-only text input
                studPhone.value = '+91 ' + regPhone.value;

                // Form container swapping
                step1Container.style.display = 'none';
                step2Container.style.display = 'block';

                // Pre-select course if passed as query param
                const urlParams = new URLSearchParams(window.location.search);
                const courseParam = urlParams.get('course');
                if (courseParam && admCourse) {
                    for (let i = 0; i < admCourse.options.length; i++) {
                        if (admCourse.options[i].value === courseParam || admCourse.options[i].text.includes(courseParam)) {
                            admCourse.selectedIndex = i;
                            break;
                        }
                    }
                    // Trigger the fee calculations
                    calculateFees();
                }
            } else {
                if (otpStatusMessage) {
                    otpStatusMessage.textContent = result.message || 'Incorrect verification code. Please try again.';
                    otpStatusMessage.className = 'otp-status-message danger';
                    otpStatusMessage.style.display = 'block';
                } else {
                    alert(result.message || 'Incorrect verification code. Please try again.');
                }
            }
        } catch (err) {
            if (otpStatusMessage) {
                otpStatusMessage.textContent = 'Verification error. Please try again.';
                otpStatusMessage.className = 'otp-status-message danger';
                otpStatusMessage.style.display = 'block';
            } else {
                alert('Verification error. Please try again.');
            }
        }
    });

    // Step 2: Dynamic Fee Math
    function calculateFees() {
        const selectedOption = admCourse.options[admCourse.selectedIndex];
        if (!selectedOption || selectedOption.value === "") {
            standardFeeText.textContent = '₹0';
            discountRow.style.display = 'none';
            netFeeText.textContent = '₹0';
            currentBaseFee = 0;
            return;
        }

        currentBaseFee = parseInt(selectedOption.getAttribute('data-fee'));
        standardFeeText.textContent = '₹' + currentBaseFee.toLocaleString('en-IN');

        if (currentDiscountPercent > 0) {
            const savings = Math.round(currentBaseFee * (currentDiscountPercent / 100));
            const netFee = currentBaseFee - savings;

            discountRow.style.display = 'flex';
            couponPercentText.textContent = currentDiscountPercent;
            discountValueText.textContent = '-₹' + savings.toLocaleString('en-IN');
            netFeeText.textContent = '₹' + netFee.toLocaleString('en-IN');
        } else {
            discountRow.style.display = 'none';
            netFeeText.textContent = '₹' + currentBaseFee.toLocaleString('en-IN');
        }
    };

    admCourse.addEventListener('change', calculateFees);

    // Step 2: Coupon Codes Validation via API
    applyCouponBtn.addEventListener('click', async () => {
        const coupon = couponInput.value.trim().toUpperCase();
        if (currentBaseFee === 0) {
            couponFeedback.style.color = '#f43f5e';
            couponFeedback.textContent = 'Please select a course first!';
            return;
        }

        if (coupon === '') {
            currentDiscountPercent = 0;
            appliedCouponName = '';
            couponFeedback.textContent = '';
            calculateFees();
            return;
        }

        applyCouponBtn.disabled = true;
        applyCouponBtn.textContent = 'Checking...';

        try {
            const response = await fetch('/api/validate-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: coupon })
            });
            const result = await response.json();

            if (result.success) {
                currentDiscountPercent = result.discountPercent;
                appliedCouponName = result.code;
                couponFeedback.style.color = '#10b981';
                couponFeedback.textContent = 'Success! Coupon applied: ' + result.discountPercent + '% Discount unlocked!';
            } else {
                currentDiscountPercent = 0;
                appliedCouponName = '';
                couponFeedback.style.color = '#f43f5e';
                couponFeedback.textContent = result.message || 'Invalid coupon code.';
            }
        } catch (err) {
            currentDiscountPercent = 0;
            appliedCouponName = '';
            couponFeedback.style.color = '#f43f5e';
            couponFeedback.textContent = 'Server error. Please try again.';
        } finally {
            applyCouponBtn.disabled = false;
            applyCouponBtn.textContent = 'Apply';
            calculateFees();
        }
    });

    // Step 2 Final Submission: AJAX Registration
    admForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = admForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = 'Processing Admission... <i class="bx bx-loader bx-spin"></i>';
        submitBtn.disabled = true;

        const savings = Math.round(currentBaseFee * (currentDiscountPercent / 100));
        const finalNetFee = currentBaseFee - savings;

        const admissionData = {
            name: document.getElementById('studName').value,
            email: document.getElementById('studEmail').value,
            phone: studPhone.value,
            course: admCourse.value,
            finalFee: '₹' + finalNetFee.toLocaleString('en-IN'),
            couponCode: appliedCouponName || 'None'
        };

        try {
            const response = await fetch('/api/admission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(admissionData)
            });

            const result = await response.json();
            if (result.success) {
                // Hide Indicators & Container, show Success summary Card
                dotStep2.classList.remove('active');
                dotStep2.classList.add('completed');
                document.querySelector('.step-indicator-bar').style.display = 'none';
                step2Container.style.display = 'none';

                const admNum = result.admissionNumber || ('REG-' + Math.floor(100000 + Math.random() * 900000).toString());
                const isPaid = result.feesPaid === 'true' || result.feesPaid === true;

                // Inject data values to success screen
                if (document.getElementById('successName')) document.getElementById('successName').textContent = admissionData.name;
                if (document.getElementById('successStudentName')) document.getElementById('successStudentName').textContent = admissionData.name;
                if (document.getElementById('successCourseText')) document.getElementById('successCourseText').textContent = admissionData.course;
                if (document.getElementById('successFeesText')) document.getElementById('successFeesText').textContent = admissionData.finalFee;
                if (document.getElementById('successRegId')) document.getElementById('successRegId').textContent = admNum;

                const successFeesStatusEl = document.getElementById('successFeesStatus');
                if (successFeesStatusEl) {
                    successFeesStatusEl.textContent = isPaid ? 'PAID' : 'NOT PAID';
                    successFeesStatusEl.style.color = isPaid ? '#10b981' : '#f43f5e';
                }

                // Update ID card details
                if (document.getElementById('idCardName')) document.getElementById('idCardName').textContent = admissionData.name;
                if (document.getElementById('idCardRegId')) document.getElementById('idCardRegId').textContent = admNum;
                if (document.getElementById('idCardCourse')) document.getElementById('idCardCourse').textContent = admissionData.course;
                
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = new Date().toLocaleDateString('en-US', options);
                if (document.getElementById('idCardDate')) document.getElementById('idCardDate').textContent = formattedDate;

                // Update Fees Status on Card & Show stamp logo if paid
                const feesPaidEl = document.getElementById('idCardFeesPaid');
                if (feesPaidEl) {
                    feesPaidEl.textContent = isPaid ? 'PAID' : 'NOT PAID';
                    feesPaidEl.style.color = isPaid ? '#10b981' : '#f43f5e';
                }

                // Update ID card stamp area style dynamically
                const stampBoxEl = document.getElementById('idCardStampBox');
                const stampTextEl = document.getElementById('idCardStampText');
                const stampLogoEl = document.getElementById('idCardStampLogo');

                if (isPaid) {
                    if (stampBoxEl) {
                        stampBoxEl.style.borderColor = '#10b981';
                        stampBoxEl.style.color = '#10b981';
                        stampBoxEl.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.25)';
                    }
                    if (stampTextEl) {
                        stampTextEl.textContent = 'FEES PAID';
                        stampTextEl.style.color = '#10b981';
                        stampTextEl.style.borderTopColor = 'rgba(16, 185, 129, 0.3)';
                    }
                    if (stampLogoEl) {
                        stampLogoEl.style.filter = 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.3))';
                    }
                } else {
                    if (stampBoxEl) {
                        stampBoxEl.style.borderColor = '#f43f5e';
                        stampBoxEl.style.color = '#f43f5e';
                        stampBoxEl.style.boxShadow = '0 4px 15px rgba(244, 63, 94, 0.25)';
                    }
                    if (stampTextEl) {
                        stampTextEl.textContent = 'NOT PAID';
                        stampTextEl.style.color = '#f43f5e';
                        stampTextEl.style.borderTopColor = 'rgba(244, 63, 94, 0.3)';
                    }
                    if (stampLogoEl) {
                        stampLogoEl.style.filter = 'drop-shadow(0 0 4px rgba(244, 63, 94, 0.3))';
                    }
                }

                document.getElementById('admissionSuccessCard').style.display = 'block';
            } else {
                alert(result.message || 'Error completing admission. Please try again.');
                submitBtn.innerHTML = 'Confirm Admission & Register <i class="bx bx-check-double"></i>';
                submitBtn.disabled = false;
            }
        } catch (err) {
            alert('Server connection error. Please try again later.');
            submitBtn.innerHTML = 'Confirm Admission & Register <i class="bx bx-check-double"></i>';
            submitBtn.disabled = false;
        }
    });

    // ID Card Photo Upload FileReader binding
    const photoUpload = document.getElementById('idCardPhotoUpload');
    const photoPreview = document.getElementById('idCardPhotoPreview');
    if (photoUpload && photoPreview) {
        photoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    photoPreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ID Card Download Action
    const downloadBtn = document.getElementById('downloadIdCardBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const card = document.getElementById('studentIdCard');
            if (card) {
                const regId = document.getElementById('successRegId').textContent;
                html2canvas(card, {
                    scale: 2, // High resolution
                    useCORS: true,
                    backgroundColor: null
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `Student_ID_REG-${regId}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }).catch(err => {
                    console.error('html2canvas error:', err);
                    alert('Could not download ID card as image. Please try printing instead.');
                });
            }
        });
    }

    // ID Card Print Action
    const printBtn = document.getElementById('printIdCardBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            const cardEl = document.getElementById('studentIdCard');
            if (cardEl) {
                const iframe = document.createElement('iframe');
                iframe.style.position = 'fixed';
                iframe.style.right = '0';
                iframe.style.bottom = '0';
                iframe.style.width = '0';
                iframe.style.height = '0';
                iframe.style.border = '0';
                document.body.appendChild(iframe);
                
                const doc = iframe.contentWindow.document;
                doc.write('<html><head><title>Student ID Card</title>');
                doc.write('<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">');
                doc.write('<link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">');
                doc.write('<style>');
                doc.write('body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #0b0f19; }');
                doc.write('</style></head><body>');
                doc.write(cardEl.outerHTML);
                doc.write('</body></html>');
                doc.close();
                
                iframe.contentWindow.focus();
                setTimeout(() => {
                    iframe.contentWindow.print();
                    document.body.removeChild(iframe);
                }, 500);
            }
        });
    }

    // ID Card Share Action (WhatsApp Web / Web Share API)
    const shareBtn = document.getElementById('shareIdCardBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const regId = document.getElementById('successRegId').textContent;
            const courseEl = document.getElementById('successCourseText') || document.getElementById('successCourse');
            const course = courseEl ? courseEl.textContent : '';
            const shareText = `Hi! I just successfully registered for the ${course} course at Progress IT Institute Pune. My Registration ID is ${regId}. Check out their programs: ${window.location.origin}`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Progress IT Institute Admission',
                    text: shareText,
                    url: window.location.origin
                }).catch(err => console.log(err));
            } else {
                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    }

    // Student Login Form Submission Handler
    const studentLoginForm = document.getElementById('studentLoginForm');
    const studentLoginError = document.getElementById('studentLoginError');
    if (studentLoginForm) {
        studentLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const admissionNumber = document.getElementById('loginRegId').value.trim();

            if (studentLoginError) {
                studentLoginError.style.display = 'none';
                studentLoginError.textContent = '';
            }

            try {
                const response = await fetch('/api/student-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ admissionNumber })
                });

                const result = await response.json();
                if (result.success) {
                    const student = result.student;
                    
                    // Close the popup modal
                    closeStudentLoginPopup();

                    // Hide indicators & steps
                    document.querySelector('.step-indicator-bar').style.display = 'none';
                    if (step1Container) step1Container.style.display = 'none';
                    if (step2Container) step2Container.style.display = 'none';

                    const isPaid = student.feesPaid === 'true' || student.feesPaid === true;

                    // Inject retrieved values to success screen
                    if (document.getElementById('successName')) document.getElementById('successName').textContent = student.name;
                    if (document.getElementById('successStudentName')) document.getElementById('successStudentName').textContent = student.name;
                    if (document.getElementById('successCourseText')) document.getElementById('successCourseText').textContent = student.course;
                    if (document.getElementById('successFeesText')) document.getElementById('successFeesText').textContent = student.finalFee;
                    if (document.getElementById('successRegId')) document.getElementById('successRegId').textContent = student.admissionNumber;

                    const successFeesStatusEl = document.getElementById('successFeesStatus');
                    if (successFeesStatusEl) {
                        successFeesStatusEl.textContent = isPaid ? 'PAID' : 'NOT PAID';
                        successFeesStatusEl.style.color = isPaid ? '#10b981' : '#f43f5e';
                    }

                    // Update ID card details
                    if (document.getElementById('idCardName')) document.getElementById('idCardName').textContent = student.name;
                    if (document.getElementById('idCardRegId')) document.getElementById('idCardRegId').textContent = student.admissionNumber;
                    if (document.getElementById('idCardCourse')) document.getElementById('idCardCourse').textContent = student.course;
                    
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    const formattedDate = new Date(student.createdAt).toLocaleDateString('en-US', options);
                    if (document.getElementById('idCardDate')) document.getElementById('idCardDate').textContent = formattedDate;

                    // Update Fees Status on Card
                    const feesPaidEl = document.getElementById('idCardFeesPaid');
                    if (feesPaidEl) {
                        feesPaidEl.textContent = isPaid ? 'PAID' : 'NOT PAID';
                        feesPaidEl.style.color = isPaid ? '#10b981' : '#f43f5e';
                    }

                    // Update ID card stamp area style dynamically
                    const stampBoxEl = document.getElementById('idCardStampBox');
                    const stampTextEl = document.getElementById('idCardStampText');
                    const stampLogoEl = document.getElementById('idCardStampLogo');

                    if (isPaid) {
                        if (stampBoxEl) {
                            stampBoxEl.style.borderColor = '#10b981';
                            stampBoxEl.style.color = '#10b981';
                            stampBoxEl.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.25)';
                        }
                        if (stampTextEl) {
                            stampTextEl.textContent = 'FEES PAID';
                            stampTextEl.style.color = '#10b981';
                            stampTextEl.style.borderTopColor = 'rgba(16, 185, 129, 0.3)';
                        }
                        if (stampLogoEl) {
                            stampLogoEl.style.filter = 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.3))';
                        }
                    } else {
                        if (stampBoxEl) {
                            stampBoxEl.style.borderColor = '#f43f5e';
                            stampBoxEl.style.color = '#f43f5e';
                            stampBoxEl.style.boxShadow = '0 4px 15px rgba(244, 63, 94, 0.25)';
                        }
                        if (stampTextEl) {
                            stampTextEl.textContent = 'NOT PAID';
                            stampTextEl.style.color = '#f43f5e';
                            stampTextEl.style.borderTopColor = 'rgba(244, 63, 94, 0.3)';
                        }
                        if (stampLogoEl) {
                            stampLogoEl.style.filter = 'drop-shadow(0 0 4px rgba(244, 63, 94, 0.3))';
                        }
                    }

                    document.getElementById('admissionSuccessCard').style.display = 'block';
                } else {
                    if (studentLoginError) {
                        studentLoginError.textContent = result.message || 'Invalid Admission Number. Please check and try again.';
                        studentLoginError.style.display = 'block';
                    } else {
                        alert(result.message || 'Login failed.');
                    }
                }
            } catch (err) {
                if (studentLoginError) {
                    studentLoginError.textContent = 'Server connection error. Please try again.';
                    studentLoginError.style.display = 'block';
                } else {
                    alert('Server connection error. Please try again.');
                }
            }
        });
    }
};

/* ==========================================
   BLOG DETAILS LOADER & MODALS LOGIC
   ========================================== */
const blogArticlesDB = {
    'sap-fico': {
        title: 'How to Kickstart Your Career in SAP FICO in 2026',
        category: 'SAP ERP Modules',
        date: 'May 18, 2026',
        content: `
            <p>SAP FICO is the core finance and controlling module in SAP ERP. Companies globally rely heavily on SAP to record financial data, manage accounting reports, and control budgets. Due to its strategic business role, demand for expert SAP FICO consultants remains at an all-time high.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--accent);">Why Choose SAP FICO?</h4>
            <p>1. <strong>Exceptional Career Mobility:</strong> Because almost all large companies employ SAP ERP, FICO certified professionals can work across sectors including banking, pharmaceuticals, manufacturing, and technology.<br>
            2. <strong>Lucrative Compensation:</strong> Experienced consultants routinely secure packages ranging from 8 LPA to 25+ LPA in India, with high global placement prospects.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--accent);">Standard FICO Interview Topics to Master</h4>
            <ul>
                <li><strong>General Ledger (GL):</strong> Understand chart of accounts, fiscal year variants, posting keys, and document types.</li>
                <li><strong>Accounts Payable & Receivable (AP & AR):</strong> Master house banks, payment programs, vendor groups, and customer master records.</li>
                <li><strong>Asset Accounting (AA):</strong> Know depreciation keys, asset classes, and values acquisition configurations.</li>
                <li><strong>Controlling (CO):</strong> Clear concepts of cost center accounting, internal orders, and profit center setups.</li>
            </ul>
            <p style="margin-top:1.5rem;">Join Progress IT Institute's certified SAP classroom programs in Nigdi, Pune, under the mentorship of <strong>Sourabh Sir</strong>, to practice live integration scenarios and build real-world experience.</p>
        `
    },
    'devops-aws': {
        title: 'Why DevOps and AWS are the Highest Paying IT Jobs Today',
        category: 'Cloud & DevOps',
        date: 'May 14, 2026',
        content: `
            <p>DevOps is not just a job role—it is a collaborative culture combined with tools that automate software integration and delivery. Combined with AWS (Amazon Web Services), DevOps forms the foundation of modern digital SaaS giants.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--accent);">The DevOps Tools Pipeline</h4>
            <p>To succeed as a modern Cloud Engineer, you must master the fundamental layers of automated pipelines:</p>
            <ul>
                <li><strong>Version Control:</strong> Git & GitHub (Branching models, pull requests).</li>
                <li><strong>CI/CD Pipelines:</strong> Jenkins or GitHub Actions for building and testing code automatically.</li>
                <li><strong>Containerization:</strong> Docker (Writing Dockerfiles, managing container registries).</li>
                <li><strong>Orchestration:</strong> Kubernetes (Pods, deployments, services, replicas).</li>
                <li><strong>Infrastructure as Code (IaC):</strong> Terraform to provision servers programmatically.</li>
            </ul>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--accent);">Career Outlook</h4>
            <p>AWS DevOps is incredibly resilient to tech recessions. Companies prioritising cost optimization migrate to cloud serverless frameworks, generating huge vacancies. Average salaries for freshers start from 5-7 LPA, rising exponentially with certification credentials.</p>
            <p style="margin-top:1.5rem;">Our classroom labs in Pune offer 100% practical cloud sandbox environments. Prepare for global certificates under <strong>Rahul Sir</strong>'s senior guidance.</p>
        `
    },
    'security-datascience': {
        title: 'Data Science vs. Cyber Security: Which Path to Choose?',
        category: 'Hot Domain',
        date: 'May 08, 2026',
        content: `
            <p>Selecting between Data Science and Cyber Security can be challenging, as both are extremely popular, well-paying tech specializations. Here is an authentic structural breakdown to help you match your aptitude:</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--accent);">1. Data Science & Machine Learning</h4>
            <p><strong>Aptitude Match:</strong> If you enjoy statistics, analyzing mathematical figures, solving data puzzles, and predicting future trends, this is your path.</p>
            <p><strong>Core Stack:</strong> Python, SQL, Pandas, NumPy, Scikit-Learn, PowerBI, Tableau, and Machine Learning models.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--accent);">2. Cyber Security & Ethical Hacking</h4>
            <p><strong>Aptitude Match:</strong> If you are interested in network architectures, operating systems, finding security flaws, and defending servers against cyber attacks, choose security.</p>
            <p><strong>Core Stack:</strong> Linux commands, Penetration testing tools (Kali Linux, Wireshark, Metasploit), Cryptography, SIEM, and firewalls.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--accent);">Summary Recommendation</h4>
            <p>Data Science usually requires a strong mathematical bent. Cyber Security is highly analytical and hands-on with operating systems. Both offer standard packages of 6 LPA+ for freshers with immense remote work potential globally.</p>
        `
    },
    'python-fullstack': {
        title: 'Python: The Ultimate Programming Foundation for 2026',
        category: 'Programming',
        date: 'Apr 29, 2026',
        content: `
            <p>Python is consistently ranked as the most popular programming language globally. Thanks to its clean syntax and massive package library, Python is the foundation for Web Development, Automation, and Artificial Intelligence.</p>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--accent);">Mastering Full-Stack Web Development</h4>
            <p>Learning Python isn't just about scripting loops. To build scalable enterprise apps, master Python Web Frameworks:</p>
            <ul>
                <li><strong>Django:</strong> The high-level "batteries-included" web framework. Perfect for rapid, secure database-driven apps.</li>
                <li><strong>REST APIs:</strong> Building backends using Django REST Framework (DRF) to feed frontend React systems.</li>
                <li><strong>Frontend Stack:</strong> HTML, CSS, JavaScript, and React.js to make responsive user interfaces.</li>
            </ul>
            <h4 style="margin: 1.5rem 0 0.5rem; color:var(--accent);">Standard Prep Interview Tips</h4>
            <p>1. Master core data structures (Lists, Dicts, Sets, Tuples).<br>
            2. Be fluent in Object-Oriented Programming (OOP) concepts: Inheritance, Encapsulation, Polymorphism.<br>
            3. Understand database connections (ORMs, SQLite, PostgreSQL).</p>
            <p style="margin-top:1.5rem;">Start scripting your first projects in our specialized software laboratory blocks today!</p>
        `
    }
};

const openBlogModal = (articleId) => {
    const modal = document.getElementById('blogArticleModal');
    const db = blogArticlesDB[articleId];
    if (!modal || !db) return;

    // Load data
    document.getElementById('modalBlogTag').textContent = db.category;
    document.getElementById('modalBlogTitle').textContent = db.title;
    document.getElementById('modalBlogDate').innerHTML = `<i class='bx bx-calendar'></i> ${db.date}`;
    document.getElementById('modalBlogContent').innerHTML = db.content;

    // Show modal
    modal.classList.add('active');
};

const closeBlogModal = () => {
    const modal = document.getElementById('blogArticleModal');
    if (modal) modal.classList.remove('active');
};

// Close blog modal on backdrop click
const modalEl = document.getElementById('blogArticleModal');
if (modalEl) {
    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) {
            closeBlogModal();
        }
    });
}

/* ==========================================
   MOBILE RESPONSIVE NAVIGATION MENU
   ========================================== */
const initMobileNavigation = () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!mobileToggle || !navLinks) return;

    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('active')) {
                icon.className = 'bx bx-x';
            } else {
                icon.className = 'bx bx-menu';
            }
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.className = 'bx bx-menu';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'bx bx-menu';
            }
        }
    });
};

/* ==========================================
   INITIALIZE ON DOM CONTENT LOADED
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    initHeroSlider();
    initExpandingSocialMenu();
    initAdmissionPortal();
    initMobileNavigation();
    
    // Automatically open popup after 7 seconds, only once per session
    if (!sessionStorage.getItem('enquiryPopupShown')) {
        setTimeout(() => {
            openEnquiryPopup();
            sessionStorage.setItem('enquiryPopupShown', 'true');
        }, 7000);
    }

    // Review read more toggle
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('read-more-btn')) {
            const textEl = e.target.previousElementSibling;
            if (textEl && textEl.classList.contains('review-text-truncated')) {
                textEl.classList.toggle('expanded');
                e.target.textContent = textEl.classList.contains('expanded') ? 'Read less' : 'Read more';
            }
        }
    });
});
