"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
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

const ContentManagement = () => {
  const { updateTranslations, languageData } = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState('gb');
  const [editableTexts, setEditableTexts] = useState({});
  const [editingMode, setEditingMode] = useState(false);
  const [editedTexts, setEditedTexts] = useState({});
  const [currentPage, setCurrentPage] = useState('home');

  const languages = [
    { code: 'sa', name: 'العربية', flag: '🇸🇦', englishName: 'Arabic (Saudi Arabia)' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', englishName: 'German' },
    { code: 'gb', name: 'English', flag: '🇬🇧', englishName: 'English (UK)' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', englishName: 'Italian' },
    { code: 'es', name: 'Español', flag: '🇪🇸', englishName: 'Spanish' },
    { code: 'ir', name: 'فارسی', flag: '🇮🇷', englishName: 'Persian' },
    { code: 'pk', name: 'اردو', flag: '🇵🇰', englishName: 'Urdu' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', englishName: 'Turkish' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', englishName: 'Indonesian' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', englishName: 'Russian' },
    { code: 'in', name: 'हिन्दी', flag: '🇮🇳', englishName: 'Hindi' }
  ];

  // Comprehensive text content for ALL pages and ALL text elements
  const defaultTexts = {
    'gb': {
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

      // FOOTER
      'footer-company': 'Company',
      'footer-support': 'Support',
      'footer-legal': 'Legal',
      'footer-copyright': '© 2024 Jerusalem Virtual Guide. All rights reserved.',

      // SIGN IN PAGE
      'signin-title': 'Welcome Back',
      'signin-subtitle': 'Sign in to your account to continue your journey',
      'signin-email-label': 'Email Address',
      'signin-email-placeholder': 'Enter your email',
      'signin-password-label': 'Password',
      'signin-password-placeholder': 'Enter your password',
      'signin-button': 'Sign In',
      'signin-forgot-password': 'Forgot your password?',
      'signin-no-account': 'Don\'t have an account?',
      'signin-create-account': 'Create Account',
      'signin-social': 'Or sign in with',

      // CREATE ACCOUNT PAGE
      'createaccount-title': 'Create Your Account',
      'createaccount-subtitle': 'Join us and start your virtual journey through Jerusalem',
      'createaccount-email-label': 'Email Address',
      'createaccount-email-placeholder': 'Enter your email address',
      'createaccount-button': 'Create Account',
      'createaccount-have-account': 'Already have an account?',
      'createaccount-signin': 'Sign In',

      // CREATE PASSWORD PAGE
      'createpassword-title': 'Create Your Password',
      'createpassword-subtitle': 'Set a secure password for your account',
      'createpassword-password-label': 'New Password',
      'createpassword-password-placeholder': 'Enter your new password',
      'createpassword-confirm-label': 'Confirm Password',
      'createpassword-confirm-placeholder': 'Confirm your new password',
      'createpassword-button': 'Create Password',

      // FORGOT PASSWORD PAGE
      'forgotpassword-title': 'Forgot Your Password?',
      'forgotpassword-subtitle': 'Enter your email address and we\'ll send you a reset link',
      'forgotpassword-email-label': 'Email Address',
      'forgotpassword-email-placeholder': 'Enter your email address',
      'forgotpassword-button': 'Send Reset Link',
      'forgotpassword-back': 'Back to Sign In',

      // RESET PASSWORD PAGE
      'resetpassword-title': 'Reset Your Password',
      'resetpassword-subtitle': 'Enter your new password below',
      'resetpassword-password-label': 'New Password',
      'resetpassword-password-placeholder': 'Enter your new password',
      'resetpassword-confirm-label': 'Confirm New Password',
      'resetpassword-confirm-placeholder': 'Confirm your new password',
      'resetpassword-button': 'Reset Password',

      // VERIFY EMAIL PAGE
      'verifyemail-title': 'Verify Your Email',
      'verifyemail-subtitle': 'We\'ve sent a verification link to your email address',
      'verifyemail-check-button': 'Check Verification',
      'verifyemail-resend-button': 'Resend Verification Email',

      // DASHBOARD
      'dashboard-title': 'Dashboard',
      'dashboard-subtitle': 'Welcome back! Here\'s what\'s happening with your website.',
      'dashboard-profile-title': 'Personal Information',
      'dashboard-edit-profile': 'Edit Profile',
      'dashboard-quick-actions': 'Quick Actions',
      'dashboard-analytics': 'Analytics',
      'dashboard-analytics-subtitle': 'View detailed analytics',
      'dashboard-users': 'Users',
      'dashboard-users-subtitle': 'Manage user accounts',
      'dashboard-security': 'Security',
      'dashboard-security-subtitle': 'Security settings',
      'dashboard-reports': 'Reports',
      'dashboard-reports-subtitle': 'Generate reports',
      'dashboard-content-management': 'Content Management',
      'dashboard-content-management-subtitle': 'Edit website content',

      // DASHBOARD ANALYTICS
      'analytics-title': 'Analytics Dashboard',
      'analytics-subtitle': 'Track your website performance and user engagement',

      // DASHBOARD USERS
      'users-title': 'User Management',
      'users-subtitle': 'Manage user accounts and permissions',

      // DASHBOARD SECURITY
      'security-title': 'Security Settings',
      'security-subtitle': 'Manage security settings and monitor activity',

      // DASHBOARD REPORTS
      'reports-title': 'Reports',
      'reports-subtitle': 'Generate and download reports',

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

      // PROFILE DROPDOWN
      'profile-create-account': 'Create Account',
      'profile-signin': 'Sign In',
      'profile-privacy-policy': 'Privacy Policy',
      'profile-terms': 'Terms',
      'profile-signout': 'Sign Out',

      // GENERAL BUTTONS
      'button-save': 'Save',
      'button-cancel': 'Cancel',
      'button-edit': 'Edit',
      'button-delete': 'Delete',
      'button-submit': 'Submit',
      'button-close': 'Close',
      'button-back': 'Back',
      'button-next': 'Next',
      'button-previous': 'Previous',
      'button-continue': 'Continue',
      'button-finish': 'Finish',
      'button-confirm': 'Confirm',
      'button-yes': 'Yes',
      'button-no': 'No',
      'button-ok': 'OK',
      'button-apply': 'Apply',
      'button-reset': 'Reset',
      'button-clear': 'Clear',
      'button-search': 'Search',
      'button-filter': 'Filter',
      'button-sort': 'Sort',
      'button-export': 'Export',
      'button-import': 'Import',
      'button-download': 'Download',
      'button-upload': 'Upload',
      'button-preview': 'Preview',
      'button-publish': 'Publish',
      'button-unpublish': 'Unpublish',
      'button-activate': 'Activate',
      'button-deactivate': 'Deactivate',
      'button-enable': 'Enable',
      'button-disable': 'Disable',
      'button-show': 'Show',
      'button-hide': 'Hide',
      'button-expand': 'Expand',
      'button-collapse': 'Collapse',
      'button-refresh': 'Refresh',
      'button-reload': 'Reload',
      'button-loading': 'Loading...',
      'button-processing': 'Processing...',
      'button-sending': 'Sending...',
      'button-connecting': 'Connecting...',
      'button-verifying': 'Verifying...',
      'button-checking': 'Checking...',
      'button-syncing': 'Syncing...',
      'button-updating': 'Updating...',
      'button-creating': 'Creating...',
      'button-deleting': 'Deleting...',
      'button-saving': 'Saving...',
      'button-cancelling': 'Cancelling...',
      'button-submitting': 'Submitting...',
      'button-validating': 'Validating...',
      'button-generating': 'Generating...',
      'button-calculating': 'Calculating...',
      'button-analyzing': 'Analyzing...',
      'button-scanning': 'Scanning...',
      'button-searching': 'Searching...',
      'button-filtering': 'Filtering...',
      'button-sorting': 'Sorting...',
      'button-exporting': 'Exporting...',
      'button-importing': 'Importing...',
      'button-downloading': 'Downloading...',
      'button-uploading': 'Uploading...',
      'button-previewing': 'Previewing...',
      'button-publishing': 'Publishing...',
      'button-activating': 'Activating...',
      'button-deactivating': 'Deactivating...',
      'button-enabling': 'Enabling...',
      'button-disabling': 'Disabling...',
      'button-showing': 'Showing...',
      'button-hiding': 'Hiding...',
      'button-expanding': 'Expanding...',
      'button-collapsing': 'Collapsing...',
      'button-refreshing': 'Refreshing...',
      'button-reloading': 'Reloading...'
    },
    'sa': {
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

      // FOOTER - ARABIC
      'footer-company': 'الشركة',
      'footer-support': 'الدعم',
      'footer-legal': 'قانوني',
      'footer-copyright': '© 2024 دليل القدس الافتراضي. جميع الحقوق محفوظة.',

      // SIGN IN PAGE - ARABIC
      'signin-title': 'مرحباً بعودتك',
      'signin-subtitle': 'سجل الدخول إلى حسابك لمتابعة رحلتك',
      'signin-email-label': 'عنوان البريد الإلكتروني',
      'signin-email-placeholder': 'أدخل بريدك الإلكتروني',
      'signin-password-label': 'كلمة المرور',
      'signin-password-placeholder': 'أدخل كلمة المرور',
      'signin-button': 'تسجيل الدخول',
      'signin-forgot-password': 'نسيت كلمة المرور؟',
      'signin-no-account': 'ليس لديك حساب؟',
      'signin-create-account': 'إنشاء حساب',
      'signin-social': 'أو سجل الدخول باستخدام',

      // GENERAL BUTTONS - ARABIC
      'button-save': 'حفظ',
      'button-cancel': 'إلغاء',
      'button-edit': 'تعديل',
      'button-delete': 'حذف',
      'button-submit': 'إرسال',
      'button-close': 'إغلاق',
      'button-back': 'رجوع',
      'button-next': 'التالي',
      'button-previous': 'السابق',
      'button-continue': 'متابعة',
      'button-finish': 'إنهاء',
      'button-confirm': 'تأكيد',
      'button-yes': 'نعم',
      'button-no': 'لا',
      'button-ok': 'موافق',
      'button-search': 'بحث',
      'button-loading': 'جاري التحميل...',
      'button-processing': 'جاري المعالجة...',
      'button-saving': 'جاري الحفظ...',
      'button-submitting': 'جاري الإرسال...',

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
      'users-id': 'المعرف: {id}'
    }
    // Add more languages as needed
  };

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
    { id: 'forms', name: 'Form Elements', icon: <Edit />, description: 'Form labels and placeholders' }
  ];

  useEffect(() => {
    // Load texts for current language - check database first, then localStorage, then defaults
    const loadTexts = async () => {
      console.log('🔄 Loading texts for language:', currentLanguage, 'page:', currentPage);
      
      try {
        // Try to fetch from database
        const response = await fetch(`http://localhost:5000/api/translations/${currentLanguage}`, {
          credentials: 'include'
        });
        
        console.log('📡 Database response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📡 Database response data:', data);
          if (data.success && data.translations) {
            // Merge defaults with DB so missing new keys still show up
            const defaults = defaultTexts[currentLanguage] || defaultTexts['gb'];
            const mergedFromDb = { ...defaults, ...data.translations };
            console.log('✓ Loaded translations from database, merged keys:', Object.keys(mergedFromDb));
            setEditableTexts(mergedFromDb);
            setEditedTexts(mergedFromDb);
            return;
          }
        } else if (response.status === 404) {
          console.log('No translations in database, using defaults');
        } else {
          console.log('Database error, using defaults');
        }
      } catch (error) {
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
    };
    
    loadTexts();
  }, [currentLanguage, currentPage]);

  const handleLanguageChange = (event) => {
    setCurrentLanguage(event.target.value);
    setEditingMode(false);
  };

  const handlePageChange = (event, newValue) => {
    setCurrentPage(newValue);
  };

  const handleTextChange = (key, value) => {
    setEditedTexts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
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
    setEditedTexts(editableTexts);
    setEditingMode(false);
  };

  const currentLanguageData = languages.find(lang => lang.code === currentLanguage);

  // Filter texts by current page
  const getCurrentPageTexts = () => {
    const allTexts = editedTexts;
    const pageTexts = {};
    
    console.log('🔍 getCurrentPageTexts called:');
    console.log('  - currentPage:', currentPage);
    console.log('  - allTexts keys:', Object.keys(allTexts));
    console.log('  - allTexts length:', Object.keys(allTexts).length);
    
    // Don't filter if we don't have any texts loaded yet
    if (Object.keys(allTexts).length === 0) {
      console.log('⚠️ No texts loaded yet, returning empty object');
      return {};
    }
    
    Object.keys(allTexts).forEach(key => {
      if (key.startsWith(`${currentPage}-`)) {
        pageTexts[key] = allTexts[key];
        console.log('✅ Found matching key:', key);
      }
    });
    
    console.log('📋 Final page texts:', Object.keys(pageTexts));
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

      {/* Current Language Info */}
      <Box sx={{ mb: 3 }}>
        <Chip 
          label={`Editing content for: ${currentLanguageData?.flag} ${currentLanguageData?.name} (${currentLanguageData?.englishName})`}
          color="primary"
          variant="outlined"
          sx={{ fontSize: '1rem', py: 2, px: 1 }}
        />
      </Box>

      {/* Page Selection Tabs */}
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

      {/* Page Content */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {currentPageInfo?.icon}
          {currentPageInfo?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {currentPageInfo?.description}
        </Typography>
        
        {Object.keys(currentPageTexts).length === 0 ? (
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
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Action Buttons */}
      <Paper sx={{ p: 3, position: 'sticky', bottom: 0, zIndex: 1000 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {!editingMode ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditingMode(true)}
              size="large"
              sx={{ px: 4 }}
            >
              Enable Editing Mode
            </Button>
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
    </Container>
  );
};

export default ContentManagement;
