const PREFIX = "land-doc-tool";

export const saveDraft = (key, data) => {
  localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(data));
};

export const loadDraft = (key) => {
  const data = localStorage.getItem(`${PREFIX}:${key}`);
  return data ? JSON.parse(data) : null;
};