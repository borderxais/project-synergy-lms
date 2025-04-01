
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  Clock, 
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  Download,
  Share2,
  Bookmark,
  Info,
  Calendar,
  Tag,
  Eye
} from 'lucide-react';
import { schoolNotices } from '../data/mockData';

function SchoolNotices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [bookmarkedNotices, setBookmarkedNotices] = useState([]);
  const [readNotices, setReadNotices] = useState([]);

  // 返回上一页
  const handleGoBack = () => {
    navigate(-1);
  };

  // 过滤通知类型
  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  // 排序通知
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  // 搜索通知
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 查看通知详情
  const handleViewDetails = (notice) => {
    setSelectedNotice(notice);
    if (!readNotices.includes(notice.id)) {
      setReadNotices([...readNotices, notice.id]);
    }
    window.scrollTo(0, 0);
  };

  // 收藏通知
  const handleBookmark = (noticeId, e) => {
    e.stopPropagation();
    if (bookmarkedNotices.includes(noticeId)) {
      setBookmarkedNotices(bookmarkedNotices.filter(id => id !== noticeId));
    } else {
      setBookmarkedNotices([...bookmarkedNotices, noticeId]);
    }
  };

  // 下载通知
  const handleDownload = (e) => {
    e.stopPropagation();
    console.log('Downloading notice');
    // 实际应用中，这里应该调用下载API
  };

  // 分享通知
  const handleShare = (e) => {
    e.stopPropagation();
    console.log('Sharing notice');
    // 实际应用中，这里应该调用分享API
  };

  // 关闭详情面板
  const handleCloseDetails = () => {
    setSelectedNotice(null);
  };

  // 获取通知类型对应的颜色和标签
  const getNoticeTypeInfo = (type) => {
    switch(type) {
      case 'academic':
        return { color: 'bg-blue-100 text-blue-600', label: '学术通知' };
      case 'administrative':
        return { color: 'bg-gray-100 text-gray-600', label: '行政通知' };
      case 'event':
        return { color: 'bg-amber-100 text-amber-600', label: '活动通知' };
      case 'important':
        return { color: 'bg-red-100 text-red-600', label: '重要通知' };
      case 'general':
      default:
        return { color: 'bg-green-100 text-green-600', label: '一般通知' };
    }
  };

  // 过滤、排序和搜索通知
  const processedNotices = schoolNotices
    .filter(notice => {
      const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || notice.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('/'));
      const dateB = new Date(b.date.split('/').reverse().join('/'));
      
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            返回
          </button>
          <h1 className="text-2xl font-bold text-gray-900">学校通知</h1>
          <div className="w-16"></div> {/* 占位元素，使标题居中 */}
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="搜索通知"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">筛选:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterType === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => handleFilterChange('important')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterType === 'important' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  重要
                </button>
                <button
                  onClick={() => handleFilterChange('academic')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterType === 'academic' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  学术
                </button>
                <button
                  onClick={() => handleFilterChange('event')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterType === 'event' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  活动
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-700">排序:</span>
              <select
                className="border border-gray-300 rounded-lg bg-gray-50 py-2 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500"
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="newest">最新优先</option>
                <option value="oldest">最早优先</option>
              </select>
            </div>
          </div>
        </div>

        {/* 详情面板 */}
        {selectedNotice && (
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="bg-blue-500 p-6 text-white">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">{selectedNotice.title}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-white hover:text-blue-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="flex items-center mt-2">
                <Tag className="w-4 h-4 mr-1" />
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getNoticeTypeInfo(selectedNotice.type).color}`}>
                  {getNoticeTypeInfo(selectedNotice.type).label}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>发布日期: {selectedNotice.date}</span>
                </div>
                <div className="flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  <span>来源: {selectedNotice.source || '学校办公室'}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>阅读次数: {selectedNotice.views || Math.floor(Math.random() * 500) + 100}</span>
                </div>
              </div>

              <div className="mb-6 border-b pb-6">
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">尊敬的家长：</p>
                  <p className="mb-4">
                    {selectedNotice.content || `这是关于"${selectedNotice.title}"的详细通知。学校希望通过此通知向所有家长传达重要信息，确保每位家长都能及时了解学校的相关安排和要求。`}
                  </p>
                  <p className="mb-4">
                    具体安排如下：
                  </p>
                  <ul className="list-disc pl-5 mb-4">
                    <li className="mb-2">请家长配合学校工作，按照通知要求执行相关事项</li>
                    <li className="mb-2">如有疑问，请及时与班主任或学校办公室联系</li>
                    <li className="mb-2">特殊情况将另行通知</li>
                  </ul>
                  <p>此致</p>
                  <p>敬礼</p>
                  <p>XX中学</p>
                </div>
              </div>

              {/* 附件（如果有） */}
              {selectedNotice.attachments && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">附件</h3>
                  <div className="space-y-2">
                    {selectedNotice.attachments.map((attachment, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="w-8 h-8 text-blue-500 mr-3">
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{attachment.size}</p>
                        </div>
                        <button 
                          className="p-2 text-gray-400 hover:text-blue-500"
                          onClick={handleDownload}
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={handleCloseDetails}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  返回列表
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleBookmark(selectedNotice.id, e)}
                    className={`p-2 rounded-lg ${
                      bookmarkedNotices.includes(selectedNotice.id)
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                    }`}
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 通知列表 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">通知列表</h2>
            <p className="text-gray-600">共 {processedNotices.length} 条通知</p>
          </div>

          {processedNotices.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">没有找到符合条件的通知</p>
            </div>
          ) : (
            <div className="divide-y">
              {processedNotices.map((notice) => (
                <div 
                  key={notice.id} 
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    readNotices.includes(notice.id) ? 'bg-white' : 'bg-blue-50'
                  }`}
                  onClick={() => handleViewDetails(notice)}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{notice.title}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getNoticeTypeInfo(notice.type).color}`}>
                          {getNoticeTypeInfo(notice.type).label}
                        </span>
                        {!readNotices.includes(notice.id) && (
                          <span className="inline-block bg-blue-500 rounded-full w-2 h-2"></span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2 gap-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{notice.date}</span>
                        </div>
                        {notice.source && (
                          <div className="flex items-center">
                            <Info className="w-4 h-4 mr-1" />
                            <span>{notice.source}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {notice.summary || `这是关于"${notice.title}"的通知摘要...`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between ml-4">
                      <div className="flex">
                        <button
                          onClick={(e) => handleBookmark(notice.id, e)}
                          className={`p-1 rounded-full ${
                            bookmarkedNotices.includes(notice.id)
                              ? 'text-amber-500'
                              : 'text-gray-400 hover:text-amber-500'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        {notice.attachments && notice.attachments.length > 0 ? `${notice.attachments.length} 个附件` : '无附件'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SchoolNotices;