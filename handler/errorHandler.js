function errorHandle(res) {
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With', // 設置了允許的請求標頭，指定了在跨來源請求中允許的自訂的 HTTP 標頭
    'Access-Control-Allow-Origin': '*', // 設置了允許的來源，指定了在跨來源請求中允許的來源網域，星號 * 表示接受所有來源
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE', // 支援方法
    'Content-Type': 'application/json', // 換成json格式
  };
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'failed',
      message: '欄位填寫錯誤, 或無此 Todo ID',
    })
  );
  res.end();
}
module.exports = errorHandle;
