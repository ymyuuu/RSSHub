const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.serv00.com/';
    const response = await got.get(url);
    const $ = cheerio.load(response.data);

    const list = $('.item');  // 根据实际的HTML结构选择合适的选择器

    ctx.state.data = {
        title: 'Serv00 - RSS Feed',
        link: url,
        item: list.map((index, item) => {
            item = $(item);
            return {
                title: item.find('h2').text(),
                description: item.find('p').text(),
                link: item.find('a').attr('href'),
            };
        }).get(),
    };
};
