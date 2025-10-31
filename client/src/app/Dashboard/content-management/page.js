"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePageReady } from '../../hooks/usePageReady';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import axios from '../../utils/axios';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Grid, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Chip,
  Paper,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import { 
  Save, 
  Edit, 
  Language, 
  ExpandMore, 
  Home, 
  Person, 
  ShoppingCart, 
  Login, 
  PersonAdd, 
  Lock, 
  Dashboard,
  Analytics,
  Security,
  Assessment,
  Search,
  Email,
  Password,
  Verified,
  ArrowBack
} from '@mui/icons-material';

  // Comprehensive text content for ALL pages and ALL text elements
  const defaultTexts = {
    'gb': {
      // HOME PAGE (18 texts)
      'home-hero-title': 'Discover Jerusalem',
      'home-hero-subtitle': 'Experience the rich history and sacred beauty of Al-Quds through our immersive virtual journey',
      'home-badge-routes': '10 Sacred Routes',
      'home-badge-map': 'Interactive Map',
      'home-badge-history': 'Rich History',
      'home-start-button': 'Start Exploring',
      'home-video-title': 'Watch Our Story',
      'home-video-subtitle': 'Discover the beauty and history of Jerusalem through our immersive video experience',
      'home-guide-quote': 'Inoy\'s Guide to the Best Sights in Alquds Old City',
      'home-guide-description-1': 'The Old City of Alquds is a UNESCO World Heritage site divided into four quarters — Muslim, Christian, Jewish, and Armenian — each with its own unique rhythm, landmarks, and stories.',
      'home-guide-description-2': 'The entire walled city is only about 1 km², so you can explore much of it on foot.',
      'home-routes-title': 'Explore Sacred Jerusalem',
      'home-map-title': 'Interactive Map',
      'home-map-subtitle': 'Explore the sacred routes and landmarks of Jerusalem with our interactive map',
      'home-map-location': 'Jerusalem Old City',
      'home-cta-title': 'Ready to Begin Your Journey?',
      'home-cta-subtitle': 'Discover the ancient streets, sacred sites, and rich cultural heritage that make Jerusalem one of the world\'s most fascinating cities.',
      'home-cta-button': 'Explore Now',

      // HEADER (9 texts)
      'header-home': 'Home',
      'header-language': 'Select Language',
      'header-profile': 'Profile',
      'header-create-account': 'Create Account',
      'header-signin': 'Sign In',
      'header-dashboard': 'Dashboard',
      'header-search-placeholder': 'Search',
      'header-about-us': 'About Us',
      'header-contact-us': 'Contact Us',
      'header-sign-out': 'Sign Out',

      // SIGN IN PAGE
      'signin-title': 'Sign In',
      'signin-email-label': 'Email',
      'signin-password-label': 'Password',
      'signin-forgot-password': 'Forgot Password?',
      'signin-button': 'Sign In',
      'signin-no-account': 'Don\'t have an account?',
      'signin-create-account': 'Create Account',

      // DASHBOARD
      'dashboard-loading': 'Loading Dashboard',
      'dashboard-edit-profile': 'Edit Profile',
      'dashboard-title': 'Dashboard',
      'dashboard-redirecting': 'Redirecting',
      'dashboard-wait-message': 'Please wait while we prepare your dashboard...',
      'dashboard-signin-redirect': 'Taking you to the sign in page...',
      'dashboard-user-fallback': 'User',
      'dashboard-total-visitors': 'Total Visitors',
      'dashboard-registered-users': 'Registered Users',
      'dashboard-page-views': 'Page Views',
      'dashboard-conversion-rate': 'Conversion Rate',
      'dashboard-email-label': 'Email',
      'dashboard-change-password': 'Change Password (Optional)',
      'dashboard-set-password': 'Set Password (Optional)',
      'dashboard-password-help-change': 'Leave these fields empty if you don\'t want to change your password',
      'dashboard-password-help-set': 'You signed in with social media. You can optionally set a password to enable email/password login',
      'dashboard-current-password-label': 'Current Password',
      'dashboard-current-password-help': 'Enter your current password',
      'dashboard-new-password-label': 'New Password',
      'dashboard-new-password-help': 'Minimum 6 characters',
      'dashboard-confirm-password-label': 'Confirm New Password',
      'dashboard-confirm-password-help': 'Re-enter your new password to confirm',

      // ANALYTICS PAGE (12 texts)
      'analytics-title': 'Analytics',
      'analytics-subtitle': 'Detailed website performance metrics',
      'analytics-no-data-title': 'No Analytics Data Available',
      'analytics-no-data-message': 'Analytics tracking is active, but no data has been collected yet.',
      'analytics-page-views': 'Page Views',
      'analytics-unique-visitors': 'Unique Visitors',
      'analytics-bounce-rate': 'Bounce Rate',
      'analytics-avg-session': 'Avg Session',
      'analytics-top-pages': 'Top Pages',
      'analytics-traffic-sources': 'Traffic Sources',
      'analytics-no-data-yet': 'No data yet.',
      'analytics-total-views': 'Total views',
      'analytics-individual-users': 'Individual users',
      'analytics-single-page-visits': 'Single page visits',
      'analytics-session-duration': 'Session duration',

      // USERS PAGE (6 texts)
      'users-user': 'User',
      'users-role': 'Role',
      'users-status': 'Status',
      'users-joined': 'Joined',
      'users-last-login': 'Last Login',
      'users-actions': 'Actions',

      // VERIFY EMAIL PAGE (1 text)
      'verify-email-click-link': 'Click the link in the email to verify your account',

      // DASHBOARD NAVIGATION (4 texts)
      'dashboard-nav-analytics': 'Analytics',
      'dashboard-nav-users': 'Users',
      'dashboard-nav-content-management': 'Content Management',
      'dashboard-nav-image-links': 'Image Links',

      // ANALYTICS PAGE LOADING (4 texts)
      'analytics-loading': 'Loading Analytics',
      'analytics-loading-message': 'Please wait while we load your analytics data...',
      'analytics-redirecting': 'Redirecting',
      'analytics-redirect-message': 'Taking you to the sign in page...',

      // USERS PAGE LOADING (4 texts)
      'users-loading': 'Loading Users',
      'users-loading-message': 'Please wait while we load user data...',
      'users-redirecting': 'Redirecting',
      'users-redirect-message': 'Taking you to the sign in page...',

      // USERS PAGE ACTIONS (6 texts)
      'users-export-success': 'Users exported successfully!',
      'users-export-coming-soon': 'Export feature coming soon!',
      'users-cannot-delete-self': 'You cannot delete your own account!',
      'users-delete-failed': 'Failed to delete user',
      'users-update-failed': 'Failed to update user status',
      'users-search-placeholder': 'Search users by email or role...',

      // USERS PAGE MESSAGES (3 texts)
      'users-no-search-results': 'No users found matching your search.',
      'users-no-users-yet': 'No users registered yet. Create an account to see users here!',
      'users-activate-deactivate': 'Activate User',

      // VERIFY EMAIL PAGE (5 texts)
      'verify-email-click-link': 'Click the link in the email to verify your account',
      'verify-email-not-found': 'Email address not found. Please go back and try again.',
      'verify-email-resend-failed': 'Failed to resend email. Please try again.',
      'verify-email-sending': 'Sending...',
      'verify-email-resend-button': 'Resend Email',

      // CONTENT MANAGEMENT PAGE (7 texts)
      'content-management-select-language': 'Select Language',
      'content-management-language': 'Language',
      'content-management-text-content': 'Text Content',
      'content-management-button-text': 'Button Text',
      'content-management-input-placeholder': 'Input Placeholder',
      'content-management-contains-variables': 'Contains Variables',

      // CREATE ACCOUNT PAGE (2 texts)
      'create-account-title': 'Create Account',
      'create-account-email-label': 'Email',

      // CREATE PASSWORD PAGE (3 texts)
      'create-password-title': 'Create Account',
      'create-password-password-label': 'Password',
      'create-password-confirm-label': 'Confirm Password',

      // FORGOT PASSWORD PAGE (3 texts)
      'forgot-password-check-email-title': 'Check Your Email',
      'forgot-password-title': 'Forgot Password',
      'forgot-password-email-label': 'Email',

      // RESET PASSWORD PAGE (6 texts)
      'reset-password-success-title': 'Password Reset Successful',
      'reset-password-invalid-link-title': 'Invalid Link',
      'reset-password-title': 'Reset Password',
      'reset-password-new-password-label': 'New Password',
      'reset-password-confirm-password-label': 'Confirm New Password',

      // PASSWORD EXPIRED PAGE (3 texts)
      'password-expired-current-label': 'Current Password',
      'password-expired-new-label': 'New Password',
      'password-expired-confirm-label': 'Confirm New Password',

      // IMAGE LINKS PAGE (2 texts)
      'image-links-linked-label': 'Linked',
      'image-links-url-label': 'Link URL',

      // HOME PAGE VIDEO (1 text)
      'home-video-title-alt': 'Jerusalem Virtual Guide Video',

      // CONTACT PAGE
      'contact-badge': 'Contact Us',
      'contact-hero-title-1': 'Let\'s Talk About',
      'contact-hero-title-2': 'Your Ideas',
      'contact-hero-subtitle': 'Have questions? We\'re here to help. Send us a message and we\'ll respond promptly.',
      'contact-form-title': 'Send a Message',
      'contact-form-subtitle': 'Fill out the form and we\'ll be in touch within 24 hours',
      'contact-success-title': 'Thank you for reaching out!',
      'contact-success-message': 'Your message has been sent successfully. We\'ll get back to you soon.',
      'contact-form-name-label': 'Your Name',
      'contact-form-email-label': 'Email Address',
      'contact-form-subject-label': 'Subject',
      'contact-form-message-label': 'Your Message',
      'contact-form-submit-button': 'Send Message',

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
      'about-value1-title': 'Innovation First',
      'about-value1-description': 'We embrace cutting-edge technology and creative problem-solving to deliver solutions that anticipate future needs.',
      'about-value2-title': 'Security & Trust',
      'about-value2-description': 'Your data security is our top priority. We implement industry-leading practices to protect your information.',
      'about-value3-title': 'People-Centered',
      'about-value3-description': 'Every feature is designed with real users in mind, ensuring intuitive and accessible experiences for everyone.',
      'about-value4-title': 'Growth Focused',
      'about-value4-description': 'We continuously evolve to support your journey, scaling alongside your ambitions and adapting to changing needs.',
      'about-stat1-value': '10K+',
      'about-stat1-label': 'Active Users',
      'about-stat2-value': '99.9%',
      'about-stat2-label': 'Uptime',
      'about-stat3-value': '24/7',
      'about-stat3-label': 'Support',
      'about-stat4-value': '150+',
      'about-stat4-label': 'Countries Served',
      'about-cta-title': 'Join Us on This Journey',
      'about-cta-subtitle': 'Be part of a community that values innovation, security, and excellence. Together, we\'re shaping the future of digital interactions.'
    },
    'sa': {
      // HOME PAGE - ARABIC (18 texts)
      'home-hero-title': 'اكتشف القدس',
      'home-hero-subtitle': 'استكشف التاريخ الغني والجمال المقدس للقدس من خلال رحلتنا الافتراضية الغامرة',
      'home-badge-routes': '10 مسارات مقدسة',
      'home-badge-map': 'خريطة تفاعلية',
      'home-badge-history': 'تاريخ غني',
      'home-start-button': 'ابدأ الاستكشاف',
      'home-video-title': 'شاهد قصتنا',
      'home-video-subtitle': 'اكتشف جمال وتاريخ القدس من خلال تجربتنا المرئية الغامرة',
      'home-guide-quote': 'دليل إينوي لأفضل المعالم في البلدة القديمة بالقدس',
      'home-guide-description-1': 'البلدة القديمة في القدس هي موقع تراث عالمي لليونسكو مقسم إلى أربعة أحياء - مسلم ومسيحي ويهودي وأرمني - لكل منها إيقاع ومعالم وقصص فريدة.',
      'home-guide-description-2': 'المدينة المسورة بأكملها لا تزيد عن 1 كيلومتر مربع، لذا يمكنك استكشاف الكثير منها سيراً على الأقدام.',
      'home-routes-title': 'استكشف القدس المقدسة',
      'home-map-title': 'خريطة تفاعلية',
      'home-map-subtitle': 'استكشف المسارات المقدسة ومعالم القدس مع خريطتنا التفاعلية',
      'home-map-location': 'البلدة القديمة في القدس',
      'home-cta-title': 'مستعد لبدء رحلتك؟',
      'home-cta-subtitle': 'اكتشف الشوارع القديمة والمواقع المقدسة والتراث الثقافي الغني الذي يجعل القدس واحدة من أكثر المدن إثارة للاهتمام في العالم.',
      'home-cta-button': 'استكشف الآن',

      // HEADER - ARABIC (9 texts)
      'header-home': 'الرئيسية',
      'header-language': 'اختر اللغة',
      'header-profile': 'الملف الشخصي',
      'header-create-account': 'إنشاء حساب',
      'header-signin': 'تسجيل الدخول',
      'header-dashboard': 'لوحة التحكم',
      'header-search-placeholder': 'بحث',
      'header-about-us': 'من نحن',
      'header-contact-us': 'اتصل بنا',
      'header-sign-out': 'تسجيل الخروج',

      // SIGN IN PAGE - ARABIC
      'signin-title': 'تسجيل الدخول',
      'signin-email-label': 'البريد الإلكتروني',
      'signin-password-label': 'كلمة المرور',
      'signin-forgot-password': 'نسيت كلمة المرور؟',
      'signin-button': 'تسجيل الدخول',
      'signin-no-account': 'ليس لديك حساب؟',
      'signin-create-account': 'إنشاء حساب',

      // DASHBOARD - ARABIC
      'dashboard-loading': 'جاري تحميل لوحة التحكم',
      'dashboard-edit-profile': 'تعديل الملف الشخصي',
      'dashboard-title': 'لوحة التحكم',
      'dashboard-redirecting': 'إعادة توجيه',
      'dashboard-wait-message': 'يرجى الانتظار بينما نجهز لوحة التحكم الخاصة بك...',
      'dashboard-signin-redirect': 'نأخذك إلى صفحة تسجيل الدخول...',
      'dashboard-user-fallback': 'مستخدم',
      'dashboard-total-visitors': 'إجمالي الزوار',
      'dashboard-registered-users': 'المستخدمون المسجلون',
      'dashboard-page-views': 'مشاهدات الصفحة',
      'dashboard-conversion-rate': 'معدل التحويل',
      'dashboard-email-label': 'البريد الإلكتروني',
      'dashboard-change-password': 'تغيير كلمة المرور (اختياري)',
      'dashboard-set-password': 'تعيين كلمة مرور (اختياري)',
      'dashboard-password-help-change': 'اترك هذه الحقول فارغة إذا كنت لا تريد تغيير كلمة المرور',
      'dashboard-password-help-set': 'لقد سجلت الدخول عبر وسائل التواصل الاجتماعي. يمكنك اختيارياً تعيين كلمة مرور لتمكين تسجيل الدخول بالبريد الإلكتروني/كلمة المرور',
      'dashboard-current-password-label': 'كلمة المرور الحالية',
      'dashboard-current-password-help': 'أدخل كلمة المرور الحالية',
      'dashboard-new-password-label': 'كلمة المرور الجديدة',
      'dashboard-new-password-help': '6 أحرف على الأقل',
      'dashboard-confirm-password-label': 'تأكيد كلمة المرور الجديدة',
      'dashboard-confirm-password-help': 'أعد إدخال كلمة المرور الجديدة للتأكيد',

      // ANALYTICS PAGE - ARABIC (12 texts)
      'analytics-title': 'التحليلات',
      'analytics-subtitle': 'مقاييس أداء الموقع التفصيلية',
      'analytics-no-data-title': 'لا توجد بيانات تحليلية متاحة',
      'analytics-no-data-message': 'تتبع التحليلات نشط، لكن لم يتم جمع أي بيانات بعد.',
      'analytics-page-views': 'مشاهدات الصفحة',
      'analytics-unique-visitors': 'زوار فريدون',
      'analytics-bounce-rate': 'معدل الارتداد',
      'analytics-avg-session': 'متوسط الجلسة',
      'analytics-top-pages': 'أهم الصفحات',
      'analytics-traffic-sources': 'مصادر الزيارات',
      'analytics-no-data-yet': 'لا توجد بيانات بعد.',
      'analytics-total-views': 'إجمالي المشاهدات',
      'analytics-individual-users': 'مستخدمون فرديون',
      'analytics-single-page-visits': 'زيارات صفحة واحدة',
      'analytics-session-duration': 'مدة الجلسة',

      // USERS PAGE - ARABIC (6 texts)
      'users-user': 'المستخدم',
      'users-role': 'الدور',
      'users-status': 'الحالة',
      'users-joined': 'انضم',
      'users-last-login': 'آخر تسجيل دخول',
      'users-actions': 'الإجراءات',

      // VERIFY EMAIL PAGE - ARABIC (5 texts)
      'verify-email-click-link': 'انقر على الرابط في البريد الإلكتروني للتحقق من حسابك',
      'verify-email-not-found': 'عنوان البريد الإلكتروني غير موجود. يرجى العودة والمحاولة مرة أخرى.',
      'verify-email-resend-failed': 'فشل في إعادة إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.',
      'verify-email-sending': 'جاري الإرسال...',
      'verify-email-resend-button': 'إعادة إرسال البريد الإلكتروني',

      // CONTENT MANAGEMENT PAGE - ARABIC (7 texts)
      'content-management-select-language': 'اختر اللغة',
      'content-management-language': 'اللغة',
      'content-management-text-content': 'محتوى النص',
      'content-management-button-text': 'نص الزر',
      'content-management-input-placeholder': 'نص العنصر النائب للإدخال',
      'content-management-contains-variables': 'يحتوي على متغيرات',

      // CREATE ACCOUNT PAGE - ARABIC (2 texts)
      'create-account-title': 'إنشاء حساب',
      'create-account-email-label': 'البريد الإلكتروني',

      // CREATE PASSWORD PAGE - ARABIC (3 texts)
      'create-password-title': 'إنشاء حساب',
      'create-password-password-label': 'كلمة المرور',
      'create-password-confirm-label': 'تأكيد كلمة المرور',

      // FORGOT PASSWORD PAGE - ARABIC (3 texts)
      'forgot-password-check-email-title': 'تحقق من بريدك الإلكتروني',
      'forgot-password-title': 'نسيت كلمة المرور',
      'forgot-password-email-label': 'البريد الإلكتروني',

      // RESET PASSWORD PAGE - ARABIC (6 texts)
      'reset-password-success-title': 'تم إعادة تعيين كلمة المرور بنجاح',
      'reset-password-invalid-link-title': 'رابط غير صالح',
      'reset-password-title': 'إعادة تعيين كلمة المرور',
      'reset-password-new-password-label': 'كلمة المرور الجديدة',
      'reset-password-confirm-password-label': 'تأكيد كلمة المرور الجديدة',

      // PASSWORD EXPIRED PAGE - ARABIC (3 texts)
      'password-expired-current-label': 'كلمة المرور الحالية',
      'password-expired-new-label': 'كلمة المرور الجديدة',
      'password-expired-confirm-label': 'تأكيد كلمة المرور الجديدة',

      // IMAGE LINKS PAGE - ARABIC (2 texts)
      'image-links-linked-label': 'مرتبط',
      'image-links-url-label': 'رابط URL',

      // HOME PAGE VIDEO - ARABIC (1 text)
      'home-video-title-alt': 'دليل القدس الافتراضي',

      // DASHBOARD NAVIGATION - ARABIC (4 texts)
      'dashboard-nav-analytics': 'التحليلات',
      'dashboard-nav-users': 'المستخدمون',
      'dashboard-nav-content-management': 'إدارة المحتوى',
      'dashboard-nav-image-links': 'روابط الصور',

      // ANALYTICS PAGE LOADING - ARABIC (4 texts)
      'analytics-loading': 'جاري تحميل التحليلات',
      'analytics-loading-message': 'يرجى الانتظار بينما نحمل بيانات التحليلات الخاصة بك...',
      'analytics-redirecting': 'إعادة توجيه',
      'analytics-redirect-message': 'نأخذك إلى صفحة تسجيل الدخول...',

      // USERS PAGE LOADING - ARABIC (4 texts)
      'users-loading': 'جاري تحميل المستخدمين',
      'users-loading-message': 'يرجى الانتظار بينما نحمل بيانات المستخدمين...',
      'users-redirecting': 'إعادة توجيه',
      'users-redirect-message': 'نأخذك إلى صفحة تسجيل الدخول...',

      // USERS PAGE ACTIONS - ARABIC (6 texts)
      'users-export-success': 'تم تصدير المستخدمين بنجاح!',
      'users-export-coming-soon': 'ميزة التصدير قادمة قريباً!',
      'users-cannot-delete-self': 'لا يمكنك حذف حسابك الخاص!',
      'users-delete-failed': 'فشل في حذف المستخدم',
      'users-update-failed': 'فشل في تحديث حالة المستخدم',
      'users-search-placeholder': 'البحث عن المستخدمين بالبريد الإلكتروني أو الدور...',

      // USERS PAGE MESSAGES - ARABIC (3 texts)
      'users-no-search-results': 'لم يتم العثور على مستخدمين يطابقون بحثك.',
      'users-no-users-yet': 'لا يوجد مستخدمون مسجلون بعد. أنشئ حساباً لرؤية المستخدمين هنا!',
      'users-activate-deactivate': 'تفعيل المستخدم',

      // VERIFY EMAIL PAGE - ARABIC (5 texts)
      'verify-email-click-link': 'انقر على الرابط في البريد الإلكتروني للتحقق من حسابك',
      'verify-email-not-found': 'عنوان البريد الإلكتروني غير موجود. يرجى العودة والمحاولة مرة أخرى.',
      'verify-email-resend-failed': 'فشل في إعادة إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.',
      'verify-email-sending': 'جاري الإرسال...',
      'verify-email-resend-button': 'إعادة إرسال البريد الإلكتروني',

      // CONTACT PAGE - ARABIC
      'contact-badge': 'اتصل بنا',
      'contact-hero-title-1': 'لنتحدث عن',
      'contact-hero-title-2': 'أفكارك',
      'contact-hero-subtitle': 'هل لديك أسئلة؟ نحن هنا للمساعدة. أرسل لنا رسالة وسنرد على الفور.',
      'contact-form-title': 'أرسل رسالة',
      'contact-form-subtitle': 'املأ النموذج وسنتواصل معك خلال 24 ساعة',
      'contact-success-title': 'شكرًا لتواصلك معنا!',
      'contact-success-message': 'تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.',
      'contact-form-name-label': 'اسمك',
      'contact-form-email-label': 'عنوان البريد الإلكتروني',
      'contact-form-subject-label': 'الموضوع',
      'contact-form-message-label': 'رسالتك',
      'contact-form-submit-button': 'إرسال الرسالة',

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
      'about-value1-title': 'الابتكار أولاً',
      'about-value1-description': 'نتبنى أحدث التقنيات وحلول المشكلات الإبداعية لتقديم حلول تتوقع الاحتياجات المستقبلية.',
      'about-value2-title': 'الأمان والثقة',
      'about-value2-description': 'أمان بياناتك هو أولويتنا القصوى. نطبق أفضل ممارسات الصناعة لحماية معلوماتك.',
      'about-value3-title': 'يركز على الناس',
      'about-value3-description': 'تم تصميم كل ميزة مع مراعاة المستخدمين الحقيقيين، مما يضمن تجارب بديهية ويمكن الوصول إليها للجميع.',
      'about-value4-title': 'التركيز على النمو',
      'about-value4-description': 'نتطور باستمرار لدعم رحلتك، والتوسع جنبًا إلى جنب مع طموحاتك والتكيف مع الاحتياجات المتغيرة.',
      'about-stat1-value': '10 آلاف+',
      'about-stat1-label': 'المستخدمون النشطون',
      'about-stat2-value': '99.9%',
      'about-stat2-label': 'وقت التشغيل',
      'about-stat3-value': '24/7',
      'about-stat3-label': 'الدعم',
      'about-stat4-value': '150+',
      'about-stat4-label': 'الدول المخدومة',
      'about-cta-title': 'انضم إلينا في هذه الرحلة',
      'about-cta-subtitle': 'كن جزءًا من مجتمع يقدر الابتكار والأمان والتميز. معًا، نحن نشكل مستقبل التفاعلات الرقمية.'
    }
    // Add more languages as needed
  };

const ContentManagement = () => {
  // Protect this route - redirect to sign in if not authenticated AND admin
  const { isChecking, isAuthenticated, isAdmin } = useProtectedRoute(true);
  const { updateTranslations, languageData } = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  const [editableTexts, setEditableTexts] = useState({});
  const [editingMode, setEditingMode] = useState(false);
  const [editedTexts, setEditedTexts] = useState({});
  const [currentPage, setCurrentPage] = useState('home');
  const [pageRendered, setPageRendered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [videoLinks, setVideoLinks] = useState({});
  const [editingVideoLink, setEditingVideoLink] = useState(null);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const languages = [
    { code: 'sa', name: 'العربية', flag: '🇸🇦', englishName: 'Arabic (Saudi Arabia)' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', englishName: 'German' },
    { code: 'gb', name: 'English', flag: '🇬🇧', englishName: 'English (UK)' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', englishName: 'Italian' },
    { code: 'es', name: 'Español', flag: '🇪🇸', englishName: 'Spanish' },
    { code: 'cn', name: '中文', flag: '🇨🇳', englishName: 'Chinese' },
    { code: 'my', name: 'Bahasa Melayu', flag: '🇲🇾', englishName: 'Malay' },
    { code: 'pk', name: 'اردو', flag: '🇵🇰', englishName: 'Urdu' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', englishName: 'Turkish' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', englishName: 'Indonesian' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', englishName: 'Russian' },
    { code: 'in', name: 'हिन्दी', flag: '🇮🇳', englishName: 'Hindi' }
  ];

  const pages = [
    { id: 'home', name: 'Home Page', icon: <Home />, description: 'Main landing page content' },
    { id: 'header', name: 'Header Navigation', icon: <ArrowBack />, description: 'Navigation and header elements' },
    { id: 'footer', name: 'Footer', icon: <ArrowBack />, description: 'Footer content and links' },
    { id: 'signin', name: 'Sign In Page', icon: <Login />, description: 'User authentication page' },
    { id: 'createaccount', name: 'Create Account', icon: <PersonAdd />, description: 'User registration page' },
    { id: 'createpassword', name: 'Create Password', icon: <Lock />, description: 'Password creation page' },
    { id: 'forgotpassword', name: 'Forgot Password', icon: <Lock />, description: 'Password recovery page' },
    { id: 'resetpassword', name: 'Reset Password', icon: <Lock />, description: 'Password reset page' },
    { id: 'verifyemail', name: 'Verify Email', icon: <Email />, description: 'Email verification page' },
    { id: 'dashboard', name: 'Dashboard', icon: <Dashboard />, description: 'User dashboard content' },
    { id: 'analytics', name: 'Analytics', icon: <Analytics />, description: 'Analytics dashboard' },
    { id: 'users', name: 'User Management', icon: <Person />, description: 'User management page' },
    { id: 'security', name: 'Security', icon: <Security />, description: 'Security settings page' },
    { id: 'reports', name: 'Reports', icon: <Assessment />, description: 'Reports page' },
    { id: 'about', name: 'About Page', icon: <Person />, description: 'About us page' },
    { id: 'contact', name: 'Contact Page', icon: <Email />, description: 'Contact us page' },
    { id: 'buttons', name: 'General Buttons', icon: <Edit />, description: 'Common button text and labels' },
    { id: 'forms', name: 'Form Elements', icon: <Edit />, description: 'Form labels and placeholders' },
    { id: 'video-links', name: 'Video Links', icon: <Edit />, description: 'YouTube video links for each language' }
  ];

  useEffect(() => {
    // Only load texts on client side
    if (!isClient) return;
    
    // Load texts for current language - check database first, then localStorage, then defaults
    const loadTexts = async () => {
      console.log('🔄 Loading texts for language:', currentLanguage, 'page:', currentPage);
      
      try {
        // Try to fetch from database
        const response = await axios.get(`/api/translations/${currentLanguage}`);
        
        console.log('📡 Database response status:', response.status);
        console.log('📡 Database response data:', response.data);
        
        if (response.data.success && response.data.translations) {
          // Merge defaults with DB so missing new keys still show up
          const defaults = defaultTexts[currentLanguage] || defaultTexts['gb'];
          const mergedFromDb = { ...defaults, ...response.data.translations };
          console.log('✓ Loaded translations from database, merged keys:', Object.keys(mergedFromDb));
          setEditableTexts(mergedFromDb);
          setEditedTexts(mergedFromDb);
          return;
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('No translations in database, using defaults');
        } else {
          console.log('Database error, using defaults');
        }
        console.log('Could not load from database, using defaults:', error);
      }
      
      // Fallback to localStorage
      const customTranslations = localStorage.getItem(`custom_translations_${currentLanguage}`);
      console.log('💾 localStorage translations:', customTranslations ? 'found' : 'not found');
      
      let texts;
      if (customTranslations) {
        try {
          const parsed = JSON.parse(customTranslations);
          const defaults = defaultTexts[currentLanguage] || defaultTexts['gb'];
          // Merge defaults with local storage so new keys appear
          texts = { ...defaults, ...parsed };
          console.log('✓ Loaded translations from localStorage, merged keys:', Object.keys(texts));
        } catch (error) {
          console.error('Error loading custom translations:', error);
          texts = defaultTexts[currentLanguage] || defaultTexts['gb'];
        }
      } else {
        texts = defaultTexts[currentLanguage] || defaultTexts['gb'];
        console.log('Using default translations, keys:', Object.keys(texts));
      }
      
      console.log('📝 Setting texts with keys:', Object.keys(texts));
      setEditableTexts(texts);
      setEditedTexts(texts);
      
      // Wait for rendering to complete after texts are set
      requestAnimationFrame(() => {
        setTimeout(() => {
          setPageRendered(true);
        }, 1000);
      });
    };
    
    loadTexts();
    
    // Load video links if on video-links page
    if (currentPage === 'video-links') {
      loadVideoLinks();
    }
  }, [isClient, currentLanguage, currentPage]);

  // Page is ready after translations are loaded and rendered
  usePageReady(pageRendered);

  const handleLanguageChange = (event) => {
    if (!isClient) return;
    setCurrentLanguage(event.target.value);
    setEditingMode(false);
  };

  const handlePageChange = (event, newValue) => {
    setCurrentPage(newValue);
  };

  // Function to detect and protect React/Next.js variables
  const hasProtectedVariables = (text) => {
    const protectedPatterns = [
      /\{[^}]+\}/g,  // {variable} patterns
      /%\{[^}]+\}/g,  // %{variable} patterns
      /\$\{[^}]+\}/g, // ${variable} patterns
      /\[[^\]]+\]/g,  // [variable] patterns
    ];
    
    return protectedPatterns.some(pattern => pattern.test(text));
  };

  const handleTextChange = (key, value) => {
    if (!isClient) return;
    setEditedTexts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!isClient) return;
    
    setEditableTexts(editedTexts);
    setEditingMode(false);
    
    // Update the language context with new translations (saves to database)
    const result = await updateTranslations(currentLanguage, editedTexts);
    
    console.log('Saving texts for language:', currentLanguage, editedTexts);
    
    if (result.success) {
      alert('✅ Content saved successfully to the database!\n\nAll visitors will now see these changes.');
    } else {
      alert('⚠️ Content saved locally but could not sync to database.\n\nChanges will only be visible on your device.\n\nError: ' + result.message);
    }
  };

  const handleCancel = () => {
    if (!isClient) return;
    
    // Reset editedTexts back to the current editableTexts (discard changes)
    setEditedTexts(editableTexts);
    setEditingMode(false);
    
    console.log('Cancelled editing, reverted to original texts');
  };

  const handleClearOldData = () => {
    if (!isClient) return;
    
    // Clear localStorage for all languages
    const languages = ['gb', 'sa', 'de', 'it', 'es', 'cn', 'my', 'pk', 'tr', 'id', 'ru', 'in'];
    languages.forEach(lang => {
      localStorage.removeItem(`custom_translations_${lang}`);
    });
    
    // Reset to default texts
    setEditableTexts(defaultTexts[currentLanguage] || {});
    setEditedTexts(defaultTexts[currentLanguage] || {});
    
    alert('✅ Old unused texts cleared! Content management now shows only texts that are actually used in the website.');
  };

  // Video Links Management Functions
  const loadVideoLinks = async () => {
    try {
      console.log('🎥 Loading video links...');
      const response = await axios.get('/api/video-links');
      
      if (response.data.success) {
        setVideoLinks(response.data.data || {});
        console.log('✅ Video links loaded:', response.data.data);
      } else {
        console.warn('⚠️ Failed to load video links');
      }
    } catch (error) {
      console.error('❌ Error loading video links:', error);
    }
  };

  const handleVideoLinkChange = (language, field, value) => {
    setVideoLinks(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value
      }
    }));
  };

  const handleSaveVideoLink = async (language) => {
    try {
      const videoData = videoLinks[language];
      
      // Enhanced validation for video ID
      if (!videoData || !videoData.videoId || videoData.videoId.trim() === '') {
        alert('❌ Please enter a YouTube Video ID\n\nExample: EDh8pgxsp8k');
        return;
      }

      // Validate YouTube video ID format (11 characters, alphanumeric + underscore + dash)
      const trimmedVideoId = videoData.videoId.trim();
      if (!trimmedVideoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
        alert('❌ Invalid YouTube Video ID!\n\nYouTube Video IDs are exactly 11 characters\nExample: EDh8pgxsp8k');
        return;
      }

      console.log('🎥 Saving video ID for language:', language);
      console.log('🎥 Video ID:', trimmedVideoId);

      const response = await axios.put('/api/video-links', {
        language,
        videoId: trimmedVideoId,
        title: videoData.title || 'Jerusalem Virtual Guide Video'
      });

      if (response.data.success) {
        alert(`✅ Video link saved successfully for ${languages.find(l => l.code === language)?.name}!`);
        setEditingVideoLink(null);
        // Reload video links to get updated data
        loadVideoLinks();
      } else {
        alert('❌ Failed to save video link: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error saving video link:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        alert('❌ Network Error!\n\nPlease check:\n1. Backend server is running on port 5000\n2. Internet connection is working\n3. Try refreshing the page');
      } else if (error.response?.status === 400) {
        alert('❌ Invalid data: ' + (error.response.data.message || 'Please check your input'));
      } else if (error.response?.status === 500) {
        alert('❌ Server Error: ' + (error.response.data.message || 'Please try again later'));
      } else {
        alert('❌ Error saving video link: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleCancelVideoEdit = () => {
    setEditingVideoLink(null);
    loadVideoLinks(); // Reload to reset any unsaved changes
  };

  const currentLanguageData = languages.find(lang => lang.code === currentLanguage);

  // Filter texts by current page - ONLY show texts that are actually used in the website
  const getCurrentPageTexts = () => {
    const allTexts = editedTexts;
    const pageTexts = {};
    
    // List of ALL translation keys that are actually used in the website
    const usedKeys = [
      // Home page (18 texts)
      'home-hero-title', 'home-hero-subtitle', 'home-badge-routes', 'home-badge-map', 'home-badge-history',
      'home-start-button', 'home-video-title', 'home-video-subtitle', 'home-guide-quote', 
      'home-guide-description-1', 'home-guide-description-2', 'home-routes-title', 'home-map-title',
      'home-map-subtitle', 'home-map-location', 'home-cta-title', 'home-cta-subtitle', 'home-cta-button',
      
      // Header (9 texts)
      'header-home', 'header-language', 'header-profile', 'header-create-account', 'header-signin', 'header-dashboard', 'header-search-placeholder', 'header-about-us', 'header-contact-us', 'header-sign-out',
      
      // SignIn page (7 texts)
      'signin-title', 'signin-email-label', 'signin-password-label', 'signin-forgot-password',
      'signin-button', 'signin-no-account', 'signin-create-account',
      
      // Dashboard (22 texts)
      'dashboard-loading', 'dashboard-edit-profile', 'dashboard-title', 'dashboard-redirecting', 'dashboard-wait-message', 'dashboard-signin-redirect', 'dashboard-user-fallback', 'dashboard-total-visitors', 'dashboard-registered-users', 'dashboard-page-views', 'dashboard-conversion-rate', 'dashboard-email-label', 'dashboard-change-password', 'dashboard-set-password', 'dashboard-password-help-change', 'dashboard-password-help-set', 'dashboard-current-password-label', 'dashboard-current-password-help', 'dashboard-new-password-label', 'dashboard-new-password-help', 'dashboard-confirm-password-label', 'dashboard-confirm-password-help',
      
      // Analytics page (19 texts)
      'analytics-title', 'analytics-subtitle', 'analytics-no-data-title', 'analytics-no-data-message', 'analytics-page-views', 'analytics-unique-visitors', 'analytics-bounce-rate', 'analytics-avg-session', 'analytics-top-pages', 'analytics-traffic-sources', 'analytics-no-data-yet', 'analytics-total-views', 'analytics-individual-users', 'analytics-single-page-visits', 'analytics-session-duration', 'analytics-loading', 'analytics-loading-message', 'analytics-redirecting', 'analytics-redirect-message',
      
      // Users page (13 texts)
      'users-user', 'users-role', 'users-status', 'users-joined', 'users-last-login', 'users-actions', 'users-loading', 'users-loading-message', 'users-redirecting', 'users-redirect-message', 'users-export-success', 'users-export-coming-soon', 'users-cannot-delete-self', 'users-delete-failed', 'users-update-failed', 'users-search-placeholder', 'users-no-search-results', 'users-no-users-yet', 'users-activate-deactivate',
      
      // Verify email page (5 texts)
      'verify-email-click-link', 'verify-email-not-found', 'verify-email-resend-failed', 'verify-email-sending', 'verify-email-resend-button',
      
      // Content management page (7 texts)
      'content-management-select-language', 'content-management-language', 'content-management-text-content', 'content-management-button-text', 'content-management-input-placeholder', 'content-management-contains-variables',
      
      // Create account page (2 texts)
      'create-account-title', 'create-account-email-label',
      
      // Create password page (3 texts)
      'create-password-title', 'create-password-password-label', 'create-password-confirm-label',
      
      // Forgot password page (3 texts)
      'forgot-password-check-email-title', 'forgot-password-title', 'forgot-password-email-label',
      
      // Reset password page (5 texts)
      'reset-password-success-title', 'reset-password-invalid-link-title', 'reset-password-title', 'reset-password-new-password-label', 'reset-password-confirm-password-label',
      
      // Password expired page (3 texts)
      'password-expired-current-label', 'password-expired-new-label', 'password-expired-confirm-label',
      
      // Image links page (2 texts)
      'image-links-linked-label', 'image-links-url-label',
      
      // Home page video (1 text)
      'home-video-title-alt',
      
      // Dashboard navigation (4 texts)
      'dashboard-nav-analytics', 'dashboard-nav-users', 'dashboard-nav-content-management', 'dashboard-nav-image-links',
      
      // Contact page (13 texts)
      'contact-badge', 'contact-hero-title-1', 'contact-hero-title-2', 'contact-hero-subtitle',
      'contact-form-title', 'contact-form-subtitle', 'contact-success-title', 'contact-success-message',
      'contact-form-name-label', 'contact-form-email-label', 'contact-form-subject-label',
      'contact-form-message-label', 'contact-form-submit-button',
      
      // About page (27 texts)
      'about-badge', 'about-hero-title-1', 'about-hero-title-2', 'about-hero-subtitle',
      'about-mission-title', 'about-mission-paragraph-1', 'about-mission-paragraph-2',
      'about-values-title', 'about-values-subtitle', 
      'about-value1-title', 'about-value1-description',
      'about-value2-title', 'about-value2-description',
      'about-value3-title', 'about-value3-description',
      'about-value4-title', 'about-value4-description',
      'about-stat1-value', 'about-stat1-label',
      'about-stat2-value', 'about-stat2-label',
      'about-stat3-value', 'about-stat3-label',
      'about-stat4-value', 'about-stat4-label',
      'about-cta-title', 'about-cta-subtitle'
    ];
    
    console.log('🔍 getCurrentPageTexts called:');
    console.log('  - currentPage:', currentPage);
    console.log('  - allTexts keys:', Object.keys(allTexts));
    console.log('  - allTexts length:', Object.keys(allTexts).length);
    
    // Don't filter if we don't have any texts loaded yet
    if (Object.keys(allTexts).length === 0) {
      console.log('⚠️ No texts loaded yet, returning empty object');
      return {};
    }
    
    // Filter to only show used texts for current page
    Object.keys(allTexts).forEach(key => {
      if (key.startsWith(`${currentPage}-`) && usedKeys.includes(key)) {
        pageTexts[key] = allTexts[key];
        console.log('✅ Found matching used key:', key);
      }
    });
    
    console.log('📋 Final page texts (only used):', Object.keys(pageTexts));
    return pageTexts;
  };

  const currentPageTexts = getCurrentPageTexts();

  // Get page info
  const currentPageInfo = pages.find(page => page.id === currentPage);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Complete Content Management System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Edit ALL text content across ALL pages and ALL languages
        </Typography>
      </Box>

      {/* Language Selector */}
      {isClient && (
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Language sx={{ color: 'primary.main' }} />
          <Typography variant="h6">Select Language</Typography>
        </Box>
        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value={currentLanguage}
            onChange={handleLanguageChange}
            label="Language"
          >
            {languages.map((language) => (
              <MenuItem key={language.code} value={language.code}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>
                    {language.flag}
                  </Typography>
                  <Box>
                    <Typography variant="body1">
                      {language.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {language.englishName}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      )}

      {/* Current Language Info */}
      {isClient && (
      <Box sx={{ mb: 3 }}>
        <Chip 
          label={`Editing content for: ${currentLanguageData?.flag} ${currentLanguageData?.name} (${currentLanguageData?.englishName})`}
          color="primary"
          variant="outlined"
          sx={{ fontSize: '1rem', py: 2, px: 1 }}
        />
      </Box>
      )}

      {/* Page Selection Tabs */}
      {isClient && (
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={currentPage}
          onChange={handlePageChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {pages.map((page) => (
            <Tab
              key={page.id}
              value={page.id}
              label={page.name}
              icon={page.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>
      )}

      {/* Page Content */}
      {isClient && (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {currentPageInfo?.icon}
          {currentPageInfo?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {currentPageInfo?.description}
        </Typography>
        
        {/* Video Links Management */}
        {currentPage === 'video-links' ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Manage YouTube Video Links for Each Language
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Set different YouTube videos for each language. The video will be displayed on the home page based on the user&apos;s selected language.
            </Typography>
            
            <Grid container spacing={3}>
              {languages.map((language) => {
                const videoData = videoLinks[language.code] || {
                  videoId: '',
                  title: 'Jerusalem Virtual Guide Video'
                };
                const isEditing = editingVideoLink === language.code;
                
                return (
                  <Grid item xs={12} md={6} key={language.code}>
                    <Card sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography sx={{ fontSize: '1.5rem' }}>{language.flag}</Typography>
                        <Box>
                          <Typography variant="h6">{language.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {language.englishName}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <TextField
                        fullWidth
                        label="YouTube Video ID"
                        placeholder="EDh8pgxsp8k"
                        value={videoData.videoId || ''}
                        onChange={(e) => handleVideoLinkChange(language.code, 'videoId', e.target.value)}
                        disabled={!isEditing}
                        sx={{ mb: 2 }}
                        helperText="Enter only the YouTube Video ID (11 characters, e.g., EDh8pgxsp8k)"
                      />
                      
                      <TextField
                        fullWidth
                        label="Video Title"
                        value={videoData.title || ''}
                        onChange={(e) => handleVideoLinkChange(language.code, 'title', e.target.value)}
                        disabled={!isEditing}
                        sx={{ mb: 2 }}
                        helperText="Title for the video (used for accessibility)"
                      />
                      
                      {videoData.videoId && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Preview:
                          </Typography>
                          <Box
                            sx={{
                              width: '100%',
                              height: '200px',
                              borderRadius: 1,
                              overflow: 'hidden',
                              border: '1px solid #ddd'
                            }}
                          >
                            <iframe
                              src={`https://www.youtube.com/embed/${videoData.videoId}?mute=0&showinfo=0&controls=0&start=0`}
                              style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                              }}
                              title={videoData.title}
                            />
                          </Box>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!isEditing ? (
                          <Button
                            variant="contained"
                            onClick={() => setEditingVideoLink(language.code)}
                            size="small"
                          >
                            Edit Video
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleSaveVideoLink(language.code)}
                              size="small"
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={handleCancelVideoEdit}
                              size="small"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ) : Object.keys(currentPageTexts).length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No content found for this page
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Content will be added as the website develops
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {Object.entries(currentPageTexts).map(([key, value]) => (
              <Grid item xs={12} key={key}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                      {key.replace(`${currentPage}-`, '').replace(/-/g, ' ')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      {hasProtectedVariables(value) && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                          <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 600 }}>
                            ⚠️ Protected Variables Detected
                          </Typography>
                          <Typography variant="caption" color="warning.dark">
                            This text contains React/Next.js variables (like {`{email}`}, {`{trend}%`}) that should NOT be edited. 
                            Only edit the text around these variables to avoid breaking functionality.
                          </Typography>
                        </Box>
                      )}
                    <TextField
                      fullWidth
                      multiline
                      rows={key.includes('description') || key.includes('subtitle') ? 4 : 2}
                      value={value}
                      onChange={(e) => handleTextChange(key, e.target.value)}
                      disabled={!editingMode}
                      variant="outlined"
                      label="Text Content"
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: key.includes('title') && !key.includes('subtitle') ? '1.2rem' : '1rem',
                          fontWeight: key.includes('title') && !key.includes('subtitle') ? 600 : 400
                        }
                      }}
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`Key: ${key}`} 
                        size="small" 
                        variant="outlined" 
                        color="info"
                      />
                      <Chip 
                        label={`Length: ${value.length} characters`} 
                        size="small" 
                        variant="outlined" 
                        color="secondary"
                      />
                      {key.includes('button') && (
                        <Chip 
                          label="Button Text" 
                          size="small" 
                          color="primary"
                        />
                      )}
                      {key.includes('placeholder') && (
                        <Chip 
                          label="Input Placeholder" 
                          size="small" 
                          color="warning"
                        />
                      )}
                        {hasProtectedVariables(value) && (
                          <Chip 
                            label="Contains Variables" 
                            size="small" 
                            color="error"
                          />
                        )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      )}

      {/* Action Buttons */}
      {isClient && (
      <Paper sx={{ p: 3, position: 'sticky', bottom: 0, zIndex: 1000 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {!editingMode ? (
            <>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditingMode(true)}
              size="large"
              sx={{ px: 4 }}
            >
              Enable Editing Mode
            </Button>
              <Button
                variant="outlined"
                color="warning"
                onClick={handleClearOldData}
                size="large"
                sx={{ px: 4 }}
              >
                Clear Unused Texts
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                size="large"
                color="success"
                sx={{ px: 4 }}
              >
                Save All Changes
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                size="large"
                sx={{ px: 4 }}
              >
                Cancel Changes
              </Button>
            </>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 2 }}>
          {editingMode ? 'Editing mode is active. All changes will be saved when you click "Save All Changes".' : 'Click "Enable Editing Mode" to start editing content.'}
        </Typography>
      </Paper>
      )}
    </Container>
  );
};

export default ContentManagement;
