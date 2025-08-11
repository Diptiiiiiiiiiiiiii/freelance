// ✅ Auth Routes
export const AUTH_API = {
  REGISTER_API: "/auth/register",
  VERIFY_OTP_API: "/auth/verify-otp",
  LOGIN_API: "/auth/login",
};

// ✅ Gig Routes
export const GIG_API = {
  CREATE_GIG: "/gigs",                   // POST
  GET_ALL_GIGS: "/gigs",                 // GET
  GET_MY_GIGS: "/gigs/my-gigs",          // GET - For logged-in freelancer
  GET_GIG_BY_ID: (id) => `/gigs/${id}`,  // GET
  UPDATE_GIG: (id) => `/gigs/${id}`,     // PUT
  DELETE_GIG: (id) => `/gigs/${id}`,     // DELETE
  SEARCH_BY_CATEGORY: "/gigs/search",
};

// ✅ Upload Routes (Cloudinary)
export const UPLOAD_API = {
  UPLOAD_IMAGES: "/upload",                                // POST
  DELETE_IMAGE: (publicId) => `/upload?public_id=${publicId}`, // DELETE
};

// ✅ Order Routes
export const ORDER_API = {
  CREATE_ORDER: "/orders",                     // POST - Only after payment
  GET_MY_ORDERS: "/orders/my-orders",          // GET - For clients
  GET_SELLER_ORDERS: "/orders/seller-orders",  // GET - For freelancers
  UPDATE_ORDER_STATUS: (id) => `/orders/${id}`,// PUT - optional for delivery status
};

// ✅ Razorpay Payment Routes
export const PAYMENT_API = {
  CREATE_ORDER: "/payment/create-order",  // POST - initiates Razorpay order
  WEBHOOK: "/payment/webhook",            // POST - backend only (no frontend use)
};

export const CHAT_API = {
  CREATE_MESSAGE: "/chat/message",          // POST { senderId, receiverId, text }
  GET_MESSAGES: (conversationId) => `/chat/messages/${conversationId}`, // GET
  GET_CONVERSATIONS: (userId) => `/chat/conversations/${userId}`,       // GET
  CREATE_CONVERSATION: "/chat/conversation", // POST { members: [user1, user2] }
};

export const REVIEW_API = {
  CREATE_REVIEW: "/reviews",              // POST: Submit a new review
  GET_REVIEWS_FOR_GIG: "/reviews/gig",    // GET: Fetch reviews for a specific gig
};
export const SAVED_GIGS_API = {
  SAVE_GIG: (gigId) => `/saved-gigs/save/${gigId}`,
  REMOVE_GIG: (gigId) => `/saved-gigs/save/${gigId}`,
  GET_SAVED_GIGS: "/saved-gigs",
};
