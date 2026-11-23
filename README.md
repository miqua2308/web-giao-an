# Bài 1 · Hệ điều hành (Tin học 11)

Bài học tương tác: giải thích dễ hiểu, 3 mô hình 3D, câu hỏi trắc nghiệm theo từng phần, 4 trò chơi và bài kiểm tra cuối bài.

Nội dung dựa trên giáo án "Bài 1.pptx" (Tin học 11, Chủ đề 1: Máy tính và xã hội tri thức).

## Chạy trên máy

Mở `index.html` bằng trình duyệt. Lần đầu cần mạng để tải thư viện 3D (Three.js) và font chữ.

## Sửa nội dung

Toàn bộ câu hỏi và dữ liệu trò chơi nằm trong `js/data.js`. Mỗi mục ghi rõ slide nguồn.

## Kiểm tra

```
node scripts/check.mjs
```

Kiểm tra cú pháp JS, các tệp được tham chiếu, đáp án câu hỏi và dữ liệu trò chơi.

## Triển khai

Mỗi lần đẩy lên nhánh `main`, GitHub Actions chạy kiểm tra rồi tự triển khai lên GitHub Pages
(xem `.github/workflows/deploy.yml`). Pull request chỉ chạy bước kiểm tra.
