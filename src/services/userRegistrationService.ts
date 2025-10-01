// User Registration Service with Admin Approval System

export interface PendingUser {
  id: string;
  username: string;
  email: string;
  password: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ApprovedUser {
  id: string;
  username: string;
  email: string;
  password: string;
  approvedDate: Date;
  approvedBy: string;
}

// LocalStorage keys for data persistence
const PENDING_USERS_KEY = 'k-lens:pending-users:v1';
const APPROVED_USERS_KEY = 'k-lens:approved-users:v1';
const ADMIN_NOTIFICATIONS_KEY = 'k-lens:admin-notifications:v1';

// Helper functions for localStorage operations
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored || stored === 'undefined' || stored === 'null') {
      return defaultValue;
    }
    
    const parsed = JSON.parse(stored);
    
    // Additional validation for arrays
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
      console.warn(`Expected array for ${key}, got:`, typeof parsed);
      return defaultValue;
    }
    
    return parsed;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    // Clear corrupted data
    try {
      localStorage.removeItem(key);
    } catch (clearError) {
      console.warn(`Failed to clear corrupted ${key}:`, clearError);
    }
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

// Load initial data from localStorage
let pendingUsers: PendingUser[] = loadFromStorage(PENDING_USERS_KEY, []);
let approvedUsers: ApprovedUser[] = loadFromStorage(APPROVED_USERS_KEY, []);
let adminNotifications: any[] = loadFromStorage(ADMIN_NOTIFICATIONS_KEY, []);

// Email simulation service
const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('📧 Email Sent:');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log('---');
};

export const userRegistrationService = {
  // Submit new user registration request
  submitRegistration: async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    
    // Check if user already exists
    const existingPending = pendingUsers.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
    const existingApproved = approvedUsers.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
    
    if (existingPending || existingApproved) {
      return {
        success: false,
        message: 'An account with this email already exists or is pending approval.'
      };
    }

    // Validate input
    if (!userData.username || !userData.email || !userData.password) {
      return {
        success: false,
        message: 'All fields are required.'
      };
    }

    if (userData.password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long.'
      };
    }

    // Create new pending user
    const newUser: PendingUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      requestDate: new Date(),
      status: 'pending'
    };

    pendingUsers.push(newUser);
    saveToStorage(PENDING_USERS_KEY, pendingUsers);

    // Add admin notification
    adminNotifications.push({
      id: Date.now().toString(),
      type: 'new_registration',
      message: `New user registration request from ${userData.username} (${userData.email})`,
      userId: newUser.id,
      timestamp: new Date()
    });
    saveToStorage(ADMIN_NOTIFICATIONS_KEY, adminNotifications);

    // Send confirmation email to user
    try {
      await sendEmail(
        userData.email,
        'Registration Request Received - KMRL K-Lens Platform',
        `Dear ${userData.username},

Thank you for your registration request for the KMRL K-Lens Document Intelligence Platform.

Your registration details:
- Username: ${userData.username}
- Email: ${userData.email}
- Request Date: ${newUser.requestDate.toLocaleDateString()}

Your account is currently pending admin approval. You will receive an email notification once your account has been reviewed and approved.

This process typically takes 1-2 business days.

Thank you for your patience.

Best regards,
KMRL K-Lens Platform Team`
      );
    } catch (error) {
      console.log('Failed to send confirmation email:', error);
    }

    return {
      success: true,
      message: 'Registration request submitted successfully! Please check your email for confirmation and wait for admin approval.'
    };
  },

  // Get all pending registrations (admin only)
  getPendingRegistrations: (): PendingUser[] => {
    try {
      if (!Array.isArray(pendingUsers)) {
        console.warn('pendingUsers is not an array, reloading from storage');
        pendingUsers = loadFromStorage(PENDING_USERS_KEY, []);
      }
      return pendingUsers.filter(user => user && user.status === 'pending');
    } catch (error) {
      console.error('Error getting pending registrations:', error);
      return [];
    }
  },

  // Approve a user registration (admin only)
  approveRegistration: async (userId: string, approvedBy: string): Promise<{ success: boolean; message: string }> => {
    const pendingUserIndex = pendingUsers.findIndex(user => user.id === userId && user.status === 'pending');
    
    if (pendingUserIndex === -1) {
      return {
        success: false,
        message: 'Pending user not found.'
      };
    }

    const pendingUser = pendingUsers[pendingUserIndex];
    
    // Move user to approved list
    const approvedUser: ApprovedUser = {
      id: pendingUser.id,
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password,
      approvedDate: new Date(),
      approvedBy
    };

    approvedUsers.push(approvedUser);
    saveToStorage(APPROVED_USERS_KEY, approvedUsers);
    
    // Update pending user status
    pendingUsers[pendingUserIndex].status = 'approved';
    saveToStorage(PENDING_USERS_KEY, pendingUsers);

    // Add notification
    adminNotifications.push({
      id: Date.now().toString(),
      type: 'approval',
      message: `User ${pendingUser.username} has been approved`,
      userId: pendingUser.id,
      timestamp: new Date()
    });
    saveToStorage(ADMIN_NOTIFICATIONS_KEY, adminNotifications);

    // Send approval email to user
    try {
      await sendEmail(
        pendingUser.email,
        '🎉 Account Approved - Welcome to K-Lens Platform!',
        `Dear ${pendingUser.username},

Great news! Your account has been approved and is now active.

You can now sign in to the K-Lens Document Intelligence Platform using your credentials:
- Email: ${pendingUser.email}
- Password: [Your chosen password]

Account Details:
- Username: ${pendingUser.username}
- Approved Date: ${approvedUser.approvedDate.toLocaleDateString()}
- Approved By: ${approvedBy}

Visit our platform: http://localhost:8080/signin

Welcome to K-Lens! We're excited to have you on board.

Best regards,
K-Lens Platform Team`
      );
    } catch (error) {
      console.log('Failed to send approval email:', error);
    }

    return {
      success: true,
      message: `User ${pendingUser.username} has been approved successfully and notified via email.`
    };
  },

  // Reject a user registration (admin only)
  rejectRegistration: async (userId: string, rejectedBy: string, reason?: string): Promise<{ success: boolean; message: string }> => {
    const pendingUserIndex = pendingUsers.findIndex(user => user.id === userId && user.status === 'pending');
    
    if (pendingUserIndex === -1) {
      return {
        success: false,
        message: 'Pending user not found.'
      };
    }

    const pendingUser = pendingUsers[pendingUserIndex];
    
    // Update pending user status
    pendingUsers[pendingUserIndex].status = 'rejected';
    saveToStorage(PENDING_USERS_KEY, pendingUsers);

    // Add notification
    adminNotifications.push({
      id: Date.now().toString(),
      type: 'rejection',
      message: `User ${pendingUser.username} registration has been rejected`,
      userId: pendingUser.id,
      timestamp: new Date()
    });
    saveToStorage(ADMIN_NOTIFICATIONS_KEY, adminNotifications);

    // Send rejection email to user
    try {
      const reasonText = reason ? `\n\nReason: ${reason}` : '';
      await sendEmail(
        pendingUser.email,
        'Account Registration Update - K-Lens Platform',
        `Dear ${pendingUser.username},

We regret to inform you that your account registration request has been reviewed and could not be approved at this time.${reasonText}

If you believe this is an error or would like to resubmit your application, please contact our support team.

Registration Details:
- Username: ${pendingUser.username}
- Email: ${pendingUser.email}
- Review Date: ${new Date().toLocaleDateString()}

Thank you for your interest in K-Lens Platform.

Best regards,
K-Lens Platform Team`
      );
    } catch (error) {
      console.log('Failed to send rejection email:', error);
    }

    return {
      success: true,
      message: `User registration has been rejected and user has been notified via email.`
    };
  },

  // Check if user can login (must be approved)
  canUserLogin: (email: string, password: string): boolean => {
    const approvedUser = approvedUsers.find(
      user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );
    return !!approvedUser;
  },

  // Check user registration status
  getUserStatus: (email: string): { status: 'not_found' | 'pending' | 'approved' | 'rejected', user?: PendingUser | ApprovedUser } => {
    // Check approved users first
    const approvedUser = approvedUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (approvedUser) {
      return { status: 'approved', user: approvedUser };
    }

    // Check pending users
    const pendingUser = pendingUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (pendingUser) {
      return { status: pendingUser.status as 'pending' | 'rejected', user: pendingUser };
    }

    return { status: 'not_found' };
  },

  // Get admin notifications
  getAdminNotifications: () => {
    try {
      if (!Array.isArray(adminNotifications)) {
        console.warn('adminNotifications is not an array, reloading from storage');
        adminNotifications = loadFromStorage(ADMIN_NOTIFICATIONS_KEY, []);
      }
      return adminNotifications
        .filter(notification => notification && notification.timestamp)
        .sort((a, b) => {
          try {
            const aTime = new Date(a.timestamp).getTime();
            const bTime = new Date(b.timestamp).getTime();
            return bTime - aTime;
          } catch (sortError) {
            console.warn('Error sorting notifications:', sortError);
            return 0;
          }
        });
    } catch (error) {
      console.error('Error getting admin notifications:', error);
      return [];
    }
  },

  // Clear admin notifications
  clearAdminNotifications: () => {
    adminNotifications = [];
    saveToStorage(ADMIN_NOTIFICATIONS_KEY, adminNotifications);
  },

  // Get all users for admin dashboard
  getAllUsers: () => {
    try {
      if (!Array.isArray(pendingUsers)) {
        console.warn('pendingUsers is not an array, reloading from storage');
        pendingUsers = loadFromStorage(PENDING_USERS_KEY, []);
      }
      if (!Array.isArray(approvedUsers)) {
        console.warn('approvedUsers is not an array, reloading from storage');
        approvedUsers = loadFromStorage(APPROVED_USERS_KEY, []);
      }
      
      return {
        pending: pendingUsers.filter(user => user && typeof user === 'object'),
        approved: approvedUsers.filter(user => user && typeof user === 'object')
      };
    } catch (error) {
      console.error('Error getting all users:', error);
      return {
        pending: [],
        approved: []
      };
    }
  },

  // Get pending count for notifications
  getPendingCount: (): number => {
    try {
      if (!Array.isArray(pendingUsers)) {
        pendingUsers = loadFromStorage(PENDING_USERS_KEY, []);
      }
      return pendingUsers.filter(user => user && user.status === 'pending').length;
    } catch (error) {
      console.error('Error getting pending count:', error);
      return 0;
    }
  },

  // Debug and utility functions
  clearAllData: (): void => {
    try {
      localStorage.removeItem(PENDING_USERS_KEY);
      localStorage.removeItem(APPROVED_USERS_KEY);
      localStorage.removeItem(ADMIN_NOTIFICATIONS_KEY);
      
      pendingUsers = [];
      approvedUsers = [];
      adminNotifications = [];
      
      console.log('All user registration data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },

  // Reset to fresh state
  resetToDefaults: (): void => {
    try {
      pendingUsers = [];
      approvedUsers = [];
      adminNotifications = [];
      
      saveToStorage(PENDING_USERS_KEY, pendingUsers);
      saveToStorage(APPROVED_USERS_KEY, approvedUsers);
      saveToStorage(ADMIN_NOTIFICATIONS_KEY, adminNotifications);
      
      console.log('User registration service reset to defaults');
    } catch (error) {
      console.error('Error resetting to defaults:', error);
    }
  }
};
