const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.serv00.com/';
    const response = await got.get(url);
    const $ = cheerio.load(response.data);

    // 抓取所有的项目，假设这些项目的选择器是 .item
    const list = $('div');

    ctx.state.data = {
        title: 'Serv00 - RSS Feed',
        link: url,
        item: list.map((index, item) => {
            item = $(item);
            const title = item.find('h2').text() || item.find('h3').text() || 'No Title';
            const description = item.find('p').text() || 'No Description';
            const link = url + '#' + index; // 为每个项目生成唯一链接
            const guid = link + new Date().getTime(); // 使用时间戳生成唯一的 GUID
            return {
                title,
                description,
                link,
                guid,
            };
        }).get(),
    };
};
