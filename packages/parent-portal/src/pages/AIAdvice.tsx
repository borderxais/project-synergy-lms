import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  GraduationCap,
  Calendar,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  Download,
  Lightbulb
} from 'lucide-react';

function AIAdvice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adviceCategories, setAdviceCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // 模拟加载AI建议数据
  useEffect(() => {
    // 模拟API请求延迟
    const timer = setTimeout(() => {
      // 模拟数据
      setAdviceCategories([
        {
          id: 1,
          title: '学习方法优化',
          icon: <BookOpen className="w-6 h-6 text-blue-500" />,
          summary: '根据学习记录分析，建议优化数学和物理的学习方法',
          recommendations: [
            '数学: 针对三角函数和立体几何的弱点，建议增加每周练习时间，从当前的3小时提升至5小时。',
            '物理: 建议采用"概念图"学习法，将相关知识点连接起来，加深理解。',
            '学习计划: 建议周末增加一次知识整合复习，巩固一周所学内容。',
            '资源推荐: "高中数学思维导图全集"和"物理解题方法精讲"适合当前学习阶段。'
          ]
        },
        {
          id: 2,
          title: '心理健康建议',
          icon: <Brain className="w-6 h-6 text-purple-500" />,
          summary: '近期学习压力较大，建议适当调整作息和放松方式',
          recommendations: [
            '睡眠: 建议保持7-8小时睡眠，睡前30分钟避免使用电子设备。',
            '压力管理: 学习时使用"番茄工作法"，25分钟专注学习后休息5分钟。',
            '放松活动: 每天安排15-30分钟的轻度运动，如散步或瑜伽。',
            '社交活动: 适当增加与朋友的互动，每周至少安排一次社交活动。'
          ]
        },
        {
          id: 3,
          title: '升学规划建议',
          icon: <GraduationCap className="w-6 h-6 text-green-500" />,
          summary: '基于学科兴趣和能力分析，推荐适合的大学专业方向',
          recommendations: [
            '推荐专业: 计算机科学、数据科学、人工智能等相关专业最适合当前的学科表现。',
            '大学选择: 建议关注北京大学、清华大学、浙江大学等院校的相关专业。',
            '能力提升: 建议在高中阶段参加一些编程培训或竞赛，为将来专业学习打下基础。',
            '职业规划: 当前STEM领域职业前景广阔，建议多了解相关职业发展路径。'
          ]
        },
        {
          id: 4,
          title: '考试备考策略',
          icon: <Target className="w-6 h-6 text-amber-500" />,
          summary: '针对即将到来的期中考试，制定高效的复习计划',
          recommendations: [
            '重点科目: 建议优先复习数学、物理和英语，这三门科目占总分比重大。',
            '时间分配: 建议数学每天1.5小时，物理和英语各1小时，其他科目各0.5小时。',
            '复习方法: 采用"刷题-错题-总结-再刷题"的循环复习法。',
            '模拟测试: 建议在考试前一周进行至少2次全科目模拟测试，检验复习效果。'
          ]
        }
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleCategory = (id) => {
    if (expandedCategory === id) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(id);
    }
  };

  const generateFullReport = () => {
    alert('正在生成完整学习报告，稍后可在"通知系统"中查看...');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* 头部 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">AI教育顾问</h1>
        </div>

        {/* 内容区域 */}
        <div className="space-y-6">
          {/* 个性化建议头部 */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center mb-3">
              <Lightbulb className="w-8 h-8 mr-3" />
              <h2 className="text-xl font-bold">张小明的个性化学习建议</h2>
            </div>
            <p className="opacity-90">
              基于近期学习数据、考试成绩和行为表现，AI教育顾问为您提供以下个性化建议，
              帮助制定更高效的学习计划和提升学习效果。
            </p>
            <div className="mt-4 flex items-center text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>生成时间: 2025年3月31日 09:45</span>
            </div>
          </div>

          {/* 加载状态 */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-blue-100 w-12 h-12 mb-4"></div>
                <div className="h-4 bg-blue-100 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-blue-100 rounded w-1/3"></div>
              </div>
              <p className="text-gray-600 mt-6">生成个性化学习建议中...</p>
            </div>
          ) : (
            <>
              {/* 建议类别卡片 */}
              {adviceCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gray-50 mr-4">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{category.title}</h3>
                        <p className="text-gray-600 text-sm">{category.summary}</p>
                      </div>
                    </div>
                    <div>
                      {expandedCategory === category.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* 展开的内容 */}
                  {expandedCategory === category.id && (
                    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                      <ul className="space-y-3">
                        {category.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-gray-700">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              {/* 操作按钮 */}
              <div className="flex justify-end pt-4">
                <button
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  onClick={() => navigate(-1)}
                >
                  返回
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 flex items-center"
                  onClick={generateFullReport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  生成完整报告
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIAdvice;