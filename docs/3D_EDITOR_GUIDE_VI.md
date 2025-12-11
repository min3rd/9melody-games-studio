# Trình Chỉnh Sửa 3D cho Khung Cảnh Trang Chủ

Tính năng này cung cấp một trình chỉnh sửa 3D toàn diện để tạo và tùy chỉnh các khung cảnh 3D hiển thị trên trang chủ.

## Tổng Quan

Trình chỉnh sửa 3D nằm tại `/private/admin/3d-editor` và cung cấp giao diện chuyên nghiệp để quản lý các khung cảnh 3D với các tính năng sau:

### Tính Năng Chính

1. **Bảng Cấu Trúc Cảnh** (Thanh Bên Trái)
   - Xem tất cả các vật thể trong cảnh
   - Thêm vật thể mới (📦), ánh sáng (💡), hoặc nhóm (📁)
   - Chọn, đổi tên, hoặc xóa vật thể
   - Cấu trúc trực quan với biểu tượng

2. **Khung Nhìn 3D** (Trung Tâm)
   - Kết xuất 3D thời gian thực sử dụng React Three Fiber
   - Điều khiển camera tương tác:
     - **Xoay**: Click trái + kéo
     - **Di chuyển**: Click phải + kéo
     - **Phóng to**: Cuộn chuột
   - Lưới hỗ trợ tham chiếu không gian
   - Điều khiển biến đổi cho vật thể được chọn

3. **Bảng Thuộc Tính** (Thanh Bên Phải)
   - Chỉnh sửa thuộc tính vật thể:
     - **Biến Đổi**: Vị trí (X, Y, Z), Xoay (X, Y, Z), Tỉ lệ (X, Y, Z)
     - **Hình Thức**: Màu sắc, Chế độ khung dây (cho vật thể)
     - **Cài Đặt Ánh Sáng**: Cường độ, Màu sắc (cho ánh sáng)
   - Cập nhật thời gian thực trong khung nhìn

4. **Thư Viện Vật Thể** (Bảng Dưới)
   - Duyệt các vật thể 3D có sẵn
   - **Hình Cơ Bản**: Hộp, Cầu, Hình Trụ
   - **Thành Phần 3D**: Đảo, Cát, Đại Dương, Mây, Đá, Gió
   - Click vào vật thể để thêm vào cảnh
   - Chuyển đổi chế độ lưới/danh sách
   - Chức năng tìm kiếm

## Hướng Dẫn Sử Dụng

### Tạo Một Cảnh

1. **Truy Cập Trình Chỉnh Sửa**
   - Điều hướng đến `/private/admin/3d-editor` (yêu cầu xác thực admin)

2. **Thêm Vật Thể Vào Cảnh**
   - **Cách 1**: Click nút `+ 📦` trong Bảng Cấu Trúc
   - **Cách 2**: Click vào một vật thể trong bảng Thư Viện Vật Thể
   - Vật thể sẽ xuất hiện trong khung nhìn và cấu trúc

3. **Định Vị và Biến Đổi Vật Thể**
   - Click vào vật thể trong khung nhìn hoặc cấu trúc để chọn
   - Sử dụng Bảng Thuộc Tính để điều chỉnh:
     - Vị trí: Di chuyển vật thể trong không gian 3D
     - Xoay: Xoay vật thể quanh các trục X, Y, Z
     - Tỉ lệ: Thay đổi kích thước vật thể
   - Hoặc sử dụng điều khiển biến đổi trực tiếp trong khung nhìn (khi có sẵn)

4. **Tùy Chỉnh Hình Thức**
   - Chọn một vật thể
   - Trong Bảng Thuộc Tính, điều chỉnh:
     - **Màu Sắc**: Click bộ chọn màu để chọn màu
     - **Khung Dây**: Bật/tắt để hiển thị vật thể dạng khung dây

5. **Thêm Ánh Sáng**
   - Click `+ 💡` trong Bảng Cấu Trúc
   - Điều chỉnh vị trí và cường độ ánh sáng trong Bảng Thuộc Tính
   - Thay đổi màu ánh sáng cho hiệu ứng khác nhau

6. **Lưu Cảnh Của Bạn**
   - Click nút **💾 Lưu** trên thanh công cụ
   - Cấu hình cảnh được lưu vào localStorage của trình duyệt
   - Bạn sẽ thấy thông báo xác nhận

7. **Tải Cảnh Đã Lưu**
   - Click nút **📂 Tải** trên thanh công cụ
   - Cảnh đã lưu trước đó sẽ được khôi phục

### Xem Trên Trang Chủ

Cảnh 3D đã lưu sẽ tự động hiển thị trên trang chủ (`/`):

- Cảnh được tải từ cấu hình đã lưu
- Điều khiển tương tác được bật (người dùng có thể xoay và phóng to cảnh)
- Nếu không có cảnh nào được cấu hình, một cảnh mặc định với các hình cơ bản sẽ hiển thị

### Lưu Trữ Cảnh

- **Lưu Trữ**: Cấu hình cảnh hiện đang được lưu trong `localStorage` của trình duyệt
- **Khóa**: `homepage-scene-config`
- **Cấu Trúc Dữ Liệu**:
  ```json
  {
    "objects": [...],
    "objectData": {
      "objectId": {
        "id": "...",
        "name": "...",
        "type": "box|sphere|cylinder|light|...",
        "position": [x, y, z],
        "rotation": [x, y, z],
        "scale": [x, y, z],
        "color": "#hex",
        "wireframe": boolean,
        "intensity": number
      }
    },
    "timestamp": "ISO date string"
  }
  ```

### Cải Tiến Trong Tương Lai (Tiềm Năng)

- **Lưu Trữ**: Chuyển từ localStorage sang cơ sở dữ liệu/API để hỗ trợ nhiều người dùng
- **Tích Hợp Thành Phần 3D**: Tích hợp đầy đủ với Island3D, Sand3D, Ocean3D, v.v.
- **Điều Khiển Nâng Cao**:
  - Chức năng Hoàn tác/Làm lại
  - Sao chép/Dán vật thể
  - Quan hệ cha-con (nhóm)
  - Căn chỉnh theo lưới
- **Quản Lý Vật Thể**:
  - Tải lên mô hình 3D tùy chỉnh (.glb, .gltf)
  - Quản lý texture
  - Trình chỉnh sửa material
- **Tùy Chọn Xuất**:
  - Xuất cảnh dưới dạng JSON
  - Xuất dưới dạng file .glb
  - Chia sẻ cấu hình cảnh giữa người dùng

## Chi Tiết Kỹ Thuật

### Thành Phần

1. **Editor3DLayout** (`components/editor3d/Editor3DLayout.tsx`)
   - Thành phần layout chính
   - Quản lý trạng thái cảnh và dữ liệu vật thể
   - Điều phối giữa tất cả các bảng

2. **Scene3DObject** (`components/editor3d/Scene3DObject.tsx`)
   - Kết xuất từng vật thể 3D trong trình chỉnh sửa
   - Xử lý việc chọn vật thể
   - Tích hợp TransformControls để thao tác

3. **HomepageScene3D** (`components/HomepageScene3D/index.tsx`)
   - Hiển thị cảnh đã lưu trên trang chủ
   - Tải cấu hình từ localStorage
   - Kết xuất vật thể không có điều khiển trình chỉnh sửa

### Phụ Thuộc

- **@react-three/fiber**: Trình kết xuất React cho Three.js
- **@react-three/drei**: Công cụ hữu ích cho React Three Fiber
- **three**: Thư viện đồ họa 3D

### Loại Vật Thể Được Hỗ Trợ

- **Hình Cơ Bản**: `box`, `sphere`, `cylinder`
- **Ánh Sáng**: `light` (ánh sáng điểm với trực quan hóa)
- **Thành Phần Tùy Chỉnh** (dự kiến): `island`, `sand`, `ocean`, `cloud`, `rock`, `wind`

## Đa Ngôn Ngữ

Trình chỉnh sửa hỗ trợ nhiều ngôn ngữ:

- **Tiếng Anh** (`locales/en/editor3d.json`)
- **Tiếng Việt** (`locales/vi/editor3d.json`)

Tất cả văn bản UI được bản địa hóa và chuyển đổi dựa trên tùy chọn ngôn ngữ của người dùng.

## Khắc Phục Sự Cố

### Cảnh không lưu được
- Kiểm tra console của trình duyệt để tìm lỗi
- Đảm bảo localStorage được bật trong trình duyệt
- Thử xóa localStorage và tạo cảnh mới

### Vật thể không xuất hiện trong khung nhìn
- Kiểm tra vật thể có tọa độ vị trí hợp lệ
- Đảm bảo camera có thể nhìn thấy vật thể (điều chỉnh zoom/vị trí)
- Xác minh dữ liệu vật thể được lưu trữ đúng trong state

### Điều khiển biến đổi không hoạt động
- Đảm bảo vật thể được chọn đúng cách
- Kiểm tra vật thể có tham chiếu mesh
- Xác minh TransformControls được gắn kết đúng cách

## Tài Liệu Tham Khảo API

### Editor3DLayout Props

```typescript
interface Editor3DLayoutProps {
  translations: {
    viewport: { ... },
    hierarchy: { ... },
    properties: { ... },
    assets: { ... }
  };
}
```

### HomepageScene3D Props

```typescript
interface HomepageScene3DProps {
  className?: string;        // Các class CSS bổ sung
  enableControls?: boolean;  // Bật điều khiển camera (mặc định: false)
}
```

---

**Lưu ý**: Đây là phiên bản triển khai ban đầu. Trình chỉnh sửa cung cấp chức năng cốt lõi để tạo và quản lý cảnh 3D. Các tính năng và cải tiến bổ sung có thể được thêm vào dựa trên phản hồi và yêu cầu của người dùng.
