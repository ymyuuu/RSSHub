const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.ct8.pl/';
    const response = await got.get(url);
    const $ = cheerio.load(response.data);

    // 找到包含账户数量的元素
    const accountText = $('span.button.is-large.is-flexible')
        .text()
        .trim();
    const accountNumberMatch = accountText.match(/(\d+)\s*\/\s*(\d+)/);

    // 初始化RSS数据
    ctx.state.data = {
        title: 'CT8 - 账户数量监控',
        link: url,
        item: [],
    };

    if (accountNumberMatch) {
        const currentAccounts = accountNumberMatch[1];
        const maxAccounts = accountNumberMatch[2];

        ctx.state.data.item.push({
            title: `当前账户数量: ${currentAccounts}`,
            description: `当前账户数量: ${currentAccounts} / ${maxAccounts}`,
            link: url,
            guid: `${url}#${currentAccounts}-${new Date().getTime()}`,
        });
    }
};
