const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.serv00.com/';
    const response = await got.get(url);
    const $ = cheerio.load(response.data);

    const accountText = $('span.button.is-large.is-flexible').text().trim();
    const match = accountText.match(/(\d+)\s*\/\s*(\d+)/);

    if (match) {
        const currentAccounts = match[1];
        const maxAccounts = match[2];

        ctx.state.data = {
            title: 'Serv00 - 账户数量监控',
            link: url,
            item: [{
                title: `Serv00账户数量: ${currentAccounts} / ${maxAccounts}`,
                description: `当前账户数量: ${currentAccounts} / ${maxAccounts}`,
                link: url,
                guid: `${url}#${currentAccounts}`,
            }],
        };
    }
};
