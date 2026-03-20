import { getTemplateLabel } from "../uiLabels";

const TEXT = {
  nation: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
  motto: "Độc lập - Tự do - Hạnh phúc",
  previewTitle: "Xem trước văn bản",
  previewEmpty: "Chọn một mẫu hồ sơ để xem trước nội dung hiển thị ở đây.",
  mienGiamTitle: "VĂN BẢN ĐỀ NGHỊ MIỄN (GIẢM) THUẾ THU NHẬP CÁ NHÂN",
  thuaKeTitle: "VĂN BẢN THỎA THUẬN PHÂN CHIA DI SẢN THỪA KẾ",
  uyQuyenTitle: "HỢP ĐỒNG ỦY QUYỀN",
  bienDongTitle: "ĐƠN ĐĂNG KÝ BIẾN ĐỘNG ĐẤT ĐAI, TÀI SẢN GẮN LIỀN VỚI ĐẤT"
};

function filled(value, fallback = "....................") {
  if (value == null) {
    return fallback;
  }

  const text = String(value).trim();
  return text || fallback;
}

function lines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function MienGiamPreview({ data }) {
  return (
    <div className="doc-page">
      <p className="doc-center doc-strong">{TEXT.nation}</p>
      <p className="doc-center doc-strong">{TEXT.motto}</p>
      <p className="doc-right">
        {filled(data.phuong_xa, "X")}, ngày ...... tháng ...... năm ......
      </p>
      <h2 className="doc-center">{TEXT.mienGiamTitle}</h2>
      <p>Kính gửi: UBND xã {filled(data.phuong_xa, "X")}, tỉnh {filled(data.tinh_thanh)}.</p>
      <p>[01] Tên người nộp thuế: {filled(data.ten_nguoi_nop_thue)}</p>
      <p>[02] Mã số thuế: {filled(data.ma_so_thue)}</p>
      <p>
        [03a] Phường/xã: {filled(data.phuong_xa)}. [03b] Quận/huyện: {filled(data.quan_huyen)}.{" "}
        [03c] Tỉnh/thành phố: {filled(data.tinh_thanh)}.
      </p>
      <p>[04] Điện thoại: {filled(data.dien_thoai)}</p>
      <p className="doc-sign">Người nộp thuế hoặc đại diện hợp pháp của người nộp thuế</p>
      <p className="doc-sign-name">{filled(data.ten_nguoi_nop_thue)}</p>
    </div>
  );
}

function ThuaKePreview({ data }) {
  const people = Array.isArray(data.ds_nguoi_thua_ke) ? data.ds_nguoi_thua_ke : [];

  return (
    <div className="doc-page">
      <p className="doc-center doc-strong">{TEXT.nation}</p>
      <p className="doc-center doc-strong">{TEXT.motto}</p>
      <h2 className="doc-center">{TEXT.thuaKeTitle}</h2>
      <p>Địa điểm: Ủy ban nhân dân xã {filled(data.dia_diem_ubnd_xa)}.</p>
      <p>Chúng tôi gồm có:</p>
      {people.length ? (
        people.map((person, index) => (
          <div key={`${person.ho_ten}-${index}`} className="doc-block">
            <p>
              {index + 1}. {filled(person.xung_ho, "Ông/Bà")}: {filled(person.ho_ten)}, ngày sinh{" "}
              {filled(person.ngay_sinh)}, CCCD số {filled(person.so_cccd)}, cấp ngày{" "}
              {filled(person.ngay_cap)}, là {filled(person.quan_he)}.
            </p>
            <p>- Thường trú tại: {filled(person.dia_chi_thuong_tru)}.</p>
          </div>
        ))
      ) : (
        <p>Chưa có người thừa kế.</p>
      )}
      <p>
        Chúng tôi là những người thừa kế theo pháp luật của ông {filled(data.ten_cha_da_mat)} và bà{" "}
        {filled(data.ten_me_da_mat)}.
      </p>
      {lines(data.noi_dung_thua_ke).length ? (
        lines(data.noi_dung_thua_ke).map((line, index) => <p key={index}>{line}</p>)
      ) : (
        <p>{filled(data.noi_dung_thua_ke, "Nội dung thừa kế sẽ hiển thị tại đây.")}</p>
      )}
      <p className="doc-strong">Lời chứng chứng thực</p>
      <p>Tại UBND xã {filled(data.xa_chung_thuc)}.</p>
      <p>Tôi: {filled(data.nguoi_thuc_hien_chung_thuc)}.</p>
      <p>Người tiếp nhận hồ sơ: {filled(data.nguoi_tiep_nhan_ho_so)}.</p>
      <p>Cấp cho: {filled(data.nguoi_duoc_cap_ban)}.</p>
      <p>Số quyền chứng thực: {filled(data.so_quyen_chung_thuc)}.</p>
    </div>
  );
}

function UyQuyenPreview({ data }) {
  const benA = Array.isArray(data.ds_ben_a) ? data.ds_ben_a : [];
  const benB = Array.isArray(data.ds_ben_b) ? data.ds_ben_b : [];

  return (
    <div className="doc-page">
      <p className="doc-center doc-strong">{TEXT.nation}</p>
      <p className="doc-center doc-strong">{TEXT.motto}</p>
      <h2 className="doc-center">{TEXT.uyQuyenTitle}</h2>
      <p>Hôm nay, tại UBND xã {filled(data.dia_diem_lap_hop_dong)}, tỉnh Ninh Bình.</p>
      <p className="doc-strong">Chúng tôi gồm có:</p>
      <p className="doc-subtitle">BÊN ỦY QUYỀN (Bên A)</p>
      {benA.length ? (
        benA.map((person, index) => (
          <div key={`${person.ho_ten}-${index}`} className="doc-block">
            <p>
              {filled(person.xung_ho, "Ông/Bà")}: {filled(person.ho_ten)}
            </p>
            <p>Ngày sinh: {filled(person.ngay_sinh)}</p>
            <p>CCCD số: {filled(person.cccd)}, cấp ngày: {filled(person.ngay_cap)}.</p>
            <p>Nơi thường trú: {filled(person.dia_chi)}.</p>
          </div>
        ))
      ) : (
        <p>Chưa có dữ liệu bên ủy quyền.</p>
      )}

      <p className="doc-subtitle">BÊN ĐƯỢC ỦY QUYỀN (Bên B)</p>
      {benB.length ? (
        benB.map((person, index) => (
          <div key={`${person.ho_ten}-${index}`} className="doc-block">
            <p>
              {filled(person.xung_ho, "Ông/Bà")}: {filled(person.ho_ten)}
            </p>
            <p>Ngày sinh: {filled(person.ngay_sinh)}</p>
            <p>CCCD số: {filled(person.cccd)}, cấp ngày: {filled(person.ngay_cap)}.</p>
            <p>Nơi thường trú: {filled(person.dia_chi)}.</p>
          </div>
        ))
      ) : (
        <p>Chưa có dữ liệu bên được ủy quyền.</p>
      )}

      <p className="doc-strong">ĐIỀU 1: CĂN CỨ ỦY QUYỀN</p>
      <p>
        Giấy chứng nhận quyền sử dụng đất số {filled(data.so_giay_chung_nhan)}, số vào sổ{" "}
        {filled(data.so_vao_so)}, do {filled(data.co_quan_cap_gcn)} cấp ngày {filled(data.ngay_cap_gcn)};
        tại thửa đất số {filled(data.thua_dat_so)}; {filled(data.to_ban_do_info)};{" "}
        {filled(data.dien_tich_loai_dat)}.
      </p>
      <p className="doc-strong">ĐIỀU 2: NỘI DUNG ỦY QUYỀN</p>
      {lines(data.noi_dung_uy_quyen).length ? (
        lines(data.noi_dung_uy_quyen).map((line, index) => <p key={index}>{line}</p>)
      ) : (
        <p>{filled(data.noi_dung_uy_quyen, "Nội dung ủy quyền sẽ hiển thị tại đây.")}</p>
      )}
      <p className="doc-strong">LỜI CHỨNG CHỨNG THỰC</p>
      <p>Tại {filled(data.ubnd_xa_chung_thuc)}.</p>
      <p>Tôi: {filled(data.nguoi_thuc_hien_chung_thuc)}.</p>
      <p>Người tiếp nhận hồ sơ: {filled(data.nguoi_tiep_nhan_ho_so)}.</p>
    </div>
  );
}

function BienDongPreview({ data }) {
  return (
    <div className="doc-page">
      <p className="doc-center doc-strong">{TEXT.nation}</p>
      <p className="doc-center doc-strong">{TEXT.motto}</p>
      <h2 className="doc-center">{TEXT.bienDongTitle}</h2>
      <p>1. Người sử dụng đất:</p>
      <p>a) Tên: {filled(data.ho_ten)}</p>
      <p>b) Giấy tờ nhân thân: {filled(data.giay_to_nhan_than)}</p>
      <p>c) Địa chỉ: {filled(data.dia_chi)}</p>
      <p>2. Nội dung biến động: Nhận thừa kế QSDĐ.</p>
      <p>
        Thửa đất số {filled(data.thua_dat_so)}, tờ bản đồ số {filled(data.to_ban_do_so)}, diện tích{" "}
        {filled(data.dien_tich)}.
      </p>
      <p className="doc-sign">Người viết đơn</p>
      <p className="doc-sign-name">{filled(data.ho_ten)}</p>
    </div>
  );
}

export default function DocumentPreview({ type, data }) {
  if (!type) {
    return (
      <aside className="preview-panel">
        <div className="preview-empty">
          <h2>{TEXT.previewTitle}</h2>
          <p>{TEXT.previewEmpty}</p>
        </div>
      </aside>
    );
  }

  const content = {
    mien_giam: <MienGiamPreview data={data} />,
    thua_ke: <ThuaKePreview data={data} />,
    uy_quyen: <UyQuyenPreview data={data} />,
    bien_dong: <BienDongPreview data={data} />
  }[type];

  return (
    <aside className="preview-panel">
      <div className="preview-header">
        <h2>{TEXT.previewTitle}</h2>
        <p>{getTemplateLabel(type)}</p>
      </div>
      <div className="preview-scroll">{content}</div>
    </aside>
  );
}
