const contentRegistry = {
  // ═══════════════════════════════════════
  // AUTH — LOGIN
  // ═══════════════════════════════════════
  'auth.login.title': { en: 'Welcome back', ne: 'पुन: स्वागत छ' },
  'auth.login.subtitle': { en: 'Sign in to continue', ne: 'जारी राख्न साइन इन गर्नुहोस्' },
  'auth.login.identifier.label': { en: 'Email or Mobile Number', ne: 'ईमेल वा मोबाइल नम्बर' },
  'auth.login.identifier.placeholder': { en: 'you@email.com or 98XXXXXXXX', ne: 'ईमेल वा फोन नम्बर' },
  'auth.login.password.label': { en: 'Password', ne: 'पासवर्ड' },
  'auth.login.password.placeholder': { en: '••••••••', ne: '••••••••' },
  'auth.login.button': { en: 'Sign In', ne: 'साइन इन' },
  'auth.login.button.loading': { en: 'Signing in', ne: 'साइन इन हुँदै' },
  'auth.login.rememberMe': { en: 'Remember me', ne: 'मलाई सम्झनुहोस्' },
  'auth.login.forgotPassword': { en: 'Forgot password?', ne: 'पासवर्ड बिर्सनुभयो?' },
  'auth.login.divider': { en: 'OR CONTINUE WITH', ne: 'वा जारी राख्नुहोस्' },
  'auth.login.google': { en: 'Continue with Google', ne: 'Google बाट जारी राख्नुहोस्' },
  'auth.login.apple': { en: 'Continue with Apple', ne: 'Apple बाट जारी राख्नुहोस्' },
  'auth.login.terms': { en: 'By continuing, you agree to our', ne: 'जारी राखेर, तपाईं सहमत हुनुहुन्छ' },
  'auth.login.termsLink': { en: 'Terms', ne: 'सर्तहरू' },
  'auth.login.privacyLink': { en: 'Privacy Policy', ne: 'गोपनीयता नीति' },
  'auth.login.signupText': { en: "Don't have an account?", ne: 'खाता छैन?' },
  'auth.login.signupLink': { en: 'Sign up', ne: 'साइन अप' },
  'auth.login.error.default': { en: 'Invalid email or password', ne: 'अमान्य ईमेल वा पासवर्ड' },
  'auth.login.success.customer': { en: 'Welcome back! Find trusted workers near you.', ne: 'पुन: स्वागत छ! नजिकका विश्वसनीय कामदार खोज्नुहोस्।' },
  'auth.login.success.worker': { en: 'Ready to work? Check your dashboard for new jobs.', ne: 'काम गर्न तयार? नयाँ कामका लागि ड्यासबोर्ड जाँच गर्नुहोस्।' },
  'auth.login.success.admin': { en: 'Welcome back, Admin.', ne: 'पुन: स्वागत छ, एडमिन।' },

  // ═══════════════════════════════════════
  // AUTH — SIGNUP
  // ═══════════════════════════════════════
  'auth.signup.title': { en: 'Create Account', ne: 'खाता बनाउनुहोस्' },
  'auth.signup.subtitle': { en: 'Join Sajilo today', ne: 'आजै Sajilo मा सामेल हुनुहोस्' },
  'auth.signup.name.label': { en: 'Full Name', ne: 'पुरा नाम' },
  'auth.signup.name.placeholder': { en: 'Your name', ne: 'तपाईंको नाम' },
  'auth.signup.email.label': { en: 'Email', ne: 'ईमेल' },
  'auth.signup.email.placeholder': { en: 'you@email.com', ne: 'ईमेल' },
  'auth.signup.password.label': { en: 'Password', ne: 'पासवर्ड' },
  'auth.signup.password.placeholder': { en: 'Min 6 characters', ne: 'कम्तीमा ६ अक्षर' },
  'auth.signup.role.label': { en: 'I want to', ne: 'म चाहन्छु' },
  'auth.signup.role.customer': { en: 'Hire workers', ne: 'कामदार राख्न' },
  'auth.signup.role.worker': { en: 'Work as a service provider', ne: 'सेवा प्रदायकको रूपमा काम गर्न' },
  'auth.signup.button': { en: 'Create Account', ne: 'खाता बनाउनुहोस्' },
  'auth.signup.button.loading': { en: 'Creating account', ne: 'खाता बनाउँदै' },
  'auth.signup.loginText': { en: 'Already have an account?', ne: 'पहिले नै खाता छ?' },
  'auth.signup.loginLink': { en: 'Sign in', ne: 'साइन इन' },
  'auth.signup.success.customer': { en: 'Account created! Welcome to Sajilo.', ne: 'खाता बन्यो! Sajilo मा स्वागत छ।' },
  'auth.signup.success.worker': { en: 'Account created! Start earning by helping people.', ne: 'खाता बन्यो! मानिसहरूलाई सहयोग गरेर कमाउन सुरु गर्नुहोस्।' },

  // ═══════════════════════════════════════
  // HOME
  // ═══════════════════════════════════════
  'home.welcome': { en: 'Welcome to Sajilo', ne: 'Sajilo मा स्वागत छ' },
  'home.subtitle': { en: 'Find trusted workers near you', ne: 'नजिकका विश्वसनीय कामदार खोज्नुहोस्' },
  'home.services': { en: 'Services', ne: 'सेवाहरू' },
  'home.nearbyWorkers': { en: 'Nearby Workers', ne: 'नजिकका कामदारहरू' },
  'home.noWorkers': { en: 'No workers available yet', ne: 'कुनै कामदार उपलब्ध छैन' },
  'home.viewAll': { en: 'See all', ne: 'सबै हेर्नुहोस्' },
  'home.promoOff': { en: 'First booking 20% off', ne: 'पहिलो बुकिंगमा २०% छुट' },
  'home.promoPrio': { en: 'Priority access all month', ne: 'महिनाभर प्राथमिकता पहुँच' },
  'home.back': { en: 'Back', ne: 'पछाडि' },
  'home.swipeClose': { en: 'Swipe down to close', ne: 'बन्द गर्न तल स्वाइप गर्नुहोस्' },
  'home.worker.role': { en: 'Role', ne: 'भूमिका' },
  'home.worker.location': { en: 'Location', ne: 'स्थान' },
  'home.worker.rating': { en: 'Rating', ne: 'रेटिंग' },

  // ═══════════════════════════════════════
  // SEARCH
  // ═══════════════════════════════════════
  'search.title': { en: 'Search Workers', ne: 'कामदार खोज्नुहोस्' },
  'search.placeholder': { en: 'Search electrician, plumber, cleaner...', ne: 'इलेक्ट्रिसियन, प्लम्बर खोज्नुहोस्...' },
  'search.all': { en: 'All', ne: 'सबै' },
  'search.topRated': { en: 'Top Rated', ne: 'उच्च रेटिंग' },
  'search.availableNow': { en: 'Available Now', ne: 'अहिले उपलब्ध' },
  'search.nearby': { en: 'Nearby', ne: 'नजिकै' },
  'search.priceLow': { en: 'Price ↑', ne: 'मूल्य ↑' },
  'search.noResults': { en: 'No workers found', ne: 'कुनै कामदार भेटिएन' },
  'search.verified': { en: '✓ Verified', ne: '✓ प्रमाणित' },

  // ═══════════════════════════════════════
  // BOOKINGS
  // ═══════════════════════════════════════
  'bookings.title': { en: 'My Bookings', ne: 'मेरो बुकिंग' },
  'bookings.active': { en: 'Active', ne: 'सक्रिय' },
  'bookings.scheduled': { en: 'Scheduled', ne: 'निर्धारित' },
  'bookings.completed': { en: 'Completed', ne: 'सम्पन्न' },
  'bookings.noBookings': { en: 'No bookings yet', ne: 'कुनै बुकिंग छैन' },
  'bookings.track': { en: 'Track →', ne: 'ट्र्याक →' },
  'bookings.manage': { en: 'Manage →', ne: 'व्यवस्थापन →' },
  'bookings.rate': { en: 'Rate worker ★', ne: 'रेटिंग दिनुहोस् ★' },
  'booking.status.pending': { en: 'Pending', ne: 'विचाराधीन' },
  'booking.status.accepted': { en: 'Accepted', ne: 'स्वीकृत' },
  'booking.status.onway': { en: 'On the way', ne: 'बाटोमा' },
  'booking.status.working': { en: 'Working', ne: 'काम गर्दै' },
  'booking.status.completed': { en: 'Completed', ne: 'सम्पन्न' },
  'booking.status.cancelled': { en: 'Cancelled', ne: 'रद्द' },

  // ═══════════════════════════════════════
  // DETAIL
  // ═══════════════════════════════════════
  'detail.selectJob': { en: 'Select Job Size', ne: 'कामको साइज छान्नुहोस्' },
  'detail.small': { en: 'Small Job', ne: 'सानो काम' },
  'detail.medium': { en: 'Medium Job', ne: 'मध्यम काम' },
  'detail.large': { en: 'Large Job', ne: 'ठूलो काम' },
  'detail.when': { en: 'When?', ne: 'कहिले?' },
  'detail.now': { en: 'Now (~12 min)', ne: 'अहिले (~१२ मिनेट)' },
  'detail.schedule': { en: 'Schedule', ne: 'तालिका' },
  'detail.book': { en: 'Book Worker →', ne: 'बुक गर्नुहोस् →' },

  // ═══════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════
  'profile.title': { en: 'Profile', ne: 'प्रोफाइल' },
  'profile.wallet': { en: 'Wallet Balance', ne: 'वालेट ब्यालेन्स' },
  'profile.memberSince': { en: 'Member since', ne: 'सदस्य' },
  'profile.jobsBooked': { en: 'jobs booked', ne: 'काम बुक गरिएको' },
  'profile.editProfile': { en: 'Edit Profile', ne: 'प्रोफाइल सम्पादन' },
  'profile.settings': { en: 'Settings', ne: 'सेटिंग्स' },
  'profile.logout': { en: 'Logout', ne: 'लगआउट' },

  // ═══════════════════════════════════════
  // TRACKING
  // ═══════════════════════════════════════
  'tracking.title': { en: 'Live Tracking', ne: 'लाइभ ट्र्याकिंग' },
  'tracking.onWay': { en: 'On the way', ne: 'बाटोमा' },
  'tracking.eta': { en: 'min ETA', ne: 'मिनेट' },
  'tracking.accepted': { en: 'Accepted', ne: 'स्वीकृत' },
  'tracking.working': { en: 'Working', ne: 'काम गर्दै' },
  'tracking.done': { en: 'Done', ne: 'सम्पन्न' },
  'tracking.chat': { en: 'Chat', ne: 'च्याट' },
  'tracking.jobDetails': { en: 'Job Details', ne: 'काम विवरण' },
  'tracking.cancel': { en: 'Cancel', ne: 'रद्द' },
  'tracking.estimatedCost': { en: 'Estimated Cost', ne: 'अनुमानित लागत' },
  'tracking.workerNote': { en: 'Worker may adjust on-site', ne: 'कामदारले साइटमा समायोजन गर्न सक्छन्' },

  // ═══════════════════════════════════════
  // PRO
  // ═══════════════════════════════════════
  'pro.title': { en: 'Sajilo Pro', ne: 'Sajilo प्रो' },
  'pro.subtitle': { en: 'Priority workers. Zero surge fees.', ne: 'प्राथमिकता कामदार। सर्ज शुल्क छैन।' },
  'pro.mostPopular': { en: 'Most Popular', ne: 'सबैभन्दा लोकप्रिय' },
  'pro.startPro': { en: 'Start Pro →', ne: 'प्रो सुरु गर्नुहोस् →' },

  // ═══════════════════════════════════════
  // PROMO & CATEGORY
  // ═══════════════════════════════════════
  'promo.tag1': { en: 'Limited offer', ne: 'सीमित प्रस्ताव' },
  'promo.title1': { en: 'First booking 20% off', ne: 'पहिलो बुकिंगमा २०% छुट' },
  'promo.sub1': { en: 'New users · Any service', ne: 'नयाँ प्रयोगकर्ता · जुनसुकै सेवा' },
  'promo.tag2': { en: 'Pro subscription', ne: 'प्रो सदस्यता' },
  'promo.title2': { en: 'Priority access all month', ne: 'महिनाभर प्राथमिकता पहुँच' },
  'promo.sub2': { en: 'Skip the queue · Rs 999/mo', ne: 'लाइन छोड्नुहोस् · रु ९९९/महिना' },
  'category.primary': { en: 'Our Services', ne: 'हाम्रा सेवाहरू' },
  'category.secondary': { en: 'More Services', ne: 'थप सेवाहरू' },
  'category.all': { en: 'All', ne: 'सबै' },

  // ═══════════════════════════════════════
  // WORKER — DASHBOARD
  // ═══════════════════════════════════════
  'worker.available': { en: 'Available', ne: 'उपलब्ध' },
  'worker.jobsDone': { en: 'jobs done', ne: 'काम सम्पन्न' },
  'worker.message': { en: 'Message', ne: 'सन्देश' },
  'worker.online': { en: 'You are online', ne: 'तपाईं अनलाइन हुनुहुन्छ' },
  'worker.offline': { en: 'You are offline', ne: 'तपाईं अफलाइन हुनुहुन्छ' },
  'worker.receiving': { en: 'Receiving job requests', ne: 'काम अनुरोधहरू प्राप्त गर्दै' },
  'worker.goOnline': { en: 'Go online to receive job requests', ne: 'काम अनुरोध प्राप्त गर्न अनलाइन जानुहोस्' },
  'worker.noJob': { en: 'No active job', ne: 'कुनै सक्रिय काम छैन' },
  'worker.waiting': { en: 'Waiting for customer requests...', ne: 'ग्राहक अनुरोधको प्रतीक्षा गर्दै...' },
  'worker.viewJob': { en: 'View Active Job →', ne: 'सक्रिय काम हेर्नुहोस् →' },
  'worker.activeTasks': { en: 'Active Tasks', ne: 'सक्रिय कार्यहरू' },
  'worker.upcomingSchedule': { en: 'Upcoming Schedule', ne: 'आगामी तालिका' },
  'worker.earnings': { en: 'Earnings', ne: 'आम्दानी' },
  'worker.quickActions': { en: 'Quick Actions', ne: 'द्रुत कार्यहरू' },
  'worker.notifications': { en: 'Notifications', ne: 'सूचनाहरू' },
  'worker.viewTasks': { en: 'View Tasks', ne: 'कार्यहरू हेर्नुहोस्' },
  'worker.viewSchedule': { en: 'View Schedule', ne: 'तालिका हेर्नुहोस्' },
  'worker.noNotifications': { en: 'No new notifications', ne: 'कुनै नयाँ सूचना छैन' },
  'worker.profile': { en: 'Profile', ne: 'प्रोफाइल' },
  'worker.title': { en: 'Worker', ne: 'कामदार' },
  'worker.logout': { en: 'Logout', ne: 'लगआउट' },
  'worker.activeJobInProgress': { en: 'Active Job in Progress', ne: 'सक्रिय काम जारी छ' },

  // ═══════════════════════════════════════
  // WORKER — PENDING / APPLICATION
  // ═══════════════════════════════════════
  'worker.pendingTitle': { en: 'Awaiting Approval', ne: 'स्वीकृतिको प्रतीक्षामा' },
  'worker.pendingMsg': { en: "Your account is under review. You'll be notified once approved.", ne: 'तपाईंको खाता समीक्षामा छ। स्वीकृत भएपछि सूचित गरिनेछ।' },
  'worker.pendingStatus': { en: 'Application Pending', ne: 'आवेदन विचाराधीन' },
  'worker.pendingBrandName': { en: 'Sajilo', ne: 'Sajilo' },
  'worker.pendingNavbarTitle': { en: 'Application Status', ne: 'आवेदन स्थिति' },
  'worker.theme': { en: 'Theme', ne: 'थिम' },
  'worker.language': { en: 'Language', ne: 'भाषा' },
  'worker.noteFromAdmin': { en: 'Note from Admin', ne: 'एडमिनबाट नोट' },
  'worker.statusDefault': { en: 'Application submitted', ne: 'आवेदन पेश गरियो' },
  'worker.rejectedTitle': { en: 'Application Rejected', ne: 'आवेदन अस्वीकृत' },
  'worker.rejectedMsg': { en: 'Your application was not approved. Please contact support for more information.', ne: 'तपाईंको आवेदन स्वीकृत भएन। थप जानकारीको लागि सम्पर्क गर्नुहोस्।' },

  // Worker — Application Form
  'worker.applyTitle': { en: 'Worker Application', ne: 'कामदार आवेदन' },
  'worker.applySubtitle': { en: 'Fill in your details to apply as a service provider', ne: 'सेवा प्रदायकको रूपमा आवेदन दिन विवरण भर्नुहोस्' },
  'worker.applySubmit': { en: 'Submit Application', ne: 'आवेदन पेश गर्नुहोस्' },
  'worker.applySuccess': { en: 'Application submitted! Redirecting...', ne: 'आवेदन पेश गरियो! रिडाइरेक्ट गर्दै...' },
  'worker.uploadDocuments': { en: 'Upload Documents', ne: 'कागजात अपलोड' },
  'worker.reapply': { en: 'Reapply', ne: 'पुन: आवेदन' },

  // Worker — Application Tracker
  'worker.applicationTitle': { en: 'Application Status', ne: 'आवेदन स्थिति' },
  'worker.applicationSubtitle': { en: 'Track your application progress', ne: 'तपाईंको आवेदन प्रगति ट्र्याक गर्नुहोस्' },
  'worker.adminNote': { en: 'Note from Admin', ne: 'एडमिनबाट नोट' },

  // Worker — Stage Labels
  'worker.stage.submitted': { en: 'Submitted', ne: 'पेश गरियो' },
  'worker.stage.review': { en: 'In Review', ne: 'समीक्षामा' },
  'worker.stage.documents': { en: 'Documents', ne: 'कागजात' },
  'worker.stage.decision': { en: 'Decision', ne: 'निर्णय' },

  // Worker — Stage Descriptions
  'worker.stage.submittedDesc': { en: 'Your application has been received.', ne: 'तपाईंको आवेदन प्राप्त भयो।' },
  'worker.stage.reviewDesc': { en: 'Our team is reviewing your details.', ne: 'हाम्रो टोलीले तपाईंको विवरण समीक्षा गर्दैछ।' },
  'worker.stage.documentsDesc': { en: 'Upload required documents for verification.', ne: 'प्रमाणीकरणको लागि आवश्यक कागजात अपलोड गर्नुहोस्।' },
  'worker.stage.decisionDesc': { en: 'Final decision will be communicated soon.', ne: 'अन्तिम निर्णय चाँडै सूचित गरिनेछ।' },

  // Worker — Stage Icons
  'worker.stage.submittedIcon': { en: '📝', ne: '📝' },
  'worker.stage.reviewIcon': { en: '🔍', ne: '🔍' },
  'worker.stage.documentsIcon': { en: '📁', ne: '📁' },
  'worker.stage.decisionIcon': { en: '✅', ne: '✅' },

  // Worker — Status Messages
  'worker.status.submitted': { en: 'Your application has been submitted and is awaiting review.', ne: 'तपाईंको आवेदन पेश गरिएको छ र समीक्षाको प्रतीक्षामा छ।' },
  'worker.status.review': { en: 'Your application is being reviewed by our team.', ne: 'तपाईंको आवेदन हाम्रो टोलीद्वारा समीक्षा भइरहेको छ।' },
  'worker.status.documents': { en: 'Please upload the required documents to continue.', ne: 'जारी राख्न आवश्यक कागजात अपलोड गर्नुहोस्।' },
  'worker.status.decision': { en: 'A decision has been made on your application.', ne: 'तपाईंको आवेदनमा निर्णय भइसकेको छ।' },
  'worker.status.approvedMsg': { en: 'Congratulations! Your application has been approved. Welcome to Sajilo!', ne: 'बधाई छ! तपाईंको आवेदन स्वीकृत भयो। Sajilo मा स्वागत छ!' },
  'worker.status.rejectedMsg': { en: 'Your application was not approved. You can reapply after 30 days.', ne: 'तपाईंको आवेदन स्वीकृत भएन। ३० दिन पछि पुन: आवेदन दिन सक्नुहुन्छ।' },

  // Worker — Status Icons
  'worker.status.approvedIcon': { en: '🎉', ne: '🎉' },
  'worker.status.rejectedIcon': { en: '❌', ne: '❌' },

    // ── Phase 5.5 Additions: Worker element content keys ──
  'worker.myJobs': { en: 'My Jobs', ne: 'मेरो कामहरू' },
  'worker.jobsToday': { en: 'Jobs Today', ne: 'आजको काम' },
  'worker.todayEarnings': { en: "Today's Earnings", ne: 'आजको आम्दानी' },
  'worker.totalEarnings': { en: 'Total Earnings', ne: 'कुल आम्दानी' },
  'worker.completedJobs': { en: 'completed jobs', ne: 'सम्पन्न कामहरू' },
  'worker.jobHistory': { en: 'Job History', ne: 'कामको इतिहास' },
  'worker.noCompletedJobs': { en: 'No completed jobs yet.', ne: 'कुनै सम्पन्न काम छैन।' },
  'worker.availabilitySchedule': { en: 'Availability Schedule', ne: 'उपलब्धता तालिका' },
  'worker.morning': { en: 'Morning', ne: 'बिहान' },
  'worker.afternoon': { en: 'Afternoon', ne: 'दिउँसो' },
  'worker.evening': { en: 'Evening', ne: 'साँझ' },
  'worker.saving': { en: 'Saving...', ne: 'सेव गर्दै...' },
  'worker.edit': { en: 'Edit', ne: 'सम्पादन' },
  'worker.save': { en: 'Save', ne: 'सेव' },
  'worker.saving': { en: 'Saving...', ne: 'सेव गर्दै...' },
  'worker.accept': { en: 'Accept', ne: 'स्वीकार' },
  'worker.reject': { en: 'Reject', ne: 'अस्वीकार' },
  'worker.startTravel': { en: 'Start Travel', ne: 'यात्रा सुरु' },
  'worker.startWork': { en: 'Start Work', ne: 'काम सुरु' },
  'worker.completeJob': { en: 'Complete Job', ne: 'काम समाप्त' },
  'worker.jobsDone': { en: 'Jobs Done', ne: 'गरेको काम' },
  'worker.hourlyRate': { en: 'Hourly Rate (Rs)', ne: 'घण्टाको दर (रु)' },

  // ═══════════════════════════════════════
  // FIELDS
  // ═══════════════════════════════════════
  'field.phone': { en: 'Phone Number', ne: 'फोन नम्बर' },
  'field.phonePlaceholder': { en: '98XXXXXXXX', ne: '९८XXXXXXXX' },
  'field.skills': { en: 'Skills', ne: 'सीपहरू' },
  'field.skillsPlaceholder': { en: 'e.g. Electrician, Plumber', ne: 'जस्तै: इलेक्ट्रिसियन, प्लम्बर' },
  'field.experience': { en: 'Years of Experience', ne: 'अनुभव वर्ष' },
  'field.experiencePlaceholder': { en: 'e.g. 3', ne: 'जस्तै: ३' },
  'field.bio': { en: 'Short Bio', ne: 'छोटो परिचय' },
  'field.bioPlaceholder': { en: 'Tell us about yourself', ne: 'आफ्नो बारेमा बताउनुहोस्' },
  'field.select': { en: 'Select...', ne: 'छान्नुहोस्...' },

  // ═══════════════════════════════════════
  // RIGHT PANEL
  // ═══════════════════════════════════════
  'right.stats': { en: 'Platform Stats', ne: 'प्लेटफर्म तथ्याङ्क' },
  'right.activity': { en: 'Recent Activity', ne: 'हालको गतिविधि' },
  'right.trust': { en: 'Trust & Safety', ne: 'सुरक्षा र विश्वास' },
  'right.workersOnline': { en: 'Workers online', ne: 'कामदार अनलाइन' },
  'right.satisfaction': { en: 'Satisfaction', ne: 'सन्तुष्टि' },
  'right.avgResponse': { en: 'Avg response', ne: 'औसत प्रतिक्रिया' },
  'right.avgCost': { en: 'Avg job cost', ne: 'औसत काम लागत' },
  'right.verifiedWorkers': { en: 'All workers verified', ne: 'सबै कामदार प्रमाणित' },
  'right.verifiedDesc': { en: 'ID + background check', ne: 'आईडी + पृष्ठभूमि जाँच' },
  'right.securePayments': { en: 'Secure payments', ne: 'सुरक्षित भुक्तानी' },
  'right.secureDesc': { en: 'eSewa & Khalti protected', ne: 'ईसेवा र खल्ती संरक्षित' },
  'right.ratingSystem': { en: 'Rating system', ne: 'रेटिंग प्रणाली' },
  'right.ratingDesc': { en: 'Every job reviewed', ne: 'हरेक काम समीक्षा' },

  // ═══════════════════════════════════════
  // SIDEBAR
  // ═══════════════════════════════════════
  'sidebar.filters': { en: 'Filters', ne: 'फिल्टरहरू' },
  'sidebar.location': { en: 'Location', ne: 'स्थान' },
  'sidebar.radius': { en: 'Radius', ne: 'दूरी' },
  'sidebar.priceRange': { en: 'Price Range (Rs)', ne: 'मूल्य दायरा (रु)' },
  'sidebar.minRating': { en: 'Min Rating', ne: 'न्यूनतम रेटिंग' },
  'sidebar.availability': { en: 'Availability', ne: 'उपलब्धता' },
  'sidebar.all': { en: 'All', ne: 'सबै' },
  'sidebar.now': { en: 'Available Now', ne: 'अहिले उपलब्ध' },
  'sidebar.scheduled': { en: 'Scheduled', ne: 'निर्धारित' },
  'sidebar.dateTime': { en: 'Date & Time', ne: 'मिति र समय' },
  'sidebar.apply': { en: 'Apply Filters', ne: 'फिल्टर लागू' },
  'sidebar.reset': { en: 'Reset', ne: 'रिसेट' },

  // ═══════════════════════════════════════
  // CALENDAR & TIME
  // ═══════════════════════════════════════
  'calendar.months': { en: 'January,February,March,April,May,June,July,August,September,October,November,December', ne: 'जनवरी,फेब्रुअरी,मार्च,अप्रिल,मई,जुन,जुलाई,अगस्ट,सेप्टेम्बर,अक्टोबर,नोभेम्बर,डिसेम्बर' },
  'calendar.days': { en: 'Su,Mo,Tu,We,Th,Fr,Sa', ne: 'आइ,सो,मं,बु,बि,शु,श' },
  'calendar.clear': { en: 'Clear', ne: 'खाली' },
  'calendar.today': { en: 'Today', ne: 'आज' },
  'calendar.ok': { en: 'OK', ne: 'ठिक' },
  'calendar.cancel': { en: 'Cancel', ne: 'रद्द' },
  'calendar.selectDate': { en: 'Select date', ne: 'मिति छान्नुहोस्' },
  'time.hour': { en: 'Hour', ne: 'घण्टा' },
  'time.minute': { en: 'Minute', ne: 'मिनेट' },
  'time.am': { en: 'AM', ne: 'पूर्वाह्न' },
  'time.pm': { en: 'PM', ne: 'अपराह्न' },

  // ═══════════════════════════════════════
  // PAYMENT
  // ═══════════════════════════════════════
  'payment.note': { en: 'Pay via eSewa, Khalti, or cash · Platform fee 15%', ne: 'ईसेवा, खल्ती, वा नगद मार्फत भुक्तानी · प्लेटफर्म शुल्क १५%' },

  // ═══════════════════════════════════════
  // SOS
  // ═══════════════════════════════════════
  'sos.title': { en: 'Emergency Services', ne: 'आपतकालीन सेवाहरू' },
  'sos.subtitle': { en: 'Your location is being shared automatically', ne: 'तपाईंको स्थान स्वचालित रूपमा साझा गरिँदैछ' },
  'sos.gps': { en: 'GPS: Vantaa, Tikkurila — live', ne: 'GPS: काठमाडौं — लाइभ' },
  'sos.police': { en: 'Police', ne: 'प्रहरी' },
  'sos.fire': { en: 'Fire', ne: 'दमकल' },
  'sos.ambulance': { en: 'Ambulance', ne: 'एम्बुलेन्स' },
  'sos.close': { en: 'Close — I am safe', ne: 'बन्द — म सुरक्षित छु' },

  // ═══════════════════════════════════════
  // NAVBAR
  // ═══════════════════════════════════════
  'navbar.theme': { en: 'Toggle theme', ne: 'थिम बदल्नुहोस्' },

  // ═══════════════════════════════════════
  // EMPTY STATES
  // ═══════════════════════════════════════
  'empty.noWorkers': { en: 'No workers available yet', ne: 'कुनै कामदार उपलब्ध छैन' },
  'empty.noBookings': { en: 'No bookings yet', ne: 'कुनै बुकिंग छैन' },
  'empty.noResults': { en: 'No results found', ne: 'कुनै परिणाम भेटिएन' },

    // ═══════════════════════════════════════
  // MISC
  // ═══════════════════════════════════════
  'misc.verified': { en: '✓ Verified', ne: '✓ प्रमाणित' },
  'misc.kmAway': { en: 'km away', ne: 'किमी टाढा' },
  'misc.min': { en: 'min', ne: 'मिनेट' },
  'misc.hr': { en: '/hr', ne: '/घण्टा' },
  'misc.noActiveJob': { en: 'No active job', ne: 'कुनै सक्रिय काम छैन' },
  'misc.waitingRequests': { en: 'Waiting for customer requests...', ne: 'ग्राहक अनुरोधको प्रतीक्षा गर्दै...' },

// Worker Apply Cards
'worker.apply.cardIdentity': { en: 'Identity', ne: 'पहिचान' },
'worker.apply.cardService': { en: 'Service Category', ne: 'सेवा वर्ग' },
'worker.apply.cardLocation': { en: 'Location', ne: 'स्थान' },
'worker.apply.cardVerification': { en: 'Verification', ne: 'प्रमाणीकरण' },
'worker.apply.cardPreferences': { en: 'Preferences', ne: 'प्राथमिकताहरू' },
'worker.apply.cardTerms': { en: 'Terms & Safety', ne: 'सर्त र सुरक्षा' },
'worker.apply.next': { en: 'Next', ne: 'अर्को' },
'worker.apply.previous': { en: 'Previous', ne: 'अघिल्लो' },
'worker.apply.clearAll': { en: 'Clear All', ne: 'सबै खाली' },
'worker.apply.progress': { en: 'Step', ne: 'चरण' },
'worker.apply.missingFields': { en: 'Please complete all required fields.', ne: 'सबै आवश्यक फाँटहरू भर्नुहोस्।' },
'worker.apply.dob': { en: 'Date of Birth', ne: 'जन्म मिति' },
'worker.apply.primaryRole': { en: 'Primary Role', ne: 'मुख्य भूमिका' },
'worker.apply.secondaryRoles': { en: 'Secondary Roles', ne: 'अतिरिक्त भूमिका' },
'worker.apply.address': { en: 'Address', ne: 'ठेगाना' },
'worker.apply.addressPlaceholder': { en: 'Your full address', ne: 'तपाईंको पूरा ठेगाना' },
'worker.apply.serviceArea': { en: 'Service Area', ne: 'सेवा क्षेत्र' },
'worker.apply.serviceAreaPlaceholder': { en: 'e.g. Kathmandu, Lalitpur', ne: 'जस्तै: काठमाडौं, ललितपुर' },
'worker.apply.govId': { en: 'Government ID Number', ne: 'सरकारी परिचयपत्र नम्बर' },
'worker.apply.govIdPlaceholder': { en: 'Citizenship or passport number', ne: 'नागरिकता वा पासपोर्ट नम्बर' },
'worker.apply.selfie': { en: 'Selfie / Photo', ne: 'सेल्फी / फोटो' },
'worker.apply.availability': { en: 'Availability', ne: 'उपलब्धता' },
'worker.apply.notifications': { en: 'Notification Preference', ne: 'सूचना प्राथमिकता' },
'worker.apply.acceptTerms': { en: 'I accept the Terms & Conditions', ne: 'म सर्त र शर्तहरू स्वीकार गर्छु' },
'worker.apply.backgroundCheck': { en: 'I consent to a background check', ne: 'म पृष्ठभूमि जाँचको लागि सहमति दिन्छु' },
'worker.apply.safetyAgreement': { en: 'I agree to the safety guidelines', ne: 'म सुरक्षा दिशानिर्देशहरूमा सहमत छु' },

// Worker Roles
'worker.role.electrician': { en: 'Electrician', ne: 'इलेक्ट्रिसियन' },
'worker.role.plumber': { en: 'Plumber', ne: 'प्लम्बर' },
'worker.role.cleaner': { en: 'Cleaner', ne: 'सफाई' },
'worker.role.painter': { en: 'Painter', ne: 'चित्रकार' },
'worker.role.carpenter': { en: 'Carpenter', ne: 'काठको काम' },

// Availability
'worker.avail.weekdays': { en: 'Weekdays', ne: 'हप्ताका दिन' },
'worker.avail.weekends': { en: 'Weekends', ne: 'सप्ताहन्त' },
'worker.avail.fulltime': { en: 'Full Time', ne: 'पूर्ण समय' },

// Notifications
'worker.notify.email': { en: 'Email', ne: 'ईमेल' },
'worker.notify.sms': { en: 'SMS', ne: 'एसएमएस' },
'worker.notify.app': { en: 'App Notification', ne: 'एप सूचना' },

  // ═══════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════
  'notifications.title': { en: 'Notifications', ne: 'सूचनाहरू' },
  'notifications.empty': { en: 'No new notifications', ne: 'कुनै नयाँ सूचना छैन' },
  'notifications.markRead': { en: 'Mark all as read', ne: 'सबै पढिसकेको चिन्ह लगाउनुहोस्' },
  'notifications.badge': { en: 'Notifications', ne: 'सूचनाहरू' },

  // ═══════════════════════════════════════
  // LIVE CHAT
  // ═══════════════════════════════════════
  'chat.title': { en: 'Support Chat', ne: 'सहयोग च्याट' },
  'chat.placeholder': { en: 'Type your message...', ne: 'तपाईंको सन्देश लेख्नुहोस्...' },
  'chat.send': { en: 'Send', ne: 'पठाउनुहोस्' },
  'chat.online': { en: 'Online', ne: 'अनलाइन' },
  'chat.offline': { en: 'Offline', ne: 'अफलाइन' },
  'chat.start': { en: 'Start Chat', ne: 'च्याट सुरु गर्नुहोस्' },
  'chat.close': { en: 'Close', ne: 'बन्द गर्नुहोस्' },
  'chat.support': { en: 'Support Team', ne: 'सहयोग टोली' },

  
'worker.apply.confirm': { en: 'Confirm', ne: 'पुष्टि' },
'worker.apply.confirmTitle': { en: 'Confirm Submission', ne: 'पेश गर्ने पुष्टि' },
'worker.apply.confirmMsg': { en: 'You cannot make any changes after you submit the application. Are you sure to submit the application?', ne: 'आवेदन पेश गरेपछि तपाईं कुनै परिवर्तन गर्न सक्नुहुन्न। के तपाईं आवेदन पेश गर्न निश्चित हुनुहुन्छ?' },
'worker.apply.cancel': { en: 'Cancel', ne: 'रद्द' },
}

export default contentRegistry