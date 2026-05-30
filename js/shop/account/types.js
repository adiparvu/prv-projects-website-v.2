/**
 * @typedef {Object} CustomerAddress
 * @property {string} id
 * @property {string} label
 * @property {string} line1
 * @property {string} [line2]
 * @property {string} city
 * @property {string} postalCode
 * @property {string} country
 * @property {boolean} [isDefault]
 */

/**
 * @typedef {Object} SavedPaymentMethod
 * @property {string} id
 * @property {"card"|"apple_pay"|"paypal"|"bancontact"} type
 * @property {string} label
 * @property {string} [last4]
 * @property {string} [brand]
 * @property {boolean} [isDefault]
 */

/**
 * @typedef {Object} CustomerProfile
 * @property {string} customerNumber
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [phone]
 * @property {string|null} avatarUrl
 * @property {CustomerAddress[]} addresses
 * @property {string|null} preferredPaymentMethodId
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} LoyaltyAccount
 * @property {number} points
 * @property {number} lifetimePoints
 * @property {string|null} lastEarnedAt
 * @property {boolean} walletAdded
 */

/**
 * @typedef {Object} ShopNotificationPreferences
 * @property {boolean} orders
 * @property {boolean} returns
 * @property {boolean} newsletters
 */

/**
 * @typedef {Object} AppSettings
 * @property {boolean} autoplayVideos
 * @property {string} language
 * @property {boolean} dataTracking
 * @property {boolean} analyticsConsent
 */

/**
 * @typedef {Object} CustomerAccountBundle
 * @property {CustomerProfile} profile
 * @property {LoyaltyAccount} loyalty
 * @property {ShopNotificationPreferences} notifications
 * @property {AppSettings} appSettings
 * @property {SavedPaymentMethod[]} paymentMethods
 */

export const PROFILE_STORAGE_KEY = "prv_shop_customer_profile";
