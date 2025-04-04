import React from 'react';
import { Student } from '../../types/student';

interface AchievementsProps {
  student?: Student | null;
  onUpdate?: (updates: Partial<Student>) => void;
}

const Achievements: React.FC<AchievementsProps> = ({ student, onUpdate }) => {
  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading achievements data...</p>
      </div>
    );
  }

  // Group achievements by type
  const researchAchievements = student.achievements.filter(achievement => 
    achievement.type === 'research' || achievement.type === 'publication'
  );

  const academicAchievements = student.achievements.filter(achievement =>
    achievement.type === 'academic' || achievement.type === 'course'
  );

  const awardAchievements = student.achievements.filter(achievement =>
    achievement.type === 'award' || achievement.type === 'recognition'
  );

  return (
    <div className="space-y-6">
      {/* Research & Publications */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Research & Publications 研究和出版物</h2>
        <div className="space-y-4">
          {researchAchievements.length > 0 ? (
            researchAchievements.map((achievement, idx) => (
              <div key={`${achievement.title}-${idx}`} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    {achievement.date && (
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {achievement.tags && achievement.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {achievement.tags.map((tag, tagIdx) => (
                        <span
                          key={`${tag}-${tagIdx}`}
                          className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No research achievements yet</p>
          )}
        </div>
      </div>

      {/* Academic Excellence */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Academic Excellence 学术成就</h2>
        <div className="space-y-4">
          {academicAchievements.length > 0 ? (
            academicAchievements.map((achievement, idx) => (
              <div key={`${achievement.title}-${idx}`} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    {achievement.date && (
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {achievement.grade && (
                    <span className={`px-2 py-1 text-xs font-medium ${
                      achievement.grade === 'A+' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    } rounded`}>
                      {achievement.grade}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No academic achievements yet</p>
          )}
        </div>
      </div>

      {/* Awards & Recognition */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Awards & Recognition 奖项和认可</h2>
        <div className="space-y-4">
          {awardAchievements.length > 0 ? (
            awardAchievements.map((achievement, idx) => (
              <div key={`${achievement.title}-${idx}`} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    {achievement.date && (
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {achievement.level && (
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                      {achievement.level}
                    </span>
                  )}
                </div>
                {achievement.tags && achievement.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {achievement.tags.map((tag, tagIdx) => (
                      <span
                        key={`${tag}-${tagIdx}`}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No awards or recognition yet</p>
          )}
        </div>
      </div>

      {/* Achievement Timeline */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Achievement Timeline 成就时间线</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6 relative">
            {student.achievements
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((achievement, idx) => (
                <div key={`timeline-${idx}`} className="ml-12 relative">
                  <div className={`absolute -left-8 top-2 w-4 h-4 rounded-full ${
                    achievement.type === 'award' ? 'bg-purple-500' :
                    achievement.type === 'academic' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(achievement.date).toLocaleDateString()}
                    </div>
                    <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;