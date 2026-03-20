# Hồ sơ đất đai

Web app React + Vite để nhập thông tin hồ sơ đất đai, xem trước nội dung văn bản và xuất file Word theo mẫu `.docx` có sẵn.

Hiện app đang hỗ trợ 4 mẫu:

- `Văn bản miễn giảm thuế TNCN`
- `Văn bản thỏa thuận phân chia di sản thừa kế`
- `Hợp đồng ủy quyền`
- `Đơn đăng ký biến động đất đai`

## Cách chạy local

```powershell
npm install
npm run dev
```

Mở địa chỉ Vite trả về, thường là `http://localhost:5173`.

## Deploy lên GitHub Pages

Project đã được cấu hình để deploy bằng **GitHub Actions**. Không cần chạy `gh-pages` từ máy local.

### 1. Tạo repository GitHub

Ví dụ:

- `land-doc-tool`

### 2. Đưa code lên GitHub

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<github-username>/<repo-name>.git
git push -u origin main
```

### 3. Bật GitHub Pages

Vào:

- `Settings`
- `Pages`

Chọn:

- `Build and deployment`
- `Source: GitHub Actions`

### 4. Deploy

Sau khi push lên nhánh `main`, workflow sẽ tự build và publish.

Link truy cập sẽ là:

```text
https://<github-username>.github.io/<repo-name>/
```

## Lưu ý base path khi deploy

App dùng `vite.config.js` để tự lấy tên repo từ biến `GITHUB_REPOSITORY`.

Nếu bạn đổi tên repo hoặc muốn build thủ công với base path khác, có thể dùng:

```powershell
$env:VITE_BASE_PATH="<repo-name>"
npm run build
```

## Cấu trúc chính

- `public/templates/`: file mẫu `.docx`
- `src/schemas/`: schema dữ liệu cho từng mẫu
- `src/components/`: UI nhập liệu và xem trước
- `src/utils/buildTemplatePayload.js`: map dữ liệu form sang tag trong template
- `src/utils/generateDoc.js`: render `.docx` bằng `docxtemplater`
- `src/uiLabels.js`: tên hiển thị tiếng Việt cho end user

## Cách thêm file đỏ mới

Khi có một mẫu Word mới với các phần màu đỏ cần thay dữ liệu, làm theo đúng các bước sau.

### Bước 1. Đưa template vào thư mục public

Copy file `.docx` vào:

- `public/templates/<ten_template>.docx`

Ví dụ:

- `public/templates/tang_cho.docx`

### Bước 2. Gắn tag vào template Word

Trong file `.docx`, thay phần đỏ bằng tag của `docxtemplater`.

Field đơn:

```text
{ho_ten}
{so_cccd}
{ngay_cap}
```

Field lặp:

```text
{#ds_nguoi}
{xung_ho}: {ho_ten}, ngày sinh {ngay_sinh}, CCCD số {so_cccd}
{/ds_nguoi}
```

Quy tắc:

- Tag trong template phải trùng tuyệt đối với key trong payload.
- Không để tag cũ, tag thừa hoặc tag hardcode bị lẫn trong template.
- Với block lặp, mỗi người nên là một block paragraph sạch, không vá XML thủ công theo index.

### Bước 3. Tạo schema dữ liệu

Tạo file mới:

- `src/schemas/<ten_template>.js`

Ví dụ:

```js
export default {
  ho_ten: "",
  so_cccd: "",
  ngay_cap: "",
  noi_dung: "",
  ds_nguoi: [
    {
      xung_ho: "",
      ho_ten: "",
      ngay_sinh: "",
      so_cccd: ""
    }
  ]
};
```

### Bước 4. Register schema trong app

Import schema vào:

- `src/App.jsx`

Thêm vào object `schemas`:

```js
import tangCho from "./schemas/tang_cho";

const schemas = {
  ...,
  tang_cho: tangCho
};
```

### Bước 5. Thêm tên hiển thị cho người dùng

Sửa:

- `src/uiLabels.js`

Thêm vào:

- `TEMPLATE_LABELS`
- `FIELD_LABELS`
- `ARRAY_LABELS`
- `ARRAY_ACTION_LABELS` nếu có bảng lặp

Ví dụ:

```js
export const TEMPLATE_LABELS = {
  ...,
  tang_cho: "Hợp đồng tặng cho"
};
```

### Bước 6. Cho template xuất hiện trong dropdown

Sửa:

- `src/components/TemplateSelector.jsx`

Thêm option:

```js
{ value: "tang_cho", label: getTemplateLabel("tang_cho") }
```

### Bước 7. Map dữ liệu sang payload render

Sửa:

- `src/utils/buildTemplatePayload.js`

Thêm nhánh xử lý cho template mới.

Ví dụ:

```js
if (type === "tang_cho") {
  return {
    ho_ten: data.ho_ten,
    so_cccd: data.so_cccd,
    ngay_cap: data.ngay_cap,
    noi_dung: data.noi_dung,
    ds_nguoi: data.ds_nguoi
  };
}
```

### Bước 8. Thêm preview bên phải

Sửa:

- `src/components/DocumentPreview.jsx`

Tạo component preview riêng cho template mới rồi thêm vào map:

```jsx
tang_cho: <TangChoPreview data={data} />
```

### Bước 9. Kiểm tra tag

Trước khi dùng thật, phải kiểm tra:

- tất cả tag trong `.docx` đều có trong payload
- không còn tag `undefined`
- không còn field hardcode cũ trong template
- loop render nhiều dòng không phá layout

## Checklist khi thêm mẫu mới

1. File `.docx` đã nằm trong `public/templates/`
2. Schema mới đã tạo trong `src/schemas/`
3. `App.jsx` đã register schema
4. `TemplateSelector.jsx` đã có option
5. `uiLabels.js` đã có tên tiếng Việt
6. `buildTemplatePayload.js` đã map payload đúng tag
7. `DocumentPreview.jsx` đã có preview
8. Xuất thử `.docx` mở được bằng Word
9. Tag loop không làm vỡ layout

## Workflow deploy

File workflow nằm tại:

- `.github/workflows/deploy.yml`

Mỗi lần push lên `main`, GitHub Actions sẽ:

1. cài dependency
2. build app
3. publish lên GitHub Pages
