import { generateCustomerNumber } from "./customer-number.js";
import { uid } from "../format.js";

/** @param {{ email?: string, firstName?: string, lastName?: string }} seed */
export function createMockCustomerBundle(seed = {}) {
  const email = seed.email || "client@example.com";
  const firstName = seed.firstName || "Alex";
  const lastName = seed.lastName || "Morgan";

  return {
    profile: {
      customerNumber: generateCustomerNumber(),
      email,
      firstName,
      lastName,
      phone: "+32 470 12 34 56",
      avatarUrl: null,
      addresses: [
        {
          id: uid("addr"),
          label: "Home",
          line1: "Rue de la Loi 16",
          line2: "Apartment 4B",
          city: "Brussels",
          postalCode: "1000",
          country: "Belgium",
          isDefault: true,
        },
      ],
      preferredPaymentMethodId: "pm_visa",
      updatedAt: new Date().toISOString(),
    },
    loyalty: {
      points: 420,
      lifetimePoints: 1280,
      lastEarnedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      walletAdded: false,
    },
    notifications: {
      orders: true,
      returns: true,
      newsletters: false,
    },
    appSettings: {
      autoplayVideos: true,
      language: window.PRV_I18N?.getLang?.() || "nl",
      dataTracking: false,
      analyticsConsent: true,
    },
    paymentMethods: [
      {
        id: "pm_visa",
        type: "card",
        label: "Visa ending 4242",
        last4: "4242",
        brand: "Visa",
        isDefault: true,
      },
      {
        id: "pm_mc",
        type: "card",
        label: "Mastercard ending 8210",
        last4: "8210",
        brand: "Mastercard",
        isDefault: false,
      },
      {
        id: "pm_apple",
        type: "apple_pay",
        label: "Apple Pay",
        isDefault: false,
      },
    ],
  };
}
