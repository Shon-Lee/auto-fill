import { getTemplateLabel } from "../uiLabels";

const OPTIONS = [
  { value: "", label: "-- Ch\u1ecdn m\u1eabu h\u1ed3 s\u01a1 --" },
  { value: "mien_giam", label: getTemplateLabel("mien_giam") },
  { value: "thua_ke", label: getTemplateLabel("thua_ke") },
  { value: "uy_quyen", label: getTemplateLabel("uy_quyen") },
  { value: "bien_dong", label: getTemplateLabel("bien_dong") }
];

export default function TemplateSelector({ value, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
