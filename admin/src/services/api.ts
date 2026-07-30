import { sharedStore } from '../data/sharedData';

const BASE_URL = 'http://localhost:5000/api';

export const adminApi = {
  // Fetch Dashboard Stats
  async getDashboardStats() {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/stats`);
      if (res.ok) {
        const json = await res.json();
        return json.stats;
      }
    } catch (e) {
      console.log('API offline, using local metrics');
    }
    return {
      totalRevenue: 184500,
      totalBookings: 1420,
      activeTechnicians: 148,
      registeredCustomers: 4890,
    };
  },

  // Approve Application & Generate Pass
  async approveApplication(id: string, generatedPassword: string) {
    try {
      const res = await fetch(`${BASE_URL}/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED', generatedPassword }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.log('API offline, using sharedStore');
    }
    sharedStore.updateApplicationStatus(id, 'APPROVED', generatedPassword);
    return { success: true };
  },

  // Block/Unblock User
  async toggleBlockUser(userId: string) {
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}/block`, {
        method: 'PUT',
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.log('API offline');
    }
    return { success: true };
  },
};
