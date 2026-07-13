import api from './api';

export const uploadService = {
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async deleteImage(filename: string): Promise<void> {
    await api.delete(`/uploads/image/${filename}`);
  },
};
