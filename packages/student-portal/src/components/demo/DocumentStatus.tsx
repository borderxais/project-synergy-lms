import React from 'react';
import { FileText, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';

interface Document {
  name: string;
  status: 'not_uploaded' | 'uploaded' | 'verified' | 'rejected';
  message?: string;
}

interface DocumentStatusProps {
  documents?: Document[];
  onUpload?: (documentName: string) => void;
}

const defaultDocuments: Document[] = [
  {
    name: 'Personal Statement',
    status: 'not_uploaded',
    message: 'Required for your application'
  },
  {
    name: 'Transcript',
    status: 'not_uploaded',
    message: 'Official high school transcript'
  },
  {
    name: 'Test Scores',
    status: 'not_uploaded',
    message: 'SAT or ACT scores'
  }
];

export function DocumentStatus({ 
  documents = defaultDocuments, 
  onUpload = () => {} 
}: DocumentStatusProps) {
  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'uploaded':
        return <Upload className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusMessage = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'rejected':
        return 'Action Required';
      case 'uploaded':
        return 'Under Review';
      default:
        return 'Not Uploaded';
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Documents & Recommendations</h3>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors">
            <div className="flex items-center space-x-3">
              {getStatusIcon(doc.status)}
              <div>
                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                <p className="text-xs text-gray-500">
                  {doc.message || getStatusMessage(doc.status)}
                </p>
              </div>
            </div>
            {doc.status === 'not_uploaded' && (
              <button
                onClick={() => onUpload(doc.name)}
                className="text-sm text-blue-600 hover:text-blue-500 px-3 py-1 rounded-md hover:bg-blue-50"
              >
                Upload
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}