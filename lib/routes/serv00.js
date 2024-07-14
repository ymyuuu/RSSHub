const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.serv00.com/';
    const response = await got.get(url);
    const $ = cheerio.load(response.data);

    // 假设账户数量在一个具有特定ID的元素中，比如 #account-count
    const accountCountElement = $('#account-count').text();

    // 提取账户数量，假设是一个纯数字
    const accountCount = accountCountElement.match(/\d+/)[0];

    // 为RSS项创建唯一链接和GUID
    const link = url + '#account-count';
    const guid = link + new Date().getTime();

    ctx.state.data = {
        title: 'Serv00 - Account Count',
        link: url,
        item: [
            {
                title: 'Current Account Count',
                description: `The current account count is ${accountCount}`,
                link,
                guid,
            },
        ],
    };
};
