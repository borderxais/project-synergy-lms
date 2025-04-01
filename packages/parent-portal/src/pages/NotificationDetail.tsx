import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  BookOpen, 
  Heart, 
  Bell, 
  Clock, 
  MessageSquare, 
  Check, 
  X 
} from 'lucide-react';
import { notifications } from '../data/mockData';

function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟从数据中获取通知详情
    const notificationId = parseInt(id);
    const foundNotification = notifications.find(n => n.id === notificationId);
    
    // 模拟加载效果
    setTimeout(() => {
      setNotification(foundNotification || null);
      setLoading(false);
    }, 500);
  }, [id]);

  // 返回上一页
  const handleGoBack = () => {
    navigate(-1);
  };

  // 回复通知
  const handleReply = () => {
    navigate('/message', { state: { relatedTo: notification.id } });
  };

  // 标记为已读
  const handleMarkAsRead = () => {
    // 在实际应用中，这里应该调用API更新通知状态
    console.log(`Marking notification ${id} as read`);
    // 返回上一页
    navigate(-1);
  };

  // 处理通知操作
  const handleAction = (action) => {
    console.log(`Performing action: ${action}`);
    // 根据不同类型的通知进行不同的操作
    switch(action) {
      case 'view-academic':
        navigate('/subject/math');
        break;
      case 'confirm-event':
        navigate('/event-confirmation');
        break;
      case 'respond-behavior':
        navigate('/behavior-response');
        break;
      default:
        // 默认不执行操作
        break;
    }
  };

  // 获取通知类型对应的图标和颜色
  const getNotificationTypeInfo = (type) => {
    switch(type) {
      case 'academic':
        return { icon: <BookOpen className="w-6 h-6" />, color: 'text-blue-500 bg-blue-100' };
      case 'behavior':
        return { icon: <Heart className="w-6 h-6" />, color: 'text-green-500 bg-green-100' };
      case 'event':
        return { icon: <Calendar className="w-6 h-6" />, color: 'text-amber-500 bg-amber-100' };
      case 'alert':
        return { icon: <Bell className="w-6 h-6" />, color: 'text-red-500 bg-red-100' };
      default:
        return { icon: <Bell className="w-6 h-6" />, color: 'text-gray-500 bg-gray-100' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            返回
          </button>
          
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mb-4">
              <Bell className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">通知不存在</h1>
            <p className="text-gray-600 mb-6">您查找的通知可能已被删除或不存在</p>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              返回上一页
            </button>
          </div>
        </div>
      </div>
    );
  }

  const typeInfo = getNotificationTypeInfo(notification.type);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          返回
        </button>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 通知头部 */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${typeInfo.color} mr-4`}>
                  {typeInfo.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{notification.title}</h1>
                  <div className="flex items-center mt-1 text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{notification.time}</span>
                  </div>
                </div>
              </div>
              {!notification.read && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  未读
                </span>
              )}
            </div>
          </div>
          
          {/* 通知内容 */}
          <div className="p-6">
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">尊敬的家长：</p>
              <p className="mb-4">
                {notification.type === 'academic' && 
                  `我们想通知您关于您的孩子在${notification.title.includes('数学') ? '数学' : notification.title.includes('英语') ? '英语' : '最近的课程'}方面的表现。
                  ${notification.title.includes('进步') ? '他/她在最近的考试中表现出了明显的进步，这很值得表扬。' : '他/她在最近的考试中表现需要更多关注。'}`
                }
                {notification.type === 'behavior' && 
                  `我们想和您分享关于您孩子在校行为的一些情况。
                  ${notification.title.includes('表现优秀') ? '他/她近期表现非常出色，积极参与课堂活动，并展现出良好的品格。' : '最近有一些行为需要您的关注和指导。'}`
                }
                {notification.type === 'event' && 
                  `学校将于近期举办${notification.title}活动，希望获得您的支持和参与。
                  这个活动将对学生的综合素质发展有很大帮助。`
                }
                {notification.type === 'alert' && 
                  `这是一个需要您立即关注的重要通知。
                  ${notification.title.includes('缺勤') ? '您的孩子最近有缺勤情况，请知悉并提供相关说明。' : notification.title.includes('安全') ? '学校近期加强安全管理，请配合相关工作。' : '请尽快处理相关事宜。'}`
                }
              </p>
              <p className="mb-4">
                作为家长，您的配合对孩子的教育至关重要。我们希望通过家校合作，共同促进学生的全面发展。
              </p>
              <p className="mb-4">
                如有任何疑问，请随时与班主任联系。
              </p>
              <p>此致</p>
              <p>敬礼</p>
              <p>XX中学</p>
            </div>
            
            {/* 附件（如果有） */}
            {notification.type === 'academic' && (
              <div className="mt-6 border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">相关附件</h3>
                <div className="flex items-center text-blue-500 hover:text-blue-600 cursor-pointer">
                  <div className="p-2 bg-blue-50 rounded mr-3">
                    <FileIcon className="w-6 h-6" />
                  </div>
                  <span>{notification.title.includes('数学') ? '数学测试分析.pdf' : notification.title.includes('英语') ? '英语能力评估.pdf' : '学习情况报告.pdf'}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* 操作按钮 */}
          <div className="p-6 bg-gray-50 flex flex-wrap gap-4">
            <button
              onClick={handleMarkAsRead}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Check className="w-5 h-5 mr-2" />
              标记为已读
            </button>
            <button
              onClick={handleReply}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              回复
            </button>
            {notification.type === 'academic' && (
              <button
                onClick={() => handleAction('view-academic')}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                查看学业详情
              </button>
            )}
            {notification.type === 'event' && (
              <button
                onClick={() => handleAction('confirm-event')}
                className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Calendar className="w-5 h-5 mr-2" />
                确认参加
              </button>
            )}
            {notification.type === 'alert' && (
              <button
                onClick={handleGoBack}
                className="flex items-center px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X className="w-5 h-5 mr-2" />
                关闭
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 文件图标组件
function FileIcon({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      ></path>
    </svg>
  );
}

export default NotificationDetail;