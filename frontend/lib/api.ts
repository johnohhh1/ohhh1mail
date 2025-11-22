const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const emailAPI = {
  async getEmails(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const response = await fetch(`${API_URL}/emails?${params}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async getEmail(id: number) {
    const response = await fetch(`${API_URL}/emails/${id}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async sendEmail(data: { to_address: string; subject: string; body_text: string }) {
    const response = await fetch(`${API_URL}/emails/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async markAsRead(id: number, isRead: boolean = true) {
    const response = await fetch(`${API_URL}/emails/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ is_read: isRead }),
    });
    return response.json();
  },

  async starEmail(id: number, starred: boolean) {
    const response = await fetch(`${API_URL}/emails/${id}/star`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ is_starred: starred }),
    });
    return response.json();
  },

  async syncEmails() {
    const response = await fetch(`${API_URL}/emails/sync`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },
};

export const aiAPI = {
  async generateQuickReplies(emailId: number) {
    const response = await fetch(`${API_URL}/ai/quick-replies/${emailId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },

  async composeEmail(prompt: string) {
    const response = await fetch(`${API_URL}/ai/compose`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ prompt }),
    });
    return response.json();
  },

  async generateReply(emailId: number, tone: string = 'professional') {
    const response = await fetch(`${API_URL}/ai/reply/${emailId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ tone }),
    });
    return response.json();
  },
};
