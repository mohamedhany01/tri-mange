// localization.ts

const en = {
  ...{
    complete: "Complete Products",
    incomplete: "Incomplete Products",
  },
  // app/(app)/_layout.tsx
  ...{
    statistics: "Statistics",
    clients: "Clients",
    utilities: "Utilities",
  },
  // app/(app)/index.tsx
  ...{
    totalClients: "Total Clients",
    totalProducts: "Total Products",
    totalPayments: "Total Payments",
    totalRevenue: "Total Revenue",
    averagePayment: "Average Payment",
    topClients: "Top Clients",
    clientName: "Client Name",
    totalSpent: "Total Spent",
    topClientBadge: "Top",
  },
  // app/(app)/utilities.tsx
  ...{
    changeTheme: "Change Theme",
    changeLanguage: "Change Language",
    backupToCloud: "Backup to Cloud",
    removeCache: "Remove Cache",
    updateApp: "Update App",
    version: "TriMange 0.1 Alpha",
    signout: "Sign Out",
  },
  // components/ConfirmationAlert.tsx
  ...{
    cancelText: "Cancel",
    confirmText: "Confirm",
    deleteText: "Delete",
  },
  // app/(clients)/[id].tsx
  ...{
    deleteClientTitle: "Confirm Client Deletion",
    deleteClientMessage:
      "Are you sure you want to delete this client and all associated products?",
  },
  // app/(payments)/[id].tsx
  ...{
    deletePaymentTitle: "Confirm Payment Deletion",
    deletePaymentMessage: "Are you sure you want to delete this payment?",
  },
  // app/(products)/[id].tsx
  ...{
    deleteProductTitle: "Confirm Product Deletion",
    deleteProductMessage: "Are you sure you want to delete this product?",
  },
  // components/form/*
  ...{
    addButtonText: "Add",
    updateButtonText: "Update",
    nameLabelText: "Name",
    noteLabelText: "Note",
    notePlaceholder: "e.g. Additional information",
    nameRequired: "Name is required",
  },
  // components/form/client/ActionForm.tsx
  ...{
    phoneNumberLabel: "Phone Number",
    namePlaceholder: "e.g. John Doe",
    phoneNumberPlaceholder: "e.g. +123456789",
  },
  // components/form/payment/ClientFormController.tsx
  ...{
    addClientTitle: "Add New Client",
    updateClientTitle: "Update Client",
  },
  // components/form/payment/PaymentFormController.tsx
  ...{
    amountLabelText: "Amount",
    amountRequired: "Amount price is required",
    amountPaymentFormPlaceholder: "e.g. 99.99",
  },
  // components/form/payment/PaymentFormController.tsx
  ...{
    addPaymentTitle: "Add New Payment",
    updatePaymentTitle: "Update Payment",
  },
  // components/form/product/ActionForm.tsx
  ...{
    nameProductFormPlaceholder: "e.g. Skin Cream",
    totalPriceLabelText: "Total Price",
    totalPriceRequired: "Total price is required",
    totalPriceProductFormPlaceholder: "e.g. 99.99",
  },
  // components/screen/product/Stage.tsx
  ...{
    amountPaidLabelText: "Amount Paid",
    remainingAmountLabelText: "Remaining Amount",
    createdLabelText: "Created",
  },
  // components/form/payment/ProductFormController.tsx
  ...{
    addProductTitle: "Add New Product",
    updateProductTitle: "Update Product",
  },
  // components/list/*
  ...{
    noResults: "No results found.",
    paymentsTitleText: "Payments",
    productsTitleText: "Products",
  },
  // components/search/*
  ...{
    searchClientBoxPlaceholder: "Find a client",
  },
  // components/screen/*
  ...{
    loadingText: "Loading...",
  },
  // components/screen/utilities/*
  ...{
    selectLanguageDropdown: "Select Language",
  },
  // app/(auth)/login.tsx
  ...{
    emailPlaceholderText: "Email",
    emailRequired: "Email is required",
    passwordPlaceholderText: "Password",
    passwordRequired: "Password is required",
    loginButtonText: "Login",
    loginSuccessMessage: "Login Successfully",
  },
  // components/screen/product/Stage.tsx
  ...{},
};

const ar = {
  ...{
    complete: "منتجات مكتملة",
    incomplete: "منتجات غير مكتملة",
  },
  // app/(app)/_layout.tsx
  ...{
    statistics: "الإحصائيات",
    clients: "العملاء",
    utilities: "الأدوات",
  },
  // app/(app)/index.tsx
  ...{
    totalClients: "إجمالي العملاء",
    totalProducts: "إجمالي المنتجات",
    totalPayments: "إجمالي المدفوعات",
    totalRevenue: "إجمالي الإيرادات",
    averagePayment: "متوسط المدفوعات",
    topClients: "أفضل العملاء",
    clientName: "اسم العميل",
    totalSpent: "إجمالي الإنفاق",
    topClientBadge: "الأعلى",
  },
  // app/(app)/utilities.tsx
  ...{
    changeTheme: "تغيير السمة",
    changeLanguage: "تغيير اللغة",
    backupToCloud: "نسخ احتياطي إلى السحابة",
    removeCache: "إزالة الذاكرة المؤقتة",
    updateApp: "تحديث التطبيق",
    version: "TriMange 0.1 ألفا",
    signout: "تسجيل الخروج",
  },
  // components/ConfirmationAlert.tsx
  ...{
    cancelText: "إلغاء",
    confirmText: "تأكيد",
    deleteText: "حذف",
  },
  // app/(clients)/[id].tsx
  ...{
    deleteClientTitle: "تأكيد حذف العميل",
    deleteClientMessage:
      "هل أنت متأكد أنك تريد حذف هذا العميل وجميع المنتجات المرتبطة به؟",
  },
  // app/(payments)/[id].tsx
  ...{
    deletePaymentTitle: "تأكيد حذف الدفع",
    deletePaymentMessage: "هل أنت متأكد أنك تريد حذف هذا الدفع؟",
  },
  // app/(products)/[id].tsx
  ...{
    deleteProductTitle: "تأكيد حذف المنتج",
    deleteProductMessage: "هل أنت متأكد أنك تريد حذف هذا المنتج؟",
  },
  // components/form/*
  ...{
    addButtonText: "إضافة",
    updateButtonText: "تحديث",
    nameLabelText: "الاسم",
    noteLabelText: "ملاحظة",
    notePlaceholder: "مثال: معلومات إضافية",
    nameRequired: "الاسم مطلوب",
  },
  // components/form/client/ActionForm.tsx
  ...{
    phoneNumberLabel: "رقم الهاتف",
    namePlaceholder: "مثال: محمد أحمد",
    phoneNumberPlaceholder: "مثال: +٠١٢٣٤٥٦٧٨٩",
  },
  // components/form/payment/ClientFormController.tsx
  ...{
    addClientTitle: "إضافة عميل جديد",
    updateClientTitle: "تحديث العميل",
  },
  // components/form/payment/PaymentFormController.tsx
  ...{
    amountLabelText: "المبلغ",
    amountRequired: "المبلغ مطلوب",
    amountPaymentFormPlaceholder: "مثال: ٩٩.٩٩",
  },
  // components/form/payment/PaymentFormController.tsx
  ...{
    addPaymentTitle: "إضافة دفعة جديدة",
    updatePaymentTitle: "تحديث الدفعة",
  },
  // components/form/product/ActionForm.tsx
  ...{
    nameProductFormPlaceholder: "مثال: كريم البشرة",
    totalPriceLabelText: "السعر الإجمالي",
    totalPriceRequired: "السعر الإجمالي مطلوب",
    totalPriceProductFormPlaceholder: "مثال: ٩٩.٩٩",
  },
  // components/screen/product/Stage.tsx
  ...{
    amountPaidLabelText: "المدفوع",
    remainingAmountLabelText: "المتبقي",
    createdLabelText: "تم إضافة فى",
  },
  // components/form/payment/ProductFormController.tsx
  ...{
    addProductTitle: "إضافة منتج جديد",
    updateProductTitle: "تحديث المنتج",
  },
  // components/list/*
  ...{
    noResults: "لم يتم العثور على نتائج.",
    paymentsTitleText: "المدفوعات",
    productsTitleText: "المنتجات",
  },
  // components/search/*
  ...{
    searchClientBoxPlaceholder: "ابحث عن عميل",
  },
  // components/screen/*
  ...{
    loadingText: "جارٍ التحميل...",
  },
  // components/screen/utilities/*
  ...{
    selectLanguageDropdown: "اختر اللغة",
  },
  // app/(auth)/login.tsx
  ...{
    emailPlaceholderText: "البريد الالكترونى",
    emailRequired: "البريد الالكترونى مطلوب",
    passwordPlaceholderText: "كلمة المرور",
    passwordRequired: "كلمة المرور مطلوبة",
    loginButtonText: "تسجيل الدخول",
    loginSuccessMessage: "دخول ناجح",
  },
};

export { en, ar };
