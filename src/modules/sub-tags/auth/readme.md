🎯 Task: Thêm Cache và Queue xử lý email vào API tạo user
🧩 Bối cảnh
Bạn đang làm API quản lý người dùng. Khi tạo user mới (POST /users), hệ thống sẽ:

Gửi email chào mừng (sử dụng queue).

Trả về thông tin user.

Dùng cache để lưu danh sách user để trả nhanh hơn trong lần gọi /users kế tiếp.

✅ Yêu cầu chính
1. Queue (sử dụng BullMQ)
Cài đặt và config BullMQ trong NestJS.

Tạo queue welcome-email.

Khi user được tạo thành công, push job gửi email chào mừng vào queue.

Viết processor (consumer) để xử lý queue và "giả lập" gửi email (console.log).

2. Cache (sử dụng @nestjs/cache-manager)
Cấu hình CacheModule trong AppModule.

Khi gọi GET /users, nếu có cache thì trả từ cache, nếu không thì lấy từ database (mock DB cũng được), sau đó lưu cache trong 30s.

Khi user mới được tạo (POST /users), xóa cache của /users.

⚙️ Tech stack yêu cầu
NestJS

@nestjs/bullmq hoặc bull (tuỳ bạn setup)

@nestjs/cache-manager

Redis (dùng local Redis hoặc Docker)

🧠 Gợi ý học tập
Intern cần đọc docs về @nestjs/cache-manager và @nestjs/bull / @nestjs/bullmq.

Bonus: Gợi ý cách sử dụng decorator @Cacheable() hoặc viết interceptor cho cache logic.