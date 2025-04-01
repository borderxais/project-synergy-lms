import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search,
  Filter,
  ChevronDown,
  CheckCircle
} from 'lucide-react';
import { schoolActivities } from '../data/mockData';

function SchoolActivities() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [registeredActivities, setRegisteredActivities] = useState([]);

  // 返回上一页
  const handleGoBack = () => {
    navigate(-1);
  };

  // 过滤活动类型
  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  // 搜索活动
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 查看活动详情
  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    window.scrollTo(0, 0);
  };

  // 注册活动
  const handleRegister = (activityId) => {
    if (registeredActivities.includes(activityId)) {
      setRegisteredActivities(registeredActivities.filter(id => id !== activityId));
    } else {
      setRegisteredActivities([...registeredActivities, activityId]);
    }
  };

  // 关闭详情面板
  const handleCloseDetails = () => {
    setSelectedActivity(null);
  };

  // 过滤和搜索活动
  const filteredActivities = schoolActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // 获取活动类型对应的颜色
  const getActivityTypeColor = (type) => {
    switch(type) {
      case 'academic':
        return 'bg-blue-100 text-blue-600';
      case 'cultural':
        return 'bg-purple-100 text-purple-600';
      case 'sports':
        return 'bg-green-100 text-green-600';
      case 'volunteer':
        return 'bg-amber-100 text-amber-600';
      case 'competition':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // 获取中文活动类型
  const getActivityTypeText = (type) => {
    switch(type) {
      case 'academic':
        return '学术活动';
      case 'cultural':
        return '文化活动';
      case 'sports':
        return '体育活动';
      case 'volunteer':
        return '志愿服务';
      case 'competition':
        return '竞赛活动';
      default:
        return '其他活动';
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">学校活动</h1>
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
                placeholder="搜索活动"
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
                  onClick={() => handleFilterChange('cultural')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterType === 'cultural' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  文化
                </button>
                <button
                  onClick={() => handleFilterChange('sports')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterType === 'sports' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  体育
                </button>
                <button
                  onClick={() => handleFilterChange('volunteer')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterType === 'volunteer' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  志愿服务
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 详情面板 */}
        {selectedActivity && (
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="bg-blue-500 p-6 text-white">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">{selectedActivity.title}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-white hover:text-blue-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getActivityTypeColor(selectedActivity.type)}`}>
                {getActivityTypeText(selectedActivity.type)}
              </span>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">日期</p>
                    <p className="font-medium">{selectedActivity.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">时间</p>
                    <p className="font-medium">{selectedActivity.time || '待定'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">地点</p>
                    <p className="font-medium">{selectedActivity.location || '待定'}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">活动描述</h3>
                <p className="text-gray-700">
                  {selectedActivity.description || '这是一个学校组织的活动，旨在丰富学生的课外生活，提升综合素质。详细信息将在活动前公布。'}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">参与对象</h3>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-2" />
                  <p className="text-gray-700">{selectedActivity.participants || '所有年级学生及家长'}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">注意事项</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>请准时参加活动</li>
                  <li>活动期间请遵守学校规章制度</li>
                  <li>如有特殊情况无法参加，请提前请假</li>
                  {selectedActivity.notes && selectedActivity.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleRegister(selectedActivity.id)}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    registeredActivities.includes(selectedActivity.id)
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {registeredActivities.includes(selectedActivity.id) ? '已报名' : '报名参加'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 活动列表 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">活动列表</h2>
            <p className="text-gray-600">共 {filteredActivities.length} 个活动</p>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="p-6 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">没有找到符合条件的活动</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-900 mr-2">{activity.title}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getActivityTypeColor(activity.type)}`}>
                          {getActivityTypeText(activity.type)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3 gap-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{activity.date}</span>
                        </div>
                        {activity.time && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{activity.time}</span>
                          </div>
                        )}
                        {activity.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{activity.location}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {activity.description || '这是一个学校组织的活动，旨在丰富学生的课外生活，提升综合素质。'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      {registeredActivities.includes(activity.id) && (
                        <div className="flex items-center text-green-500 text-sm mb-2">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>已报名</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleViewDetails(activity)}
                        className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
                      >
                        查看详情
                      </button>
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

export default SchoolActivities;