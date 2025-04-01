import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ArrowLeft, Search, Calendar, Clock, MapPin, 
  CheckCircle, Filter, ChevronRight, Heart
} from 'lucide-react';
import { volunteerOpportunities } from '../data/mockData';

function Volunteer() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [showApplied, setShowApplied] = useState(false);
  
  // Simulate applied status for demo (in a real app, this would come from user data)
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);

  // Filter and search opportunities
  const filteredOpportunities = volunteerOpportunities
    .filter(opportunity => {
      if (filter === 'all') return true;
      const opportunityDate = new Date(opportunity.date);
      const today = new Date();
      return filter === 'upcoming' ? opportunityDate >= today : opportunityDate < today;
    })
    .filter(opportunity => 
      !showApplied || appliedOpportunities.includes(opportunity.id)
    )
    .filter(opportunity => 
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Handle opportunity application
  const handleApply = (id) => {
    if (appliedOpportunities.includes(id)) {
      setAppliedOpportunities(appliedOpportunities.filter(oppId => oppId !== id));
    } else {
      setAppliedOpportunities([...appliedOpportunities, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按钮和标题 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">志愿服务机会</h1>
        </div>

        {/* 志愿服务介绍 */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white mb-6">
          <div className="flex items-start">
            <Heart className="w-8 h-8 mr-4 text-white" />
            <div>
              <h2 className="text-xl font-semibold mb-2">参与志愿服务</h2>
              <p className="text-white/90 mb-4">
                通过参与学校志愿服务，您可以更深入地参与到孩子的教育环境中，了解学校文化，
                同时为学校和社区做出贡献。我们欢迎家长根据自己的专长和兴趣选择合适的志愿服务机会。
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <p className="text-sm mb-1">当前志愿者</p>
                  <p className="font-bold text-2xl">126</p>
                </div>
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <p className="text-sm mb-1">服务小时</p>
                  <p className="font-bold text-2xl">1,428</p>
                </div>
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <p className="text-sm mb-1">受益学生</p>
                  <p className="font-bold text-2xl">860</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索志愿服务机会..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">全部机会</option>
                <option value="upcoming">即将开始</option>
                <option value="past">已结束</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <input
              type="checkbox"
              id="showApplied"
              checked={showApplied}
              onChange={() => setShowApplied(!showApplied)}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="showApplied" className="text-sm text-gray-700">只显示我已申请的机会</label>
          </div>
        </div>

        {/* 志愿服务机会列表 */}
        <div className="space-y-4">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-4">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{opportunity.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">{opportunity.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      new Date(opportunity.date) >= new Date() 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {new Date(opportunity.date) >= new Date() ? '招募中' : '已结束'}
                    </span>
                  </div>

                  <p className="text-gray-700 mt-4">{opportunity.description}</p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{opportunity.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{opportunity.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span>需要: {opportunity.volunteersNeeded} 人</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      {appliedOpportunities.includes(opportunity.id) && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5 mr-1" />
                          <span>已申请</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/volunteer-details/${opportunity.id}`)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        查看详情
                      </button>
                      <button
                        onClick={() => handleApply(opportunity.id)}
                        className={`px-4 py-2 rounded-lg text-white transition-colors ${
                          appliedOpportunities.includes(opportunity.id)
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {appliedOpportunities.includes(opportunity.id) ? '取消申请' : '申请参与'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">没有找到符合条件的志愿服务机会</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Volunteer;