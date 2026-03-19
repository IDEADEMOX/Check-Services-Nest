// 构建签名内容
export const buildSignatureContent = (
  method: string,
  url: string,
  timestamp: number,
  nonce: string,
  data?: any,
): string => {
  const parts = [method.toUpperCase(), url, timestamp.toString(), nonce];

  // 如果有请求数据，也加入签名
  if (data) {
    const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
    parts.push(dataStr);
  }

  return parts.join('|');
};
