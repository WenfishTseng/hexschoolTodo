const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./handler/errorHandler');
const todos = [];
const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  };
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url == '/todos' && req.method == 'GET') {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url == '/todo' && req.method == 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url.startsWith('/todo/') && req.method == 'PATCH') {
    // 取得使用者傳送的資料
    req.on('end', () => {
      try {
        // 取得網址列上id
        const id = req.url.split('/').pop();
        const tempTodo = JSON.parse(body).title;
        const index = todos.findIndex((todo) => (todo.id = id));
        if (index !== -1 && tempTodo !== undefined) {
          const oldTitle = todos[index].title;
          todos[index].title = tempTodo;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos,
              message: oldTitle + ' 被修改為 ' + tempTodo,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url.startsWith('/todo/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((todo) => (todo.id = id));
    if (index != -1) {
      // const title = todos.find((x) => x.id == id).title;
      const title = todos[index].title;
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos,
          message: title + ' 被清除',
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網站路由',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(3005);
