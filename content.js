window.blogContent = {
  site: {
    title: "Aertly",
    author: "Aertly"
  },


  posts: [
    {
      // 文章唯一标识
      // 会用于详情页链接：post.html?slug=night-train-letter
      slug: "night-train-letter",
      // 文章标题
      title: "施工中",
      // 文章分类
      category: "施工中",
      // 日期
      date: "2026-03-18",
      // 阅读时长
      readTime: "5 min",
      // 列表页摘要
      summary: "施工中",
      // 标签数组
      // 可自由增删，用于显示关键词
      tags: ["施工中", "施工中", "施工中"],
      // 详情页标题上方的小标题
      kicker: "施工中",
      // 详情页标题下方的引言
      intro: "施工中",
      // 正文分节数组
      // 每个 section 会渲染成一个小节
      sections: [
        {
          // 小节标题
          heading: "施工中",
          // 段落数组
          // 每一项都会渲染成一段正文
          paragraphs: [
            "施工中",
            "施工中"
          ]
        },
        {
          // 小节标题
          heading: "施工中",
          // 段落数组
          paragraphs: [
            "施工中",
            "施工中"
          ]
        }
      ]
    }
  ],



  projects: [
    {
      slug: "electrical-machine",
      // 笔记标题
      title: "电机学",
      // 当前状态，比如：施工中 / 连载中 / 完结
      status: "更新中",
      // 年份
      year: "2026",
      // 列表摘要
      description: "记录电机学学习过程中的笔记与若干总结",
      // 列表补充说明
      detail: "2026春季学期",
      // 详情页标题上方的小标题
      kicker: "时间与空间的耦合",
      // 详情页引言
      intro: "《电机学》作为电机系难度较大的课程之一，为了加深对课程的理解，于此处进行一些整理",
      // 正文分节数组
      sections: [
        {
          heading: "绕组、电动势与磁动势",
          paragraphs: [
            "不管是同步电机还是异步电机，都具有相似的定子与转子结构结构，二者最大的差别在于其绕组以及绕组的通电方式。"+
            "从电动势与磁动势的角度来分析时可以遵循一套相同的方法。即电机中的电动势均可以认为来自于旋转的磁动势。",
            "考虑一极对数为p的，转子以转速n(转/min)逆时针转动，定子为三相对称绕组的电机，我们将分为若干种情况进行分析，接下来的分析默认旋转磁动势的"+
            "正方向为逆时针，且仅仅考虑磁动势基波分量，谐波情况下只要注意极对数的变化即可。",
            "——————————",
            "转子励磁绕组通入直流电流，定子未通电流。这是一种很简单的情况，励磁绕组由于转子的旋转产生正转磁动势，且此磁动势转速为n,记为:"+
            "$$F_1=cos(\\alpha - \\omega t + \\phi_f)$$，其中$$\\omega=\\frac{p \\cdot n\\pi}{30}$$定子绕组因此产生响应的感应电动势，其频率为:$$f_1=\\frac{\\omega}{2\\pi}$$"+
            "定子绕组感应电流可记为:$$i_a=I_a cos(\\omega t - \\alpha +\\phi_i)$$简单分析可知，定子绕组又会产生一个正转的磁动势，且转速与转子相等，因此不会在励磁绕组中"+
            "产生感应电动势，我们的分析就到此为止，这也是这种情况简单的原因所在。",
            "——————————"
          ]
        },
        {
          // 小节标题
          heading: "施工中",
          // 小节段落
          paragraphs: [
            "施工中",
            "施工中"
          ]
        }
      ]
    }
  ],

  about: {
    motto: "まことに人生、一瞬の夢、ゴム風船の、美しさかな。",
    nickname: "Aertly",
    friendLinks: [
      { label: "GitHub", url: "https://github.com/Aer-tly" },
      { label: "Bangumi", url: "https://bgm.tv/user/aertly" },
      { label: "Bilibili", url: "https://space.bilibili.com/267637114" }
    ],
    introTitle: "这里是 Aertly。",
    introParagraphs: [
      "欢迎来到我的小站",
      "或许会在这里更新一些笔记或是对作品的感受与评价"
    ],
    basicTitle: "关于我",
    basicParagraphs: [
      "普通在读学生...",
      "这样就够了吧"
    ],
    hobbiesTitle: "标签",
    favorites: ["animation","galgame","EE","jrpg"]
  }
};
