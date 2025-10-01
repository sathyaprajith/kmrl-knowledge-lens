import React, { useCallback, forwardRef } from 'react';
import { Upload, FileText, Image, File } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (files: FileList) => void;
  multiple?: boolean;
  accept?: string;
}

const UploadZone = forwardRef<HTMLInputElement, UploadZoneProps>(
  ({ onFileSelect, multiple = true, accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" }, ref) => {
    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileSelect(files);
      }
    }, [onFileSelect]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files);
      }
    }, [onFileSelect]);

    const handleClick = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.click();
      }
    };

    return (
      <div className="w-full">
        <div
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group"
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Drop files here or click to browse
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Supports PDF, Word documents, images, and text files
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </div>
              <div className="flex items-center gap-1">
                <Image className="h-4 w-4" />
                <span>Images</span>
              </div>
              <div className="flex items-center gap-1">
                <File className="h-4 w-4" />
                <span>Text Files</span>
              </div>
            </div>
          </div>
        </div>

        <input
          ref={ref}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }
);

UploadZone.displayName = 'UploadZone';

export default UploadZone;
