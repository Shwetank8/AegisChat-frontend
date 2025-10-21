export interface FileMetadata {
  id: number;
  filename: string;
  mimetype: string;
  timestamp: string;
}

// export const uploadFile = async (
//   file: File,
//   roomId: string,
//   baseUrl: string = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
// ): Promise<{ fileId: number }> => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('roomId', roomId);

//   const response = await fetch(`${baseUrl}/upload`, {
//     method: 'POST',
//     body: formData,
//     credentials: 'include',
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || 'Upload failed');
//   }

//   return response.json();
// };

// utils/fileUpload.ts
export const uploadFile = async (
  file: File,
  roomId: string
): Promise<{ fileId: number }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("roomId", roomId);

  // Use the backend URL directly from env
  const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL!;
  // Example: "https://aegischat-backend-production.up.railway.app"

  const response = await fetch(`${baseUrl}/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed: ${response.status} - ${text}`);
  }

  const data = await response.json();
  return data;
};


export const downloadFile = async (
  roomId: string,
  fileId: number,
  filename: string,
  baseUrl: string = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
): Promise<void> => {
  try {
    const response = await fetch(`${baseUrl}/files/${roomId}/${fileId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('File download error:', error);
    throw error;
  }
};