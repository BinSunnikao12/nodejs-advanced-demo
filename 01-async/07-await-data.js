#!/usr/bin/env node

const log = console.log;

console.time('ALL TASKS USE');

function report(id, cost) {
  log(`#${id} task done. use ${cost} ms.\n`);
}

process.on('exit', () => {
  console.timeEnd('ALL TASKS USE');
});

function task(id) {
  const start = Date.now();

  log('empty task.');

  const end = Date.now();
  report(id, end-start);
}

function fakeAsync(id) {
  const start = Date.now(),
        delay = Math.random() * 1000;

  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const end = Date.now();
      log('fakeAsync use %dms', end-start);
      report(id, end-start);
      resolve(end-start);
    }, delay);
  });
}

function readDir(id) {
  const start = Date.now(),
        fs    = require('fs');

  return new Promise((resolve, reject) => {
    fs.readdir(process.cwd(), (err, files) => {
      if(err) reject();

      log(files);

      const end = Date.now();
      report(id, end-start);
      resolve(files);
    });
  });
}
/*
function getPage(id) {
  const start = Date.now(),
        axios = require('axios'),
        addr  = 'https://sample.wangding.in/web/one-div.html';

  return axios
    .get(addr)
    .then((res) => {
      log(res.data);
      const end = Date.now();
      report(id, end-start);
      return res.data;
    });
}
*/

async function getPage(id) {
  const start = Date.now(),
        axios = require('axios'),
        addr  = 'https://sample.wangding.in/web/one-div.html';

  const res = await axios.get(addr);
  log(res.data);
  const end = Date.now();
  report(id, end-start);
  return res.data;
}

/*
function readMysql(id) {
  const mysql = require('mysql2'),
        sql   = 'show databases;',
        start = Date.now();
        con   = mysql.createConnection({
          host: '127.0.0.1',
          user: 'root',
          password: 'ddd',
          database: 'mysql'
        });

  return con
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      log('Database');
      log('------------------');
      rows.forEach((row) => { log(row.Database); });
      log('------------------');
      con.end();

      const end = Date.now();
      report(id, end-start);
      return rows;
    });
}
*/

async function readMysql(id) {
  const mysql = require('mysql2/promise'),
        sql   = 'show databases;',
        start = Date.now();
        con   = await mysql.createConnection({
          host: '127.0.0.1',
          user: 'root',
          password: 'ddd',
          database: 'mysql'
        });

  const [rows, fields] = await con.execute(sql);
  log('Database');
  log('------------------');
  rows.forEach((row) => { log(row.Database); });
  log('------------------');
  con.end();

  const end = Date.now();
  report(id, end-start);
  return rows;
}

/* ----------------------- */

async function taskManager() {
  task(1);

  log('GET-DATA:', await fakeAsync(2));
  log('GET-DATA:', await readDir(3));
  log('GET-DATA:', await getPage(4));
  log('GET-DATA:', await readMysql(5));
  log('GET-DATA:', await fakeAsync(6));

  task(7);
}

taskManager();
