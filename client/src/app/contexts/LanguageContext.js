"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language data with all translations
const languageData = {
  'gb': {
    code: 'gb',
    name: 'English',
    flag: '🇬🇧',
    // HOME PAGE
    'home-hero-title': 'Discover Jerusalem',
    'home-hero-subtitle': 'Experience the rich history and sacred beauty of Al-Quds through our immersive virtual journey',
    'home-badge-routes': '10 Sacred Routes',
    'home-badge-map': 'Interactive Map',
    'home-badge-history': 'Rich History',
    'home-guide-title': 'Alquds Virtual Guide',
    'home-guide-quote': 'Inoy\'s Guide to the Best Sights in Alquds Old City',
    'home-guide-description-1': 'The Old City of Alquds is a UNESCO World Heritage site divided into four quarters — Muslim, Christian, Jewish, and Armenian — each with its own unique rhythm, landmarks, and stories.',
    'home-guide-description-2': 'The entire walled city is only about 1 km², so you can explore much of it on foot.',
    'home-video-title': 'Watch Our Story',
    'home-video-subtitle': 'Discover the beauty and history of Jerusalem through our immersive video experience',
    'home-routes-title': 'Explore Sacred Jerusalem',
    'home-map-title': 'Interactive Map',
    'home-map-subtitle': 'Explore the sacred routes and landmarks of Jerusalem with our interactive map',
    'home-map-location': 'Jerusalem Old City',
    'home-cta-title': 'Ready to Begin Your Journey?',
    'home-cta-subtitle': 'Discover the ancient streets, sacred sites, and rich cultural heritage that make Jerusalem one of the world\'s most fascinating cities.',
    'home-cta-button': 'Explore Now',
    'home-start-button': 'Start Exploring',

    // HEADER
    'header-home': 'Home',
    'header-cart': 'My Cart',
    'header-profile': 'Profile',
    'header-search-placeholder': 'Search',
    'header-language': 'Select Language',

    // GENERAL BUTTONS
    'button-save': 'Save',
    'button-cancel': 'Cancel',
    'button-edit': 'Edit',
    'button-submit': 'Submit',
    'button-close': 'Close',
    'button-back': 'Back',
    'button-next': 'Next',
    'button-search': 'Search',
    'button-loading': 'Loading...',

    // ABOUT PAGE
    'about-badge': 'About Us',
    'about-hero-title-1': 'We Build Digital',
    'about-hero-title-2': 'Experiences',
    'about-hero-subtitle': 'Empowering businesses and individuals with innovative solutions that transform ideas into reality',
    'about-mission-title': 'Our Mission',
    'about-mission-paragraph-1': 'We exist to simplify the complex and empower the ambitious. Our platform is thoughtfully designed to bridge the gap between sophisticated technology and effortless usability, ensuring that powerful tools are accessible to everyone, regardless of technical expertise.',
    'about-mission-paragraph-2': 'Through continuous innovation, unwavering commitment to security, and a user-first philosophy, we strive to create digital experiences that not only meet expectations but exceed them.',
    'about-values-title': 'What Drives Us',
    'about-values-subtitle': 'The core principles that shape our vision and guide our actions',
    'about-value1-title': 'Innovation',
    'about-value1-description': 'Pioneering cutting-edge solutions that push the boundaries of what\'s possible in digital experiences.',
    'about-value2-title': 'Security',
    'about-value2-description': 'Industry-leading security measures to protect your data with state-of-the-art encryption protocols.',
    'about-value3-title': 'Community',
    'about-value3-description': 'Building meaningful connections and fostering a vibrant community of engaged users worldwide.',
    'about-value4-title': 'Excellence',
    'about-value4-description': 'Committed to delivering exceptional quality and continuous improvement in everything we create.',
    'about-stat1-value': '10,000+',
    'about-stat1-label': 'Active Users',
    'about-stat2-value': '50+',
    'about-stat2-label': 'Countries',
    'about-stat3-value': '99.9%',
    'about-stat3-label': 'Uptime',
    'about-stat4-value': '24/7',
    'about-stat4-label': 'Support',
    'about-cta-title': 'Join Us on This Journey',
    'about-cta-subtitle': 'Be part of a community that values innovation, security, and excellence. Together, we\'re shaping the future of digital interactions.',

    // CONTACT PAGE
    'contact-badge': 'Contact Us',
    'contact-hero-title-1': 'Let\'s Talk About',
    'contact-hero-title-2': 'Your Ideas',
    'contact-hero-subtitle': 'Have questions? We\'re here to help. Send us a message and we\'ll respond promptly.',
    'contact-info1-label': 'Email',
    'contact-info1-value': 'support@example.com',
    'contact-info2-label': 'Phone',
    'contact-info2-value': '+1 (555) 123-4567',
    'contact-info3-label': 'Location',
    'contact-info3-value': 'New York, NY 10001',
    'contact-form-title': 'Send a Message',
    'contact-form-subtitle': 'Fill out the form and we\'ll be in touch within 24 hours',
    'contact-form-name-label': 'Your Name',
    'contact-form-email-label': 'Email Address',
    'contact-form-subject-label': 'Subject',
    'contact-form-message-label': 'Your Message',
    'contact-form-submit-button': 'Send Message',
    'contact-success-title': 'Thank you for reaching out!',
    'contact-success-message': 'Your message has been sent successfully. We\'ll get back to you soon.',

    // DASHBOARD PAGE
    'dashboard-title': 'Dashboard',
    'dashboard-subtitle': 'Welcome back! Here\'s what\'s happening with your website.',
    'dashboard-profile-title': 'Personal Information',
    'dashboard-profile-email': 'Email Address',
    'dashboard-profile-password': 'Password',
    'dashboard-profile-edit-button': 'Edit Profile',
    'dashboard-quick-actions': 'Quick Actions',
    'dashboard-analytics': 'Analytics',
    'dashboard-analytics-subtitle': 'View detailed analytics',
    'dashboard-users': 'Users',
    'dashboard-users-subtitle': 'Manage user accounts',
    'dashboard-content-management': 'Content Management',
    'dashboard-content-management-subtitle': 'Edit website content',
    'dashboard-total-visitors': 'Total Visitors',
    'dashboard-registered-users': 'Registered Users',
    'dashboard-page-views': 'Page Views',
    'dashboard-conversion-rate': 'Conversion Rate',
    'dashboard-loading': 'Loading dashboard...',
    'dashboard-email-verification-pending': 'Email Verification Pending',
    'dashboard-email-verification-message': 'A verification email has been sent to {email}. Please check your inbox and click the verification link to complete the email change.',
    'dashboard-registered-user': 'Registered User',

    // DASHBOARD EDIT PROFILE DIALOG
    'dashboard-edit-profile-title': 'Edit Profile',
    'dashboard-edit-profile-email-label': 'Email Address',
    'dashboard-edit-profile-email-field': 'Email',
    'dashboard-edit-profile-change-password': 'Change Password (Optional)',
    'dashboard-edit-profile-set-password': 'Set Password (Optional)',
    'dashboard-edit-profile-password-info': 'Leave these fields empty if you don\'t want to change your password',
    'dashboard-edit-profile-password-social-info': 'You signed in with social media. You can optionally set a password to enable email/password login',
    'dashboard-edit-profile-current-password': 'Current Password',
    'dashboard-edit-profile-current-password-help': 'Enter your current password',
    'dashboard-edit-profile-forgot-password': 'Forgot your password?',
    'dashboard-edit-profile-new-password': 'New Password',
    'dashboard-edit-profile-new-password-help': 'Minimum 6 characters',
    'dashboard-edit-profile-confirm-password': 'Confirm New Password',
    'dashboard-edit-profile-confirm-password-help': 'Re-enter your new password to confirm',
    'dashboard-edit-profile-cancel': 'Cancel',
    'dashboard-edit-profile-save': 'Save Changes',

    // ANALYTICS PAGE
    'analytics-title': 'Analytics',
    'analytics-subtitle': 'Detailed website performance metrics',
    'analytics-loading': 'Loading analytics data...',
    'analytics-no-data-title': 'No Analytics Data Available',
    'analytics-no-data-message': 'Analytics tracking is active, but no data has been collected yet.',
    'analytics-page-views': 'Page Views',
    'analytics-page-views-subtitle': 'Total views',
    'analytics-unique-visitors': 'Unique Visitors',
    'analytics-unique-visitors-subtitle': 'Individual users',
    'analytics-bounce-rate': 'Bounce Rate',
    'analytics-bounce-rate-subtitle': 'Single page visits',
    'analytics-avg-session': 'Avg Session',
    'analytics-avg-session-subtitle': 'Session duration',
    'analytics-trend-from-last-month': '{trend}% from last month',
    'analytics-top-pages': 'Top Pages',
    'analytics-top-pages-no-data': 'No data yet.',
    'analytics-traffic-sources': 'Traffic Sources',
    'analytics-traffic-sources-no-data': 'No data yet.',
    'analytics-views': 'views',
    'analytics-visitors': 'visitors',

    // USER MANAGEMENT PAGE
    'users-title': 'User Management',
    'users-subtitle': 'Manage user accounts and permissions',
    'users-export-button': 'Export Users',
    'users-total-users': 'Total Users',
    'users-active-users': 'Active Users',
    'users-administrators': 'Administrators',
    'users-inactive-users': 'Inactive Users',
    'users-search-placeholder': 'Search users by email or role...',
    'users-table-user': 'User',
    'users-table-role': 'Role',
    'users-table-status': 'Status',
    'users-table-joined': 'Joined',
    'users-table-last-login': 'Last Login',
    'users-table-actions': 'Actions',
    'users-no-users-search': 'No users found matching your search.',
    'users-no-users-registered': 'No users registered yet. Create an account to see users here!',
    'users-manage-dialog-title': 'Manage User',
    'users-manage-dialog-question': 'What would you like to do with {email}?',
    'users-manage-dialog-current-status': 'Current Status:',
    'users-manage-dialog-cancel': 'Cancel',
    'users-manage-dialog-deactivate': 'Deactivate User',
    'users-manage-dialog-activate': 'Activate User',
    'users-manage-dialog-delete': 'Delete User',
    'users-export-success': 'Users exported successfully!',
    'users-export-coming-soon': 'Export feature coming soon!',
    'users-delete-success': 'User {email} deleted successfully',
    'users-delete-error': 'Failed to delete user',
    'users-status-success': 'User {email} {status} successfully',
    'users-status-error': 'Failed to update user status',
    'users-cannot-delete-self': 'You cannot delete your own account!',
    'users-id': 'ID: {id}',
  },
  'sa': {
    code: 'sa',
    name: 'العربية',
    flag: '🇸🇦',
    // HOME PAGE - ARABIC
    'home-hero-title': 'اكتشف القدس',
    'home-hero-subtitle': 'استكشف التاريخ الغني والجمال المقدس للقدس من خلال رحلتنا الافتراضية الغامرة',
    'home-badge-routes': '10 مسارات مقدسة',
    'home-badge-map': 'خريطة تفاعلية',
    'home-badge-history': 'تاريخ غني',
    'home-guide-title': 'دليل القدس الافتراضي',
    'home-guide-quote': 'دليل إينوي لأفضل المعالم في البلدة القديمة بالقدس',
    'home-guide-description-1': 'البلدة القديمة في القدس هي موقع تراث عالمي لليونسكو مقسم إلى أربعة أحياء - مسلم ومسيحي ويهودي وأرمني - لكل منها إيقاع ومعالم وقصص فريدة.',
    'home-guide-description-2': 'المدينة المسورة بأكملها لا تزيد عن 1 كيلومتر مربع، لذا يمكنك استكشاف الكثير منها سيراً على الأقدام.',
    'home-video-title': 'شاهد قصتنا',
    'home-video-subtitle': 'اكتشف جمال وتاريخ القدس من خلال تجربتنا المرئية الغامرة',
    'home-routes-title': 'استكشف القدس المقدسة',
    'home-map-title': 'خريطة تفاعلية',
    'home-map-subtitle': 'استكشف المسارات المقدسة ومعالم القدس مع خريطتنا التفاعلية',
    'home-map-location': 'البلدة القديمة في القدس',
    'home-cta-title': 'مستعد لبدء رحلتك؟',
    'home-cta-subtitle': 'اكتشف الشوارع القديمة والمواقع المقدسة والتراث الثقافي الغني الذي يجعل القدس واحدة من أكثر المدن إثارة للاهتمام في العالم.',
    'home-cta-button': 'استكشف الآن',
    'home-start-button': 'ابدأ الاستكشاف',

    // HEADER - ARABIC
    'header-home': 'الرئيسية',
    'header-cart': 'سلة التسوق',
    'header-profile': 'الملف الشخصي',
    'header-search-placeholder': 'بحث',
    'header-language': 'اختر اللغة',

    // GENERAL BUTTONS - ARABIC
    'button-save': 'حفظ',
    'button-cancel': 'إلغاء',
    'button-edit': 'تعديل',
    'button-submit': 'إرسال',
    'button-close': 'إغلاق',
    'button-back': 'رجوع',
    'button-next': 'التالي',
    'button-search': 'بحث',
    'button-loading': 'جاري التحميل...',

    // ABOUT PAGE - ARABIC
    'about-badge': 'عنّا',
    'about-hero-title-1': 'نبني تجارب',
    'about-hero-title-2': 'رقمية',
    'about-hero-subtitle': 'تمكين الشركات والأفراد بحلول مبتكرة تحول الأفكار إلى واقع',
    'about-mission-title': 'مهمتنا',
    'about-mission-paragraph-1': 'نحن موجودون لتبسيط المعقد وتمكين الطموحين. تم تصميم منصتنا بعناية لسد الفجوة بين التكنولوجيا المتطورة وسهولة الاستخدام، مما يضمن إمكانية الوصول إلى الأدوات القوية للجميع، بغض النظر عن الخبرة التقنية.',
    'about-mission-paragraph-2': 'من خلال الابتكار المستمر والالتزام الثابت بالأمان وفلسفة المستخدم أولاً، نسعى جاهدين لإنشاء تجارب رقمية لا تلبي التوقعات فحسب، بل تتجاوزها.',
    'about-values-title': 'ما يحركنا',
    'about-values-subtitle': 'المبادئ الأساسية التي تشكل رؤيتنا وتوجه أعمالنا',
    'about-value1-title': 'الابتكار',
    'about-value1-description': 'ريادة حلول متطورة تدفع حدود ما هو ممكن في التجارب الرقمية.',
    'about-value2-title': 'الأمان',
    'about-value2-description': 'تدابير أمان رائدة في الصناعة لحماية بياناتك ببروتوكولات تشفير حديثة.',
    'about-value3-title': 'المجتمع',
    'about-value3-description': 'بناء علاقات ذات مغزى وتعزيز مجتمع نابض بالحياة من المستخدمين المشاركين في جميع أنحاء العالم.',
    'about-value4-title': 'التميز',
    'about-value4-description': 'ملتزمون بتقديم جودة استثنائية وتحسين مستمر في كل ما نقوم بإنشائه.',
    'about-stat1-value': '10,000+',
    'about-stat1-label': 'مستخدم نشط',
    'about-stat2-value': '50+',
    'about-stat2-label': 'دولة',
    'about-stat3-value': '99.9%',
    'about-stat3-label': 'وقت التشغيل',
    'about-stat4-value': '24/7',
    'about-stat4-label': 'الدعم',
    'about-cta-title': 'انضم إلينا في هذه الرحلة',
    'about-cta-subtitle': 'كن جزءًا من مجتمع يقدر الابتكار والأمان والتميز. معًا، نحن نشكل مستقبل التفاعلات الرقمية.',

    // CONTACT PAGE - ARABIC
    'contact-badge': 'اتصل بنا',
    'contact-hero-title-1': 'لنتحدث عن',
    'contact-hero-title-2': 'أفكارك',
    'contact-hero-subtitle': 'هل لديك أسئلة؟ نحن هنا للمساعدة. أرسل لنا رسالة وسنرد على الفور.',
    'contact-info1-label': 'البريد الإلكتروني',
    'contact-info1-value': 'support@example.com',
    'contact-info2-label': 'الهاتف',
    'contact-info2-value': '+1 (555) 123-4567',
    'contact-info3-label': 'الموقع',
    'contact-info3-value': 'نيويورك، NY 10001',
    'contact-form-title': 'أرسل رسالة',
    'contact-form-subtitle': 'املأ النموذج وسنتواصل معك خلال 24 ساعة',
    'contact-form-name-label': 'اسمك',
    'contact-form-email-label': 'عنوان البريد الإلكتروني',
    'contact-form-subject-label': 'الموضوع',
    'contact-form-message-label': 'رسالتك',
    'contact-form-submit-button': 'إرسال الرسالة',
    'contact-success-title': 'شكرًا لتواصلك معنا!',
    'contact-success-message': 'تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.',

    // DASHBOARD PAGE - ARABIC
    'dashboard-title': 'لوحة التحكم',
    'dashboard-subtitle': 'مرحباً بعودتك! إليك ما يحدث في موقعك.',
    'dashboard-profile-title': 'المعلومات الشخصية',
    'dashboard-profile-email': 'عنوان البريد الإلكتروني',
    'dashboard-profile-password': 'كلمة المرور',
    'dashboard-profile-edit-button': 'تعديل الملف الشخصي',
    'dashboard-quick-actions': 'الإجراءات السريعة',
    'dashboard-analytics': 'التحليلات',
    'dashboard-analytics-subtitle': 'عرض التحليلات التفصيلية',
    'dashboard-users': 'المستخدمون',
    'dashboard-users-subtitle': 'إدارة حسابات المستخدمين',
    'dashboard-content-management': 'إدارة المحتوى',
    'dashboard-content-management-subtitle': 'تعديل محتوى الموقع',
    'dashboard-total-visitors': 'إجمالي الزوار',
    'dashboard-registered-users': 'المستخدمون المسجلون',
    'dashboard-page-views': 'مشاهدات الصفحة',
    'dashboard-conversion-rate': 'معدل التحويل',
    'dashboard-loading': 'جاري تحميل لوحة التحكم...',
    'dashboard-email-verification-pending': 'تأكيد البريد الإلكتروني معلق',
    'dashboard-email-verification-message': 'تم إرسال بريد إلكتروني للتأكيد إلى {email}. يرجى التحقق من صندوق الوارد الخاص بك والنقر على رابط التأكيد لإكمال تغيير البريد الإلكتروني.',
    'dashboard-registered-user': 'مستخدم مسجل',

    // DASHBOARD EDIT PROFILE DIALOG - ARABIC
    'dashboard-edit-profile-title': 'تعديل الملف الشخصي',
    'dashboard-edit-profile-email-label': 'عنوان البريد الإلكتروني',
    'dashboard-edit-profile-email-field': 'البريد الإلكتروني',
    'dashboard-edit-profile-change-password': 'تغيير كلمة المرور (اختياري)',
    'dashboard-edit-profile-set-password': 'تعيين كلمة مرور (اختياري)',
    'dashboard-edit-profile-password-info': 'اترك هذه الحقول فارغة إذا كنت لا تريد تغيير كلمة المرور',
    'dashboard-edit-profile-password-social-info': 'لقد سجلت الدخول عبر وسائل التواصل الاجتماعي. يمكنك اختيارياً تعيين كلمة مرور لتمكين تسجيل الدخول بالبريد الإلكتروني/كلمة المرور',
    'dashboard-edit-profile-current-password': 'كلمة المرور الحالية',
    'dashboard-edit-profile-current-password-help': 'أدخل كلمة المرور الحالية',
    'dashboard-edit-profile-forgot-password': 'نسيت كلمة المرور؟',
    'dashboard-edit-profile-new-password': 'كلمة المرور الجديدة',
    'dashboard-edit-profile-new-password-help': 'الحد الأدنى 6 أحرف',
    'dashboard-edit-profile-confirm-password': 'تأكيد كلمة المرور الجديدة',
    'dashboard-edit-profile-confirm-password-help': 'أعد إدخال كلمة المرور الجديدة للتأكيد',
    'dashboard-edit-profile-cancel': 'إلغاء',
    'dashboard-edit-profile-save': 'حفظ التغييرات',

    // ANALYTICS PAGE - ARABIC
    'analytics-title': 'التحليلات',
    'analytics-subtitle': 'مقاييس أداء الموقع التفصيلية',
    'analytics-loading': 'جاري تحميل بيانات التحليلات...',
    'analytics-no-data-title': 'لا توجد بيانات تحليلات متاحة',
    'analytics-no-data-message': 'تتبع التحليلات نشط، ولكن لم يتم جمع أي بيانات بعد.',
    'analytics-page-views': 'مشاهدات الصفحة',
    'analytics-page-views-subtitle': 'إجمالي المشاهدات',
    'analytics-unique-visitors': 'الزوار الفريدون',
    'analytics-unique-visitors-subtitle': 'المستخدمون الفرديون',
    'analytics-bounce-rate': 'معدل الارتداد',
    'analytics-bounce-rate-subtitle': 'زيارات صفحة واحدة',
    'analytics-avg-session': 'متوسط الجلسة',
    'analytics-avg-session-subtitle': 'مدة الجلسة',
    'analytics-trend-from-last-month': '{trend}% من الشهر الماضي',
    'analytics-top-pages': 'أفضل الصفحات',
    'analytics-top-pages-no-data': 'لا توجد بيانات بعد.',
    'analytics-traffic-sources': 'مصادر المرور',
    'analytics-traffic-sources-no-data': 'لا توجد بيانات بعد.',
    'analytics-views': 'مشاهدات',
    'analytics-visitors': 'زوار',

    // USER MANAGEMENT PAGE - ARABIC
    'users-title': 'إدارة المستخدمين',
    'users-subtitle': 'إدارة حسابات المستخدمين والصلاحيات',
    'users-export-button': 'تصدير المستخدمين',
    'users-total-users': 'إجمالي المستخدمين',
    'users-active-users': 'المستخدمون النشطون',
    'users-administrators': 'المديرون',
    'users-inactive-users': 'المستخدمون غير النشطين',
    'users-search-placeholder': 'البحث عن المستخدمين بالبريد الإلكتروني أو الدور...',
    'users-table-user': 'المستخدم',
    'users-table-role': 'الدور',
    'users-table-status': 'الحالة',
    'users-table-joined': 'انضم',
    'users-table-last-login': 'آخر تسجيل دخول',
    'users-table-actions': 'الإجراءات',
    'users-no-users-search': 'لم يتم العثور على مستخدمين يطابقون بحثك.',
    'users-no-users-registered': 'لم يتم تسجيل أي مستخدمين بعد. أنشئ حساباً لرؤية المستخدمين هنا!',
    'users-manage-dialog-title': 'إدارة المستخدم',
    'users-manage-dialog-question': 'ماذا تريد أن تفعل مع {email}؟',
    'users-manage-dialog-current-status': 'الحالة الحالية:',
    'users-manage-dialog-cancel': 'إلغاء',
    'users-manage-dialog-deactivate': 'إلغاء تفعيل المستخدم',
    'users-manage-dialog-activate': 'تفعيل المستخدم',
    'users-manage-dialog-delete': 'حذف المستخدم',
    'users-export-success': 'تم تصدير المستخدمين بنجاح!',
    'users-export-coming-soon': 'ميزة التصدير قادمة قريباً!',
    'users-delete-success': 'تم حذف المستخدم {email} بنجاح',
    'users-delete-error': 'فشل في حذف المستخدم',
    'users-status-success': 'تم {status} المستخدم {email} بنجاح',
    'users-status-error': 'فشل في تحديث حالة المستخدم',
    'users-cannot-delete-self': 'لا يمكنك حذف حسابك الخاص!',
    'users-id': 'المعرف: {id}',
  },
  'de': {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    // HOME PAGE - GERMAN
    'home-hero-title': 'Jerusalem entdecken',
    'home-hero-subtitle': 'Erleben Sie die reiche Geschichte und heilige Schönheit von Al-Quds durch unsere immersive virtuelle Reise',
    'home-guide-title': 'Alquds Virtueller Führer',
    'home-guide-quote': 'Inoys Führer zu den besten Sehenswürdigkeiten der Altstadt von Alquds',
    'home-guide-description-1': 'Die Altstadt von Alquds ist ein UNESCO-Weltkulturerbe, das in vier Viertel unterteilt ist — muslimisch, christlich, jüdisch und armenisch — jedes mit seinem eigenen einzigartigen Rhythmus, Wahrzeichen und Geschichten.',
    'home-guide-description-2': 'Die gesamte ummauerte Stadt ist nur etwa 1 km² groß, sodass Sie den größten Teil zu Fuß erkunden können.',
    'home-start-button': 'Erkundung beginnen',

    // HEADER - GERMAN
    'header-home': 'Startseite',
    'header-cart': 'Mein Warenkorb',
    'header-profile': 'Profil',
    'header-search-placeholder': 'Suchen',
    'header-language': 'Sprache wählen',

    // GENERAL BUTTONS - GERMAN
    'button-save': 'Speichern',
    'button-cancel': 'Abbrechen',
    'button-edit': 'Bearbeiten',
    'button-submit': 'Absenden',
    'button-close': 'Schließen',
    'button-back': 'Zurück',
    'button-next': 'Weiter',
    'button-search': 'Suchen',
    'button-loading': 'Wird geladen...',
  },
  'it': {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    // HOME PAGE - ITALIAN
    'home-hero-title': 'Scopri Gerusalemme',
    'home-hero-subtitle': 'Esplora la ricca storia e la bellezza sacra di Al-Quds attraverso il nostro viaggio virtuale immersivo',
    'home-badge-routes': '10 Percorsi Sacri',
    'home-badge-map': 'Mappa Interattiva',
    'home-badge-history': 'Storia Ricca',
    'home-guide-title': 'Guida Virtuale di Alquds',
    'home-guide-quote': 'La Guida di Inoy alle Migliori Attrazioni della Città Vecchia di Alquds',
    'home-guide-description-1': 'La Città Vecchia di Alquds è un sito del Patrimonio Mondiale UNESCO diviso in quattro quartieri — Musulmano, Cristiano, Ebraico e Armeno — ognuno con il suo ritmo unico, punti di riferimento e storie.',
    'home-guide-description-2': 'L\'intera città murata è solo di circa 1 km², quindi puoi esplorare gran parte di essa a piedi.',
    'home-video-title': 'Guarda la Nostra Storia',
    'home-video-subtitle': 'Scopri la bellezza e la storia di Gerusalemme attraverso la nostra esperienza video immersiva',
    'home-routes-title': 'Esplora la Gerusalemme Sacra',
    'home-map-title': 'Mappa Interattiva',
    'home-map-subtitle': 'Esplora i percorsi sacri e i punti di riferimento di Gerusalemme con la nostra mappa interattiva',
    'home-map-location': 'Città Vecchia di Gerusalemme',
    'home-cta-title': 'Pronto a Iniziare il Tuo Viaggio?',
    'home-cta-subtitle': 'Scopri le antiche strade, i siti sacri e il ricco patrimonio culturale che rendono Gerusalemme una delle città più affascinanti del mondo.',
    'home-cta-button': 'Esplora Ora',
    'home-start-button': 'Inizia a Esplorare',

    // HEADER
    'header-home': 'Casa',
    'header-cart': 'Il Mio Carrello',
    'header-profile': 'Profilo',
    'header-search-placeholder': 'Cerca',
    'header-language': 'Seleziona Lingua',

    // GENERAL BUTTONS
    'button-save': 'Salva',
    'button-cancel': 'Annulla',
    'button-delete': 'Elimina',
    'button-edit': 'Modifica',
    'button-add': 'Aggiungi',
    'button-submit': 'Invia',
    'button-close': 'Chiudi',
    'button-back': 'Indietro',
    'button-next': 'Avanti',
    'button-search': 'Cerca',
    'button-loading': 'Caricamento...',
  },
  'es': {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    // HOME PAGE - SPANISH
    'home-hero-title': 'Descubre Jerusalén',
    'home-hero-subtitle': 'Explora la rica historia y belleza sagrada de Al-Quds a través de nuestro viaje virtual inmersivo',
    'home-badge-routes': '10 Rutas Sagradas',
    'home-badge-map': 'Mapa Interactivo',
    'home-badge-history': 'Historia Rica',
    'home-guide-title': 'Guía Virtual de Alquds',
    'home-guide-quote': 'La Guía de Inoy a los Mejores Lugares de la Ciudad Vieja de Alquds',
    'home-guide-description-1': 'La Ciudad Vieja de Alquds es un sitio del Patrimonio Mundial de la UNESCO dividido en cuatro barrios — Musulmán, Cristiano, Judío y Armenio — cada uno con su propio ritmo único, puntos de referencia e historias.',
    'home-guide-description-2': 'Toda la ciudad amurallada es solo de aproximadamente 1 km², por lo que puedes explorar gran parte de ella a pie.',
    'home-video-title': 'Mira Nuestra Historia',
    'home-video-subtitle': 'Descubre la belleza y la historia de Jerusalén a través de nuestra experiencia de video inmersiva',
    'home-routes-title': 'Explora la Jerusalén Sagrada',
    'home-map-title': 'Mapa Interactivo',
    'home-map-subtitle': 'Explora las rutas sagradas y puntos de referencia de Jerusalén con nuestro mapa interactivo',
    'home-map-location': 'Ciudad Vieja de Jerusalén',
    'home-cta-title': '¿Listo para Comenzar Tu Viaje?',
    'home-cta-subtitle': 'Descubre las calles antiguas, los sitios sagrados y el rico patrimonio cultural que hacen de Jerusalén una de las ciudades más fascinantes del mundo.',
    'home-cta-button': 'Explorar Ahora',
    'home-start-button': 'Comenzar a Explorar',

    // HEADER
    'header-home': 'Inicio',
    'header-cart': 'Mi Carrito',
    'header-profile': 'Perfil',
    'header-search-placeholder': 'Buscar',
    'header-language': 'Seleccionar Idioma',

    // GENERAL BUTTONS
    'button-save': 'Guardar',
    'button-cancel': 'Cancelar',
    'button-delete': 'Eliminar',
    'button-edit': 'Editar',
    'button-add': 'Agregar',
    'button-submit': 'Enviar',
    'button-close': 'Cerrar',
    'button-back': 'Atrás',
    'button-next': 'Siguiente',
    'button-search': 'Buscar',
    'button-loading': 'Cargando...',
  },
  'ir': {
    code: 'ir',
    name: 'فارسی',
    flag: '🇮🇷',
    // HOME PAGE - PERSIAN
    'home-hero-title': 'اورشلیم را کشف کنید',
    'home-hero-subtitle': 'تاریخ غنی و زیبایی مقدس قدس را از طریق سفر مجازی غوطه‌ور ما تجربه کنید',
    'home-badge-routes': '10 مسیر مقدس',
    'home-badge-map': 'نقشه تعاملی',
    'home-badge-history': 'تاریخ غنی',
    'home-guide-title': 'راهنمای مجازی قدس',
    'home-guide-quote': 'راهنمای اینوی به بهترین جاذبه‌های شهر قدیمی قدس',
    'home-guide-description-1': 'شهر قدیمی قدس یک سایت میراث جهانی یونسکو است که به چهار محله تقسیم شده است — مسلمان، مسیحی، یهودی و ارمنی — هر کدام با ریتم، نشانه‌ها و داستان‌های منحصر به فرد خود.',
    'home-guide-description-2': 'کل شهر محصور شده فقط حدود 1 کیلومتر مربع است، بنابراین می‌توانید بیشتر آن را پیاده کاوش کنید.',
    'home-video-title': 'داستان ما را تماشا کنید',
    'home-video-subtitle': 'زیبایی و تاریخ اورشلیم را از طریق تجربه ویدیویی غوطه‌ور ما کشف کنید',
    'home-routes-title': 'اورشلیم مقدس را کاوش کنید',
    'home-map-title': 'نقشه تعاملی',
    'home-map-subtitle': 'مسیرهای مقدس و نشانه‌های اورشلیم را با نقشه تعاملی ما کاوش کنید',
    'home-map-location': 'شهر قدیمی اورشلیم',
    'home-cta-title': 'آماده شروع سفر خود هستید؟',
    'home-cta-subtitle': 'خیابان‌های باستانی، مکان‌های مقدس و میراث فرهنگی غنی که اورشلیم را به یکی از جذاب‌ترین شهرهای جهان تبدیل می‌کند را کشف کنید.',
    'home-cta-button': 'اکنون کاوش کنید',
    'home-start-button': 'شروع کاوش',

    // HEADER
    'header-home': 'خانه',
    'header-cart': 'سبد خرید من',
    'header-profile': 'پروفایل',
    'header-search-placeholder': 'جستجو',
    'header-language': 'انتخاب زبان',

    // GENERAL BUTTONS
    'button-save': 'ذخیره',
    'button-cancel': 'لغو',
    'button-delete': 'حذف',
    'button-edit': 'ویرایش',
    'button-add': 'افزودن',
    'button-submit': 'ارسال',
    'button-close': 'بستن',
    'button-back': 'بازگشت',
    'button-next': 'بعدی',
    'button-search': 'جستجو',
    'button-loading': 'در حال بارگذاری...',
  },
  'pk': {
    code: 'pk',
    name: 'اردو',
    flag: '🇵🇰',
    // HOME PAGE - URDU
    'home-hero-title': 'یروشلم دریافت کریں',
    'home-hero-subtitle': 'ہماری غوطہ خور مجازی سفر کے ذریعے القدس کی امیر تاریخ اور مقدس خوبصورتی کا تجربہ کریں',
    'home-badge-routes': '10 مقدس راستے',
    'home-badge-map': 'انٹرایکٹو نقشہ',
    'home-badge-history': 'امیر تاریخ',
    'home-guide-title': 'القدس ورچوئل گائیڈ',
    'home-guide-quote': 'القدس کے پرانے شہر کے بہترین مقامات کے لیے انوی کی گائیڈ',
    'home-guide-description-1': 'القدس کا پرانا شہر یونیسکو کی عالمی ورثہ کی سائٹ ہے جو چار کوارٹرز میں تقسیم ہے — مسلم، عیسائی، یہودی اور آرمینیائی — ہر ایک کا اپنا منفرد تال، نشانیاں اور کہانیاں ہیں۔',
    'home-guide-description-2': 'پورا دیوار والا شہر صرف تقریباً 1 کلومیٹر مربع ہے، اس لیے آپ اس کا زیادہ تر حصہ پیدل دریافت کر سکتے ہیں۔',
    'home-video-title': 'ہماری کہانی دیکھیں',
    'home-video-subtitle': 'ہمارے غوطہ خور ویڈیو تجربے کے ذریعے یروشلم کی خوبصورتی اور تاریخ دریافت کریں',
    'home-routes-title': 'مقدس یروشلم دریافت کریں',
    'home-map-title': 'انٹرایکٹو نقشہ',
    'home-map-subtitle': 'ہمارے انٹرایکٹو نقشے کے ساتھ یروشلم کے مقدس راستوں اور نشانیوں کو دریافت کریں',
    'home-map-location': 'یروشلم کا پرانا شہر',
    'home-cta-title': 'اپنا سفر شروع کرنے کے لیے تیار ہیں؟',
    'home-cta-subtitle': 'قدیم گلیوں، مقدس مقامات اور امیر ثقافتی ورثہ دریافت کریں جو یروشلم کو دنیا کے سب سے دلچسپ شہروں میں سے ایک بناتا ہے۔',
    'home-cta-button': 'ابھی دریافت کریں',
    'home-start-button': 'دریافت شروع کریں',

    // HEADER
    'header-home': 'ہوم',
    'header-cart': 'میری ٹوکری',
    'header-profile': 'پروفائل',
    'header-search-placeholder': 'تلاش',
    'header-language': 'زبان منتخب کریں',

    // GENERAL BUTTONS
    'button-save': 'محفوظ',
    'button-cancel': 'منسوخ',
    'button-delete': 'حذف',
    'button-edit': 'ترمیم',
    'button-add': 'شامل',
    'button-submit': 'جمع',
    'button-close': 'بند',
    'button-back': 'واپس',
    'button-next': 'اگلا',
    'button-search': 'تلاش',
    'button-loading': 'لوڈ ہو رہا ہے...',
  },
  'tr': {
    code: 'tr',
    name: 'Türkçe',
    flag: '🇹🇷',
    // HOME PAGE - TURKISH
    'home-hero-title': 'Kudüs\'ü Keşfedin',
    'home-hero-subtitle': 'Sürükleyici sanal yolculuğumuz aracılığıyla El-Kuds\'ün zengin tarihini ve kutsal güzelliğini deneyimleyin',
    'home-badge-routes': '10 Kutsal Rota',
    'home-badge-map': 'İnteraktif Harita',
    'home-badge-history': 'Zengin Tarih',
    'home-guide-title': 'El-Kuds Sanal Rehberi',
    'home-guide-quote': 'El-Kuds Eski Şehri\'nin En İyi Yerlerine İnoy\'un Rehberi',
    'home-guide-description-1': 'El-Kuds Eski Şehri, dört mahalleye bölünmüş bir UNESCO Dünya Mirası alanıdır — Müslüman, Hıristiyan, Yahudi ve Ermeni — her biri kendi benzersiz ritmi, simgeleri ve hikayeleri ile.',
    'home-guide-description-2': 'Tüm surlu şehir sadece yaklaşık 1 km²\'dir, bu yüzden çoğunu yürüyerek keşfedebilirsiniz.',
    'home-video-title': 'Hikayemizi İzleyin',
    'home-video-subtitle': 'Sürükleyici video deneyimimiz aracılığıyla Kudüs\'ün güzelliğini ve tarihini keşfedin',
    'home-routes-title': 'Kutsal Kudüs\'ü Keşfedin',
    'home-map-title': 'İnteraktif Harita',
    'home-map-subtitle': 'İnteraktif haritamızla Kudüs\'ün kutsal rotalarını ve simgelerini keşfedin',
    'home-map-location': 'Kudüs Eski Şehri',
    'home-cta-title': 'Yolculuğunuza Başlamaya Hazır mısınız?',
    'home-cta-subtitle': 'Kudüs\'ü dünyanın en büyüleyici şehirlerinden biri yapan antik sokakları, kutsal yerleri ve zengin kültürel mirası keşfedin.',
    'home-cta-button': 'Şimdi Keşfedin',
    'home-start-button': 'Keşfetmeye Başlayın',

    // HEADER
    'header-home': 'Ana Sayfa',
    'header-cart': 'Sepetim',
    'header-profile': 'Profil',
    'header-search-placeholder': 'Ara',
    'header-language': 'Dil Seçin',

    // GENERAL BUTTONS
    'button-save': 'Kaydet',
    'button-cancel': 'İptal',
    'button-delete': 'Sil',
    'button-edit': 'Düzenle',
    'button-add': 'Ekle',
    'button-submit': 'Gönder',
    'button-close': 'Kapat',
    'button-back': 'Geri',
    'button-next': 'İleri',
    'button-search': 'Ara',
    'button-loading': 'Yükleniyor...',
  },
  'id': {
    code: 'id',
    name: 'Bahasa Indonesia',
    flag: '🇮🇩',
    // HOME PAGE - INDONESIAN
    'home-hero-title': 'Temukan Yerusalem',
    'home-hero-subtitle': 'Jelajahi sejarah kaya dan keindahan suci Al-Quds melalui perjalanan virtual imersif kami',
    'home-badge-routes': '10 Rute Suci',
    'home-badge-map': 'Peta Interaktif',
    'home-badge-history': 'Sejarah Kaya',
    'home-guide-title': 'Panduan Virtual Alquds',
    'home-guide-quote': 'Panduan Inoy untuk Tempat Terbaik di Kota Tua Alquds',
    'home-guide-description-1': 'Kota Tua Alquds adalah situs Warisan Dunia UNESCO yang dibagi menjadi empat wilayah — Muslim, Kristen, Yahudi, dan Armenia — masing-masing dengan ritme, landmark, dan cerita uniknya sendiri.',
    'home-guide-description-2': 'Seluruh kota bertembok hanya sekitar 1 km², jadi Anda dapat menjelajahi sebagian besarnya dengan berjalan kaki.',
    'home-video-title': 'Tonton Cerita Kami',
    'home-video-subtitle': 'Temukan keindahan dan sejarah Yerusalem melalui pengalaman video imersif kami',
    'home-routes-title': 'Jelajahi Yerusalem Suci',
    'home-map-title': 'Peta Interaktif',
    'home-map-subtitle': 'Jelajahi rute suci dan landmark Yerusalem dengan peta interaktif kami',
    'home-map-location': 'Kota Tua Yerusalem',
    'home-cta-title': 'Siap Memulai Perjalanan Anda?',
    'home-cta-subtitle': 'Temukan jalan-jalan kuno, situs suci, dan warisan budaya kaya yang menjadikan Yerusalem salah satu kota paling menarik di dunia.',
    'home-cta-button': 'Jelajahi Sekarang',
    'home-start-button': 'Mulai Menjelajahi',

    // HEADER
    'header-home': 'Beranda',
    'header-cart': 'Keranjang Saya',
    'header-profile': 'Profil',
    'header-search-placeholder': 'Cari',
    'header-language': 'Pilih Bahasa',

    // GENERAL BUTTONS
    'button-save': 'Simpan',
    'button-cancel': 'Batal',
    'button-delete': 'Hapus',
    'button-edit': 'Edit',
    'button-add': 'Tambah',
    'button-submit': 'Kirim',
    'button-close': 'Tutup',
    'button-back': 'Kembali',
    'button-next': 'Selanjutnya',
    'button-search': 'Cari',
    'button-loading': 'Memuat...',
  },
  'ru': {
    code: 'ru',
    name: 'Русский',
    flag: '🇷🇺',
    // HOME PAGE - RUSSIAN
    'home-hero-title': 'Откройте Иерусалим',
    'home-hero-subtitle': 'Исследуйте богатую историю и священную красоту Аль-Кудса через наше погружающее виртуальное путешествие',
    'home-badge-routes': '10 Священных Маршрутов',
    'home-badge-map': 'Интерактивная Карта',
    'home-badge-history': 'Богатая История',
    'home-guide-title': 'Виртуальный Гид Аль-Кудса',
    'home-guide-quote': 'Путеводитель Иноя по лучшим достопримечательностям Старого города Аль-Кудса',
    'home-guide-description-1': 'Старый город Аль-Кудса — это объект Всемирного наследия ЮНЕСКО, разделенный на четыре квартала — мусульманский, христианский, еврейский и армянский — каждый со своим уникальным ритмом, достопримечательностями и историями.',
    'home-guide-description-2': 'Весь обнесенный стеной город занимает всего около 1 км², поэтому большую его часть можно исследовать пешком.',
    'home-video-title': 'Посмотрите Нашу Историю',
    'home-video-subtitle': 'Откройте красоту и историю Иерусалима через наш погружающий видео-опыт',
    'home-routes-title': 'Исследуйте Священный Иерусалим',
    'home-map-title': 'Интерактивная Карта',
    'home-map-subtitle': 'Исследуйте священные маршруты и достопримечательности Иерусалима с нашей интерактивной картой',
    'home-map-location': 'Старый город Иерусалима',
    'home-cta-title': 'Готовы Начать Свое Путешествие?',
    'home-cta-subtitle': 'Откройте древние улицы, священные места и богатое культурное наследие, которые делают Иерусалим одним из самых увлекательных городов мира.',
    'home-cta-button': 'Исследовать Сейчас',
    'home-start-button': 'Начать Исследование',

    // HEADER
    'header-home': 'Главная',
    'header-cart': 'Моя Корзина',
    'header-profile': 'Профиль',
    'header-search-placeholder': 'Поиск',
    'header-language': 'Выбрать Язык',

    // GENERAL BUTTONS
    'button-save': 'Сохранить',
    'button-cancel': 'Отмена',
    'button-delete': 'Удалить',
    'button-edit': 'Редактировать',
    'button-add': 'Добавить',
    'button-submit': 'Отправить',
    'button-close': 'Закрыть',
    'button-back': 'Назад',
    'button-next': 'Далее',
    'button-search': 'Поиск',
    'button-loading': 'Загрузка...',
  },
  'in': {
    code: 'in',
    name: 'हिन्दी',
    flag: '🇮🇳',
    // HOME PAGE - HINDI
    'home-hero-title': 'यरुशलम की खोज करें',
    'home-hero-subtitle': 'हमारी डूबने वाली आभासी यात्रा के माध्यम से अल-कुद्स के समृद्ध इतिहास और पवित्र सुंदरता का अनुभव करें',
    'home-badge-routes': '10 पवित्र मार्ग',
    'home-badge-map': 'इंटरैक्टिव मानचित्र',
    'home-badge-history': 'समृद्ध इतिहास',
    'home-guide-title': 'अल-कुद्स वर्चुअल गाइड',
    'home-guide-quote': 'अल-कुद्स के पुराने शहर के सर्वोत्तम स्थलों के लिए इनोय की गाइड',
    'home-guide-description-1': 'अल-कुद्स का पुराना शहर एक यूनेस्को विश्व धरोहर स्थल है जो चार क्वार्टरों में विभाजित है — मुस्लिम, ईसाई, यहूदी और आर्मेनियाई — प्रत्येक का अपना अनूठा ताल, स्थलचिह्न और कहानियां हैं।',
    'home-guide-description-2': 'पूरा दीवार वाला शहर केवल लगभग 1 किमी² है, इसलिए आप इसका अधिकांश हिस्सा पैदल चलकर खोज सकते हैं।',
    'home-video-title': 'हमारी कहानी देखें',
    'home-video-subtitle': 'हमारे डूबने वाले वीडियो अनुभव के माध्यम से यरुशलम की सुंदरता और इतिहास की खोज करें',
    'home-routes-title': 'पवित्र यरुशलम की खोज करें',
    'home-map-title': 'इंटरैक्टिव मानचित्र',
    'home-map-subtitle': 'हमारे इंटरैक्टिव मानचित्र के साथ यरुशलम के पवित्र मार्गों और स्थलचिह्नों की खोज करें',
    'home-map-location': 'यरुशलम का पुराना शहर',
    'home-cta-title': 'अपनी यात्रा शुरू करने के लिए तैयार हैं?',
    'home-cta-subtitle': 'प्राचीन सड़कों, पवित्र स्थलों और समृद्ध सांस्कृतिक विरासत की खोज करें जो यरुशलम को दुनिया के सबसे आकर्षक शहरों में से एक बनाती है।',
    'home-cta-button': 'अभी खोजें',
    'home-start-button': 'खोजना शुरू करें',

    // HEADER
    'header-home': 'होम',
    'header-cart': 'मेरी टोकरी',
    'header-profile': 'प्रोफ़ाइल',
    'header-search-placeholder': 'खोजें',
    'header-language': 'भाषा चुनें',

    // GENERAL BUTTONS
    'button-save': 'सहेजें',
    'button-cancel': 'रद्द करें',
    'button-delete': 'हटाएं',
    'button-edit': 'संपादित करें',
    'button-add': 'जोड़ें',
    'button-submit': 'भेजें',
    'button-close': 'बंद करें',
    'button-back': 'वापस',
    'button-next': 'आगे',
    'button-search': 'खोजें',
    'button-loading': 'लोड हो रहा है...',
  }
  // Add more languages as needed
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  const [translations, setTranslations] = useState(languageData['tr']);
  const [isClient, setIsClient] = useState(false);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load language from localStorage and fetch from database on mount
  useEffect(() => {
    if (!isClient) return;
    
    const loadTranslations = async () => {
      const savedLanguage = localStorage.getItem('selectedLanguage') || 'tr';
      
      try {
        // Try to fetch translations from the database
        const response = await axios.get(`/api/translations/${savedLanguage}`);
        
        if (response.data.success && response.data.translations) {
          setCurrentLanguage(savedLanguage);
          setTranslations(response.data.translations);
          console.log('✓ Loaded translations from database for:', savedLanguage);
        } else {
          // Fallback to default translations
          setCurrentLanguage(savedLanguage);
          setTranslations(languageData[savedLanguage] || languageData['tr']);
          console.log('Using default translations for:', savedLanguage);
        }
      } catch (error) {
        console.log('No database translations found, using defaults');
        // Fallback to default translations if API fails
        setCurrentLanguage(savedLanguage);
        setTranslations(languageData[savedLanguage] || languageData['tr']);
      }
    };
    
    loadTranslations();
  }, [isClient]);

  // Function to change language
  const changeLanguage = async (languageCode) => {
    if (!isClient) return;
    
    try {
      // Try to fetch translations from database
      const response = await axios.get(`/api/translations/${languageCode}`);
      
      if (response.data.success && response.data.translations) {
        setCurrentLanguage(languageCode);
        setTranslations(response.data.translations);
        localStorage.setItem('selectedLanguage', languageCode);
        console.log('✓ Loaded translations from database for:', languageCode);
      } else {
        // Fallback to default translations
        const language = languageData[languageCode];
        if (language) {
          setCurrentLanguage(languageCode);
          setTranslations(language);
          localStorage.setItem('selectedLanguage', languageCode);
        }
      }
    } catch (error) {
      console.log('Using default translations for:', languageCode);
      // Fallback to default translations if API fails
      const language = languageData[languageCode];
      if (language) {
        setCurrentLanguage(languageCode);
        setTranslations(language);
        localStorage.setItem('selectedLanguage', languageCode);
      }
    }
  };

  // Function to update translations (for content management)
  const updateTranslations = async (languageCode, newTranslations) => {
    if (!isClient) return { success: false, message: 'Not available during SSR' };
    
    try {
      // Save translations to database
      const response = await axios.put(`/api/translations/${languageCode}`, {
        translations: newTranslations
      });
      
      if (response.data.success) {
        console.log('✓ Translations saved to database for:', languageCode);
        
        // If updating current language, apply changes immediately
        if (languageCode === currentLanguage) {
          setTranslations(newTranslations);
        }
        
        return { success: true, message: 'Translations saved successfully to database' };
      }
    } catch (error) {
      console.error('Error saving translations to database:', error);
      
      // Fallback: save to localStorage
      localStorage.setItem(`custom_translations_${languageCode}`, JSON.stringify(newTranslations));
      
      // If updating current language, apply changes immediately
      if (languageCode === currentLanguage) {
        setTranslations(newTranslations);
      }
      
      return { success: false, message: 'Saved locally only. Database update failed.' };
    }
  };

  // Function to get translation
  const t = (key) => {
    // During SSR, always return the key to avoid hydration mismatch
    if (!isClient) {
      return key;
    }
    return translations[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    updateTranslations,
    t,
    translations,
    languageData
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
