function endcode<T>(data: T): string {
  const text = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`.replace("&", ""))
    .join("&");
  return text;
}

function decode<T>(text: string): T {
  const entries = text.split("&");
  const data = entries.reduce((acc, entry) => {
    const [key, value] = entry.split("=");
    return { ...acc, [key]: value };
  }, {});
  return data as T;
}

export { endcode, decode };
