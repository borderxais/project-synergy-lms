export const studentData = {
  name: '张小明',
  grade: '高二（3）班',
  attendance: 98,
  academicScore: 87,
  behaviorScore: 92,
  mentalHealth: 85,
  nextExam: '期中数学测试 (3月25日)',
  upcomingEvents: [
    '家长会 (3月20日)',
    '春季运动会 (3月30日)',
    '艺术节表演 (4月5日)'
  ]
};

export const notifications = [
  {
    id: '1',
    title: '数学测验成绩已出：92分',
    type: 'academic',
    time: '今天 14:30',
    read: false
  },
  {
    id: '2',
    title: '本周行为表现优秀',
    type: 'behavior',
    time: '昨天 16:45',
    read: true
  },
  {
    id: '3',
    title: '请及时确认参加家长会',
    type: 'event',
    time: '昨天 09:15',
    read: false
  }
];

export const academicTrends = [
  { subject: '数学', current: 92, previous: 88 },
  { subject: '语文', current: 88, previous: 85 },
  { subject: '英语', current: 95, previous: 90 },
  { subject: '物理', current: 86, previous: 82 }
];

export const parentReminders = [
  {
    id: 1,
    title: '月考成绩家长会',
    date: '2025-04-10 19:00',
    location: '学校多功能厅',
    description: '请准时参加本学期第一次月考后的家长会，老师将分析考试情况并提供个性化学习建议。'
  },
  {
    id: 2,
    title: '数学辅导课程建议',
    date: '2025-04-02 - 2025-05-30',
    location: '线上/线下结合',
    description: '基于最近的测验情况，建议参加数学解题思路专题课程，可以帮助提高数学应用题解题能力。'
  },
  {
    id: 3,
    title: '心理健康讲座',
    date: '2025-04-15 14:30',
    location: '学校报告厅',
    description: '针对高考前的心理调适，学校组织专家讲座，建议家长与学生一同参加。'
  }
];

export const subjectDetails = {
  '数学': {
    teacher: '王老师',
    recentScore: 92,
    homework: [
      { id: 1, title: '三角函数练习题', date: '3月22日', status: 'completed', score: 95 },
      { id: 2, title: '概率统计作业', date: '3月18日', status: 'completed', score: 88 },
      { id: 3, title: '立体几何习题', date: '3月15日', status: 'completed', score: 92 },
      { id: 4, title: '函数图像分析', date: '3月10日', status: 'completed', score: 90 }
    ],
    wrongProblems: [
      { id: 1, question: '已知sin(α)=0.6，求cos(2α)的值。', answer: '0.28', userAnswer: '0.64', date: '3月18日' },
      { id: 2, question: '在球O中，点P到球心O的距离为2，点P到球面的最短距离是1，求球的半径。', answer: '3', userAnswer: '√5', date: '3月15日' },
      { id: 3, question: '已知f(x)=x²-2x+1，求f(x)的最小值。', answer: '0', userAnswer: '1', date: '3月10日' }
    ]
  },
  '语文': {
    teacher: '李老师',
    recentScore: 88,
    homework: [
      { id: 1, title: '古文阅读理解', date: '3月21日', status: 'completed', score: 90 },
      { id: 2, title: '现代文写作', date: '3月17日', status: 'completed', score: 85 },
      { id: 3, title: '诗词鉴赏', date: '3月14日', status: 'completed', score: 92 }
    ],
    wrongProblems: [
      { id: 1, question: '下列词语中加点字的读音完全正确的一项是（ ）', answer: 'C', userAnswer: 'B', date: '3月17日' },
      { id: 2, question: '下列句子中没有语病的一项是（ ）', answer: 'D', userAnswer: 'A', date: '3月14日' }
    ]
  },
  '英语': {
    teacher: '张老师',
    recentScore: 95,
    homework: [
      { id: 1, title: '完形填空练习', date: '3月23日', status: 'pending', score: null },
      { id: 2, title: '阅读理解作业', date: '3月19日', status: 'completed', score: 96 },
      { id: 3, title: '英语写作', date: '3月16日', status: 'completed', score: 92 }
    ],
    wrongProblems: [
      { id: 1, question: 'She _____ in this company for five years before she moved to another city.', answer: 'had worked', userAnswer: 'has worked', date: '3月16日' }
    ]
  },
  '物理': {
    teacher: '赵老师',
    recentScore: 86,
    homework: [
      { id: 1, title: '电磁学练习题', date: '3月20日', status: 'completed', score: 88 },
      { id: 2, title: '力学计算题', date: '3月16日', status: 'completed', score: 85 },
      { id: 3, title: '波动光学作业', date: '3月13日', status: 'completed', score: 80 }
    ],
    wrongProblems: [
      { id: 1, question: '电荷量为q的粒子，在电场强度为E的匀强电场中运动，则粒子所受电场力大小为多少？', answer: 'qE', userAnswer: 'qE/2', date: '3月20日' },
      { id: 2, question: '质量为m的物体以速度v撞上静止的质量为2m的物体，若为完全弹性碰撞，则碰撞后第一个物体的速度为多少？', answer: '-v/3', userAnswer: '-v/2', date: '3月16日' },
      { id: 3, question: '一束单色光从空气射入某介质中，若折射角为30°，入射角为45°，则该介质的折射率为多少？', answer: '√2', userAnswer: '√3/2', date: '3月13日' }
    ]
  }
};

export const schoolActivities = [
  {
    id: 1,
    title: '家长开放日',
    date: '2025-04-15',
    time: '09:00 - 16:00',
    location: '校园各教学区',
    type: 'open-day',
    description: '欢迎家长走进校园，参观教学环境，了解学生在校学习生活情况。活动包括班级教学展示、学生作品展览和教师交流会。',
    registrationRequired: true,
    registrationDeadline: '2025-04-10'
  },
  {
    id: 2,
    title: '家长教育讲座',
    date: '2025-04-22',
    time: '19:00 - 21:00',
    location: '学校报告厅',
    type: 'lecture',
    description: '邀请知名教育专家主讲"如何帮助高中生建立良好学习习惯"，为家长提供实用的指导和建议。',
    registrationRequired: true,
    registrationDeadline: '2025-04-20'
  },
  {
    id: 3,
    title: '学校艺术节',
    date: '2025-04-28',
    time: '14:00 - 17:00',
    location: '学校礼堂',
    type: 'performance',
    description: '展示学生在音乐、舞蹈、戏剧等方面的才艺。您的孩子将参与合唱团表演，请准时到场支持。',
    registrationRequired: false
  },
  {
    id: 4,
    title: '科学实验展',
    date: '2025-05-10',
    time: '13:30 - 16:30',
    location: '科学楼实验室',
    type: 'exhibition',
    description: '学生将展示他们的科学实验项目，展示内容涵盖物理、化学、生物等多个学科领域。',
    registrationRequired: false
  },
  {
    id: 5,
    title: '毕业生升学经验分享会',
    date: '2025-05-15',
    time: '18:30 - 20:30',
    location: '多功能厅',
    type: 'lecture',
    description: '往届优秀毕业生回校分享高考备考和升学经验，帮助学生和家长了解重点大学录取要求和考试技巧。',
    registrationRequired: true,
    registrationDeadline: '2025-05-13'
  },
  {
    id: 6,
    title: '春季运动会',
    date: '2025-05-20',
    time: '全天',
    location: '学校操场',
    type: 'sports',
    description: '一年一度的春季运动会，学生将参加多项体育赛事。欢迎家长到场观看并为学生加油。',
    registrationRequired: false
  }
];

export const volunteerOpportunities = [
  {
    id: 1,
    title: '班级读书角维护',
    date: '长期',
    time: '每周1-2小时',
    location: '学生班级',
    spotsAvailable: 5,
    description: '帮助班级整理和维护读书角，包括图书分类、借阅管理和定期更新图书资源。适合喜欢阅读并有一定组织能力的家长。',
    requirements: '熟悉图书分类，有耐心，每月至少能参与4小时。'
  },
  {
    id: 2,
    title: '校园安全巡逻',
    date: '2025-04-01至2025-06-30',
    time: '每周一、三、五 07:30-08:30',
    location: '校园各入口',
    spotsAvailable: 10,
    description: '协助学校在早上入校高峰期维持秩序，确保学生安全入校。志愿者将在校门口引导交通，协助学生过马路。',
    requirements: '有责任心，能够准时参与，理解基本的交通安全规则。'
  },
  {
    id: 3,
    title: '科学实验展辅助',
    date: '2025-05-10',
    time: '13:00-17:00',
    location: '科学楼实验室',
    spotsAvailable: 8,
    description: '协助科学实验展的组织工作，包括场地布置、秩序维持和活动后的清理工作。可以近距离接触各类有趣的科学实验。',
    requirements: '对科学有基本了解，能够在活动期间全程参与。'
  },
  {
    id: 4,
    title: '图书馆整理志愿者',
    date: '长期',
    time: '弹性安排',
    location: '学校图书馆',
    spotsAvailable: 6,
    description: '协助图书馆管理员整理书籍，上架新书，帮助学生查找资料等。这是一个体验学校学习资源的好机会。',
    requirements: '喜爱阅读，熟悉图书分类系统，有耐心指导学生。'
  },
  {
    id: 5,
    title: '学生课外辅导',
    date: '长期',
    time: '每周二、四 16:00-17:30',
    location: '教学楼辅导室',
    spotsAvailable: 12,
    description: '为需要帮助的学生提供课后辅导，主要科目包括数学、英语和物理。志愿者可以根据自己的专长选择辅导科目。',
    requirements: '相关科目有良好基础，有耐心，善于与青少年沟通。'
  },
  {
    id: 6,
    title: '春季运动会工作人员',
    date: '2025-05-20',
    time: '08:00-17:00',
    location: '学校操场',
    spotsAvailable: 20,
    description: '协助春季运动会的组织工作，包括项目引导、成绩记录、后勤保障等。全天活动，提供午餐。',
    requirements: '身体健康，能够长时间户外工作，熟悉基本体育赛事流程为佳。'
  }
];

export const schoolNotices = [
  {
    id: 1,
    title: '学校食堂菜单更新',
    date: '2025-03-30',
    category: 'campus',
    content: '从下周一开始，学校食堂将提供新的春季菜单，增加更多新鲜蔬果选择。所有菜单都经过营养师评估，确保学生获得均衡的营养。新菜单已发布在食堂公告栏和学校官网。'
  },
  {
    id: 2,
    title: '校园安全月活动公告',
    date: '2025-04-01',
    category: 'activity',
    content: '四月是我校安全月，将举办一系列安全教育活动，包括消防演习、交通安全知识讲座和应急救援培训。请各位家长鼓励学生积极参与，共同提高安全意识。'
  },
  {
    id: 3,
    title: '期末考试时间安排',
    date: '2025-04-10',
    category: 'exam',
    content: '本学期期末考试将于6月10日至14日进行，具体科目安排将于5月底公布。请家长督促学生合理安排复习时间，做好考试准备。考试期间，学校将实行封闭管理。'
  },
  {
    id: 4,
    title: '校园基础设施维护通知',
    date: '2025-04-15',
    category: 'campus',
    content: '学校将于本月20日至22日对体育馆和图书馆进行设施维护。这段时间内，这些区域将暂停使用。我们将尽量减少影响，确保学生的正常学习生活。'
  },
  {
    id: 5,
    title: '教师专业发展日安排',
    date: '2025-04-20',
    category: 'schedule',
    content: '4月25日为教师专业发展日，全校停课一天。学生不需到校，但会布置适量居家学习任务。请家长知悉并合理安排孩子的学习和休息。'
  },
  {
    id: 6,
    title: '高考百日冲刺动员大会',
    date: '2025-04-21',
    category: 'event',
    content: '学校将于3月1日举行高考百日冲刺动员大会，高三全体学生和家长需参加。会议将分享备考策略、心理调适方法以及最新的高考政策解读。'
  },
  {
    id: 7,
    title: '学校运动队选拔通知',
    date: '2025-04-25',
    category: 'sports',
    content: '下月初将进行校足球队、篮球队和田径队的选拔，有意向的学生请向体育教师报名。入选学生将代表学校参加市级比赛，并享受训练期间的课程调整。'
  },
  {
    id: 8,
    title: '校园网络系统升级公告',
    date: '2025-04-28',
    category: 'campus',
    content: '为提升教学质量和信息安全，学校将于5月5日升级校园网络系统。升级期间（预计2小时）校园网络将暂停服务，请师生提前做好准备。'
  }
];