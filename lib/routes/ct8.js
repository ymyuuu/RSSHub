const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.ct8.pl/';
    const response = await got.get(url);
    const $ = cheerio.load(response.data);

    // 抓取页面内容
    const list = $('div'); // 调整选择器以适应实际内容

    ctx.state.data = {
        title: 'CT8 - RSS Feed',
        link: url,
        item: list.map((index， item) => {
            item = $(item);
            const title = item.find('h2').text() || item.find('h3').text() || 'No Title';
            const description = item.find('p').text() || 'No Description';
            const link = url; // 网站主页的链接
            return {
                title,
                description,
                link,
            };
        }).get(),
    };
};
