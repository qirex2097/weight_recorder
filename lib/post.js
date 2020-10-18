'use strict';

const fs = require('fs');

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

    const stream = fs.createReadStream('./sample_data.csv');
    fs.readFile('./sample_data.csv', 'utf-8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error('./sample_data.csv is not exist.');
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
        console.log(`./sample_data.csv is readed. ${all_data.length}`);
    });
}



module.exports = {
    getUserData
}
