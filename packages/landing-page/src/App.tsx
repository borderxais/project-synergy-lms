import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Users, School, ChevronRight, Star, HandshakeIcon, Heart, Lightbulb, Compass, BarChart3, Sparkles, TrendingUp, Brain } from 'lucide-react';


const slides = [
  {
    url: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80",
    city: "Los Angeles"
  },
  {
    url: "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?auto=format&fit=crop&q=80",
    city: "New York"
  },
  {
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80",
    city: "San Francisco"
  }
];

const features = [
  { icon: Star, title: "个人定制化学习", desc: "AI定制你的学习路径，激发潜能" },
  { icon: HandshakeIcon, title: "家庭协同", desc: "实时连接家校，360°了解孩子" },
  { icon: Heart, title: "心理健康", desc: "情感支持，守护你的内心成长" },
  { icon: Lightbulb, title: "课堂创新", desc: "AI专家与沉浸式体验，重新定义课堂" },
  { icon: Compass, title: "职业规划", desc: "动态规划未来，连接梦想与现实" },
  { icon: BarChart3, title: "智能分析", desc: "预测洞察，优化每一步学习" }
];

const portals = [
  {
    icon: Sparkles,
    title: "学生之旅",
    desc: "解锁你的专属学习路径，探索无限可能",
    color: "from-blue-500 to-blue-400",
    hover: "hover:from-blue-600 hover:to-blue-500",
    button: "进入学习中心",
    bgPattern: "radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%)",
    height: "h-[400px]",
    iconColor: "text-white",
    path: "/student"
  },
  {
    icon: TrendingUp,
    title: "家庭支持",
    desc: "实时掌握孩子成长，携手共创未来",
    color: "from-amber-500 to-amber-400",
    hover: "hover:from-amber-600 hover:to-amber-500",
    button: "进入家庭管家",
    bgPattern: "radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.1) 0%, transparent 20%)",
    height: "h-[400px]",
    iconColor: "text-white",
    path: "/parents"
  },
  {
    icon: Brain,
    title: "教学赋能",
    desc: "AI助力教学，释放你的教育创造力",
    color: "from-blue-900 to-blue-800",
    hover: "hover:from-blue-950 hover:to-blue-900",
    button: "进入教学控制台",
    bgPattern: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 20%)",
    height: "h-[400px]",
    iconColor: "text-white",
    path: "/teachers"
  }
];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Slideshow */}
        {slides.map((slide, index) => (
          <div
            key={slide.city}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-blue-900/50 z-10" />
            <img
              src={slide.url}
              alt={slide.city}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
        
        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 py-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Victory Synergy Pro
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6">
            AI驱动的新时代教育管理系统<br />
            定制化学习 · 体育艺术集成 · 未来升学规划
          </p>
          <button className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white px-6 py-3 rounded-full font-semibold text-base md:text-lg transition transform hover:scale-105 hover:shadow-lg">
            探索未来教育
          </button>
        </div>
      </div>

      {/* Login Portals */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">选择您的入口</h2>
            <p className="text-xl text-gray-600">为不同角色打造专属体验</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portals.map((portal) => (
              <div
                key={portal.title}
                className={`relative overflow-hidden rounded-2xl ${portal.height} p-8 bg-gradient-to-b ${portal.color} transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer`}
                onClick={() => navigate(portal.path)}
              >
                {/* Icon */}
                <div className="relative z-10">
                  <portal.icon className="w-16 h-16 mb-6 text-white transform transition-transform duration-500 group-hover:scale-110" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-4">{portal.title}</h3>
                  <p className="text-white text-opacity-90 mb-8 flex-grow text-lg">{portal.desc}</p>
                  <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full py-3 px-6 text-white font-medium transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2">
                    {portal.button}
                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">核心功能</h2>
            <p className="text-xl text-gray-600">打造全方位的智慧教育生态系统</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Promise */}
      <div className="py-20 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            我们致力于打造AI时代的全人教育
          </h2>
          <p className="text-xl text-white/90">
            让每位学生成为未来的引领者
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            加入 Victory Synergy Pro
          </h2>
          <p className="text-xl text-gray-600 mb-8">开启你的教育未来</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition transform hover:scale-105">
              立即体验
            </button>
            <button className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition hover:bg-gray-100">
              了解更多
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Victory AI Academy</h3>
            <p className="text-gray-400">AI驱动的精英教育新纪元</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">关于我们</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">公司介绍</a></li>
              <li><a href="#" className="hover:text-white">团队成员</a></li>
              <li><a href="#" className="hover:text-white">加入我们</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">功能概览</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">个性化学习</a></li>
              <li><a href="#" className="hover:text-white">家庭协同</a></li>
              <li><a href="#" className="hover:text-white">教师赋能</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">联系我们</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">客户支持</a></li>
              <li><a href="#" className="hover:text-white">商务合作</a></li>
              <li><a href="#" className="hover:text-white">隐私政策</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}


// Create placeholder components for your routes
function StudentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">学生中心</h1>
        <p className="text-lg text-gray-700">这里是学生专属的学习空间</p>
      </div>
    </div>
  );
}

function ParentsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-amber-600 mb-4">家庭管家</h1>
        <p className="text-lg text-gray-700">帮助家长掌握孩子的学习进度</p>
      </div>
    </div>
  );
}

function TeachersPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">教学控制台</h1>
        <p className="text-lg text-gray-700">教师专属的教学管理平台</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/student" element={<StudentPage />} />
      <Route path="/parents" element={<ParentsPage />} />
      <Route path="/teachers" element={<TeachersPage />} />
    </Routes>
  );
}

export default App;