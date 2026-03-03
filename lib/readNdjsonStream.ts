export async function readNdjsonStream<T>(
  response: Response,
  onMessage: (data: T) => void,
) {
  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.trim()) {
        try {
          onMessage(JSON.parse(line));
        } catch (err) {
          console.error("Invalid JSON line:", line);
        }
      }
    }
  }

  // Flush remaining buffer
  if (buffer.trim()) {
    onMessage(JSON.parse(buffer));
  }
}
