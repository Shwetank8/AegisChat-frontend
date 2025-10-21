import { Download } from 'lucide-react';
import { downloadFile } from '../utils/fileUpload';
import { FileMetadata } from '../utils/fileUpload';

interface FileMessageProps {
  file: FileMetadata;
  roomId: string;
  isOwn: boolean;
  username: string;
}

export default function FileMessage({ file, roomId, isOwn, username }: FileMessageProps) {
  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleDownload = async () => {
    try {
      await downloadFile(roomId, file.id, file.filename);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const getFileIcon = () => {
    if (file.mimetype.startsWith('image/')) return '🖼️';
    if (file.mimetype.startsWith('video/')) return '🎥';
    if (file.mimetype === 'application/pdf') return '📄';
    return '📎';
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs rounded-lg px-4 py-2 ${
          isOwn
            ? 'bg-[color:var(--color-brand)]/20 text-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-mono text-[color:var(--color-brand)] mb-1 truncate">
            {username}
          </p>
        )}
        <div className="flex items-center gap-2 my-1">
          <span>{getFileIcon()}</span>
          <span className="text-sm truncate">{file.filename}</span>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 text-xs text-[color:var(--color-brand)] hover:text-[color:var(--color-brand)]/80 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <p className="mt-1 text-xs text-muted-foreground">{formatTime(file.timestamp)}</p>
      </div>
    </div>
  );
}