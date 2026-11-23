/*
 * DỮ LIỆU BÀI HỌC — Tin học 11, Chủ đề 1, Bài 1: Hệ điều hành
 * Nguồn: giao an/Bài 1.pptx (số slide ghi trong trường "src").
 * Thầy cô sửa câu hỏi / trò chơi tại đây, không cần đụng vào app.js.
 *
 * Quy ước câu hỏi trắc nghiệm:
 *   q: câu hỏi, options: các lựa chọn, answer: chỉ số đáp án đúng (đếm từ 0),
 *   explain: giải thích hiện ra sau khi chọn.
 */
window.LESSON = {
  title: "Bài 1: Hệ điều hành",
  topic: "Chủ đề 1: Máy tính và xã hội tri thức",
  subject: "Tin học 11",

  /* ---------- CÂU HỎI THEO TỪNG PHẦN ---------- */
  quizzes: {
    p1: [
      {
        src: "Slide 9",
        q: "Đâu KHÔNG phải là một nhóm chức năng của hệ điều hành?",
        options: [
          "Quản lí thiết bị",
          "Quản lí việc lưu trữ dữ liệu",
          "Soạn thảo nội dung bài thuyết trình",
          "Là môi trường để chạy các ứng dụng"
        ],
        answer: 2,
        explain: "Soạn bài thuyết trình là việc của phần mềm ứng dụng (như PowerPoint). Hệ điều hành chỉ tạo môi trường để phần mềm đó chạy."
      },
      {
        src: "Slide 9, 20",
        q: "Hai nhóm chức năng nào thể hiện rõ nhất đặc thù của hệ điều hành máy tính cá nhân?",
        options: [
          "Quản lí thiết bị và quản lí lưu trữ",
          "Giao tiếp với người dùng và cung cấp tiện ích",
          "Quản lí lưu trữ và chạy ứng dụng",
          "Quản lí thiết bị và chạy ứng dụng"
        ],
        answer: 1,
        explain: "Máy tính cá nhân phục vụ một người dùng, nên nó phải thân thiện, dễ dùng và có nhiều tiện ích cá nhân."
      },
      {
        src: "Slide 10",
        q: "Giao diện đồ họa và cơ chế \"plug & play\" thể hiện khuynh hướng phát triển nào?",
        options: [
          "Thân thiện và tăng cường tiện ích",
          "Giảm giá thành máy tính",
          "Tăng tốc độ của CPU",
          "Giảm dung lượng bộ nhớ"
        ],
        answer: 0,
        explain: "Hai khuynh hướng chính là thân thiện và tăng cường tiện ích. Giao diện đồ họa và plug & play là ví dụ của hai khuynh hướng này."
      },
      {
        src: "Slide 13, 14",
        q: "Phiên bản Windows nào được nhắc là một trong các hệ điều hành thành công nhất của Microsoft?",
        options: ["Phiên bản 1", "Windows 95", "Windows XP", "Windows 8"],
        answer: 2,
        explain: "Windows XP có số người dùng rất lớn và đến nay vẫn được nhiều người tin dùng."
      }
    ],
    p2: [
      {
        src: "Slide 23",
        q: "Đâu là một đặc trưng của hệ điều hành cho thiết bị di động?",
        options: [
          "Chỉ dùng để nghe và gọi điện",
          "Khả năng kết nối mạng không dây",
          "Bắt buộc phải có chuột và bàn phím",
          "Không có tiện ích cá nhân"
        ],
        answer: 1,
        explain: "Thiết bị di động đi theo người dùng khắp nơi, nên cần kết nối không dây (3G, 4G, 5G, wifi, bluetooth)."
      },
      {
        src: "Slide 25",
        q: "Hai hệ điều hành phổ biến cho thiết bị di động là:",
        options: ["Windows và LINUX", "Android và iOS", "UNIX và Windows XP", "iOS và Windows 95"],
        answer: 1,
        explain: "Android và iOS là hai hệ điều hành di động phổ biến được nêu trong bài."
      },
      {
        src: "Slide 24",
        q: "Nhờ đâu giao diện của hệ điều hành di động đặc biệt thân thiện?",
        options: [
          "Nhờ có nhiều cổng cắm thiết bị",
          "Nhờ nhận dạng hành vi người dùng qua các cảm biến",
          "Nhờ màn hình rất lớn",
          "Nhờ chỉ chạy được một ứng dụng"
        ],
        answer: 1,
        explain: "Các cảm biến giúp máy \"hiểu\" người dùng đang làm gì, ví dụ biết khi em xoay ngang máy."
      },
      {
        src: "Slide 26",
        q: "Vì sao hệ điều hành di động ưu tiên cao cho giao tiếp thân thiện?",
        options: [
          "Vì thiết bị di động chỉ dành cho chuyên gia",
          "Vì thân thiện, dễ dùng giúp mọi người đều dùng được",
          "Vì thiết bị di động không có màn hình",
          "Vì thân thiện giúp máy chạy nhanh hơn"
        ],
        answer: 1,
        explain: "Thiết bị di động phổ biến vì có nhiều tiện ích. Muốn ai cũng dùng được thì phải dễ dùng."
      }
    ],
    p3: [
      {
        src: "Slide 30",
        q: "Thiết bị nào sau đây có thể chạy mà KHÔNG cần hệ điều hành?",
        options: ["Máy tính cá nhân", "Điện thoại thông minh", "Lò vi sóng", "Tivi thông minh"],
        answer: 2,
        explain: "Lò vi sóng chỉ làm vài việc cố định. Chương trình được ghi sẵn trong ROM, bật lên là chạy."
      },
      {
        src: "Slide 31, 32",
        q: "Trong sơ đồ quan hệ, hệ điều hành nằm ở vị trí nào?",
        options: [
          "Trên cùng, trên cả người dùng",
          "Giữa phần mềm ứng dụng và phần cứng",
          "Dưới cùng, dưới phần cứng",
          "Không liên quan đến phần cứng"
        ],
        answer: 1,
        explain: "Phần mềm ứng dụng khai thác phần cứng với sự trung gian của hệ điều hành."
      },
      {
        src: "Slide 32",
        q: "Hệ điều hành cùng phần cứng tạo ra thứ gì để người dùng sử dụng thuận lợi?",
        options: ["Một máy ảo", "Một ổ cứng mới", "Một virus", "Một mạng di động"],
        answer: 0,
        explain: "Hệ điều hành và phần cứng tạo ra một \"máy ảo\" có giao diện thuận lợi, người dùng không phải làm việc trực tiếp với linh kiện."
      },
      {
        src: "Slide 33",
        q: "Vì sao thiết bị xử lí đa năng cần có hệ điều hành?",
        options: [
          "Vì cần một môi trường chung để chạy nhiều ứng dụng khác nhau",
          "Vì hệ điều hành làm máy nhẹ hơn",
          "Vì không có hệ điều hành thì không bật được nguồn",
          "Vì hệ điều hành thay thế được CPU"
        ],
        answer: 0,
        explain: "Chạy nhiều ứng dụng thì phải quản lí lưu trữ, phối hợp thiết bị và có giao diện. Hệ điều hành lo tất cả việc đó."
      }
    ]
  },

  /* ---------- BÀI KIỂM TRA CUỐI BÀI (10 câu) ----------
     Câu 1–5 lấy nguyên từ phần củng cố của giáo án (slide 36–40). */
  finalTest: [
    {
      src: "Slide 36",
      q: "Quá trình hình thành và phát triển của hệ điều hành máy tính cá nhân có liên quan chặt chẽ đến tiêu chí nào sau đây?",
      options: ["Có nhiều tiện ích nâng cao", "Sự thân thiện, dễ sử dụng", "Điều khiển một cách tự động", "Tất cả đáp án trên"],
      answer: 1,
      explain: "Hệ điều hành máy tính cá nhân phát triển theo hướng ngày càng thân thiện, dễ sử dụng."
    },
    {
      src: "Slide 37",
      q: "Phát biểu nào sau đây đúng?",
      options: [
        "Cơ chế \"plug & play\" giúp hệ điều hành nhận biết các thiết bị ngoại vi ngay khi khởi động máy.",
        "Giao diện đồ họa có tính trực quan, giúp người dùng giao tiếp với máy tính dễ dàng.",
        "Một số hệ điều hành đã hỗ trợ giao tiếp bằng giọng nói.",
        "Tất cả đáp án trên"
      ],
      answer: 3,
      explain: "Cả ba phát biểu đều đúng."
    },
    {
      src: "Slide 38",
      q: "Cơ chế \"plug & play\" lần đầu tiên được sử dụng ở phiên bản nào của Windows?",
      options: ["Windows 95", "Phiên bản 1", "Phiên bản 3", "Windows XP"],
      answer: 0,
      explain: "Windows 95 là phiên bản đầu tiên dùng cơ chế plug & play."
    },
    {
      src: "Slide 39",
      q: "Hệ điều hành LINUX có nguồn gốc từ hệ điều hành nào dưới đây?",
      options: ["Windows XP", "UNIX", "Android", "iOS"],
      answer: 1,
      explain: "LINUX có nguồn gốc từ hệ điều hành UNIX."
    },
    {
      src: "Slide 40",
      q: "Đặc trưng quan trọng của hệ điều hành cho thiết bị di động là:",
      options: [
        "Không chỉ dùng để nghe, gọi mà còn được trang bị rất nhiều tiện ích cá nhân.",
        "Khả năng kết nối mạng không dây.",
        "Giao diện tiện lợi nhờ tích hợp nhiều cảm biến.",
        "Tất cả đáp án trên"
      ],
      answer: 3,
      explain: "Đây chính là 3 đặc trưng quan trọng nhất của hệ điều hành di động."
    },
    {
      src: "Slide 12",
      q: "Phiên bản nào của Windows bắt đầu có khả năng đa nhiệm?",
      options: ["Phiên bản 1", "Phiên bản 3", "Windows 7", "Windows 11"],
      answer: 1,
      explain: "Phiên bản 3 bắt đầu có khả năng đa nhiệm, có tính năng mới về giao diện và làm việc với mạng."
    },
    {
      src: "Slide 18",
      q: "Ngoài máy tính cá nhân, LINUX còn được dùng cho:",
      options: ["Máy chủ và thiết bị nhúng", "Chỉ điện thoại iPhone", "Chỉ lò vi sóng", "Không dùng cho thiết bị nào khác"],
      answer: 0,
      explain: "LINUX được dùng rộng rãi, còn dùng cho máy chủ và thiết bị nhúng."
    },
    {
      src: "Slide 34",
      q: "Các chương trình ứng dụng khai thác phần cứng bằng cách nào?",
      options: [
        "Điều khiển trực tiếp từng linh kiện",
        "Qua các dịch vụ của hệ điều hành",
        "Qua người dùng",
        "Không cần phần cứng"
      ],
      answer: 1,
      explain: "Hệ điều hành cung cấp các dịch vụ sử dụng phần cứng; ứng dụng dùng phần cứng qua các dịch vụ đó."
    },
    {
      src: "Slide 45",
      q: "Thiết bị gia dụng nào sau đây có sử dụng hệ điều hành?",
      options: ["Tivi thông minh", "Bóng đèn sợi đốt", "Quạt cơ", "Ấm đun nước thường"],
      answer: 0,
      explain: "Tivi thông minh, máy ảnh kĩ thuật số, đồng hồ thông minh đều có hệ điều hành."
    },
    {
      src: "Slide 43",
      q: "Kéo một tệp vào biểu tượng thùng rác để xóa là ví dụ cho tính chất nào của hệ điều hành?",
      options: ["Tính thân thiện", "Khả năng đa nhiệm", "Kết nối mạng di động", "Lưu trữ trong ROM"],
      answer: 0,
      explain: "Thao tác giống với đời thường (vứt rác vào thùng) nên dễ hiểu, dễ học. Đó là tính thân thiện."
    }
  ],

  /* ---------- TRÒ CHƠI 1: Phân loại chức năng (slide 3, 9, 44) ---------- */
  sortGame: {
    groups: [
      { id: "tb", name: "Quản lí thiết bị" },
      { id: "lt", name: "Quản lí lưu trữ dữ liệu" },
      { id: "ud", name: "Môi trường chạy ứng dụng" },
      { id: "gt", name: "Giao tiếp với người dùng" },
      { id: "ti", name: "Tiện ích nâng cao hiệu quả" }
    ],
    items: [
      { text: "Nhận ra chuột mới vừa cắm vào", group: "tb" },
      { text: "Điều khiển máy in in tài liệu", group: "tb" },
      { text: "Tổ chức tệp vào các thư mục", group: "lt" },
      { text: "Quản lí các tệp dữ liệu", group: "lt" },
      { text: "Khởi động ứng dụng khi nháy đúp vào biểu tượng", group: "ud" },
      { text: "Quản lí các phần mềm ứng dụng", group: "ud" },
      { text: "Hiển thị biểu tượng, cửa sổ, con trỏ chuột", group: "gt" },
      { text: "Cho phép ra lệnh bằng giọng nói", group: "gt" },
      { text: "Hỗ trợ sao lưu dữ liệu", group: "ti" },
      { text: "Phòng chống virus", group: "ti" }
    ]
  },

  /* ---------- TRÒ CHƠI 2: Dòng thời gian Windows (slide 12, 13, 16) ---------- */
  timelineGame: {
    // Thứ tự đúng từ cũ đến mới. "year" để trống khi giáo án không ghi năm.
    items: [
      { name: "Phiên bản 1", year: "1985", note: "Phiên bản đầu tiên" },
      { name: "Phiên bản 3", year: "", note: "Bắt đầu đa nhiệm, làm việc với mạng" },
      { name: "Windows 95", year: "", note: "Đầu tiên dùng plug & play" },
      { name: "Windows XP", year: "", note: "Rất thành công, nhiều người dùng" },
      { name: "Windows 7", year: "2009", note: "" },
      { name: "Windows 8", year: "2012", note: "" },
      { name: "Windows 10", year: "2015", note: "" },
      { name: "Windows 11", year: "2021", note: "Mới nhất tính đến 10/2021" }
    ]
  },

  /* ---------- TRÒ CHƠI 3: Ghép hệ điều hành với thiết bị (slide 18, 25, 30) ---------- */
  matchGame: {
    pairs: [
      { left: "Windows", right: "Máy tính cá nhân (thống trị thị trường)" },
      { left: "LINUX", right: "Máy chủ và thiết bị nhúng" },
      { left: "Android", right: "Điện thoại di động phổ biến" },
      { left: "iOS", right: "Điện thoại iPhone của Apple" },
      { left: "Chương trình ghi sẵn trong ROM", right: "Lò vi sóng (không cần hệ điều hành)" }
    ]
  },

  /* ---------- TRÒ CHƠI 4: Cần hệ điều hành không? (slide 30, 33, 45) ---------- */
  needOsGame: {
    items: [
      { name: "Máy tính cá nhân", img: "assets/img/may-tinh-minh-hoa.png", needs: true, why: "Chạy rất nhiều ứng dụng khác nhau nên cần hệ điều hành." },
      { name: "Lò vi sóng", img: "assets/img/lo-vi-song.jpg", needs: false, why: "Chỉ làm vài việc cố định, chương trình ghi sẵn trong ROM." },
      { name: "Tivi thông minh", img: "assets/img/tivi-thong-minh.jpg", needs: true, why: "Cài và chạy được nhiều ứng dụng nên có hệ điều hành." },
      { name: "Đồng hồ thông minh", img: "assets/img/dong-ho-thong-minh.jpg", needs: true, why: "Có nhiều tiện ích cá nhân, cần hệ điều hành quản lí." },
      { name: "Máy ảnh kĩ thuật số", img: "assets/img/may-anh-ki-thuat-so.jpg", needs: true, why: "Giáo án xếp máy ảnh kĩ thuật số vào nhóm thiết bị có hệ điều hành." },
      { name: "Điện thoại thông minh", img: "assets/img/android.png", needs: true, why: "Dùng Android hoặc iOS để chạy nhiều ứng dụng." }
    ]
  }
};
