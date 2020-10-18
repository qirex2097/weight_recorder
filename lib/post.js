'use strict';

const fs = require('fs');
const filename = './sample_data.csv';

let all_data = new Array();
if (all_data.length === 0) {
    readFromFile();
}

/**
 * 指定の日付のデータを取得する。
 * @param { string } user_name
 * @param { Date } date
 * @return { data } date, value
 */
function getUserData(user_name, date) {
    let ans_data = { date: date }; // ダミー
    for (let item of all_data) {
        if (item.user === user_name && 
            item.date.getFullYear() === date.getFullYear() && 
            item.date.getMonth() === date.getMonth() && 
            item.date.getDate() === date.getDate()) {
            ans_data = { date: item.date, value: item.value };
        }
    }
    return ans_data;
}

/**
 * ファイルからデータを読み込む。
 */
function readFromFile() {
    // user_name, date, value
    const user_name = 'guest';

    const stream = fs.createReadStream(filename);
    fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error(filename + ' is not exist.');
                return;
            }
            throw err;
        }

        for (let item of data.split('\n')) {
            const token = item.split(',');
            const user_name = token[0];
            const date = token[1];
            const value = token[2];
            all_data.push({user: user_name, date: new Date(date), value: value});
        }
        console.log(`${filename} is readed. ${all_data.length}`);
    });
}

/**
 * ユーザデータをファイルに書き込む
 * @param { String} user_name ユーザ名
 * @param { Date } today 登録日
 * @param { float } value 登録する値
 */
function registerUserData(user_name, today, value) {
    const data_str = [user_name, today, value].join(',') + '\n';

    all_data.push({user: user_name, date: today, value: value});
    fs.appendFile(filename, data_str, 'utf-8', (err) => {
        if (err) {
            throw err;
        }
    });

    console.log(`registerUserData: ${data_str}\n`);

    return;
}

module.exports = {
    getUserData,
    registerUserData
}
