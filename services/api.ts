import axios from '@/utils/axios';

// subscriptions
export const getAllSubscriptionServices = async () => {
  const { data } = await axios.get('/subscriptions/services');
  return data;
};

// subscription plans
export const getSubscriptionPlans = async (serviceId: string) => {
  const { data } = await axios.get(`/subscriptions/plans/service/${serviceId}`);
  return data;
};

// get users subscriptions
export const getUserSubscriptions = async () => {
  const { data } = await axios.get('/subscriptions/user');
  return data;
};

// subscribe user to a plan
export const subscribeToPlan = async (values: object) => {
  const { data } = await axios.post('/subscriptions/user', values);
  return data;
};

// update subscription status
export const updateSubscriptionStatus = async (
  subscriptionId: string,
  status: string,
) => {
  const { data } = await axios.patch(
    `/subscriptions/user/${subscriptionId}/status`,
    { status },
  );

  return data;
};

// delete user subscription
export const deleteUserSubscription = async (subscriptionId: string) => {
  const { data } = await axios.delete(`/subscriptions/user/${subscriptionId}`);
  return data;
};

// user profile
export const updateUser = async (values: object) => {
  const { data } = await axios.post('/auth/update-user', values);
  return data;
};

// statistics
export const getOverviewStats = async () => {
  const { data } = await axios.get('/statistics/overview');
  return data;
};

export const getUpcomingPayments = async () => {
  const { data } = await axios.get('/statistics/upcoming-payments');
  return data;
};

export const getSpendingByService = async () => {
  const { data } = await axios.get('/statistics/spending-by-service');
  return data;
};

export const getBillingCycles = async () => {
  const { data } = await axios.get('/statistics/billing-cycles');
  return data;
};

export const getAutoRenewStatus = async () => {
  const { data } = await axios.get('/statistics/auto-renew-status');
  return data;
};

export const getSavingsOpportunities = async () => {
  const { data } = await axios.get('/statistics/savings-opportunities');
  return data;
};

// settings
export const getUserSettings = async () => {
  const { data } = await axios.get('/settings');
  return data;
};

export const updateSettings = async (values: object) => {
  const { data } = await axios.patch('/settings', values);
  return data;
};
