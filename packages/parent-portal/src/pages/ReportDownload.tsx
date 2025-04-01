import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';

function ReportDownload() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('');
  const [fileFormat, setFileFormat] = useState('pdf');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 处理下载请求
    alert(`正在下载${reportType}，格式：${fileFormat}`);
    // 在实际应用中这里会触发一个文件下载
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 头部 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">成绩单下载</h1>
        </div>

        {/* 表单 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">成绩单类型</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                required
              >
                <option value="">请选择成绩单类型</option>
                <option value="本学期成绩单">本学期成绩单</option>
                <option value="上学期成绩单">上学期成绩单</option>
                <option value="全学年成绩单">全学年成绩单</option>
                <option value="近三年成绩单">近三年成绩单</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">文件格式</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="format" 
                    value="pdf"
                    checked={fileFormat === 'pdf'}
                    onChange={() => setFileFormat('pdf')}
                    className="mr-1" 
                  />
                  <span>PDF</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="format" 
                    value="excel"
                    checked={fileFormat === 'excel'}
                    onChange={() => setFileFormat('excel')}
                    className="mr-1" 
                  />
                  <span>EXCEL</span>
                </label>
              </div>
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                下载成绩单
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportDownload;