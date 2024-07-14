const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.serv00.com/';
    const response = await got.get(url);
    const $ = cheerio.load(response.data);

    // 找到包含账户数量的元素
    const accountText = $('span.button.is-large.is-flexible')
        .text()
        .trim();
    const accountNumberMatch = accountText.match(/(\d+)\s*\/\s*(\d+)/);

    if (accountNumberMatch) {
        const currentAccounts = accountNumberMatch[1];
        const maxAccounts = accountNumberMatch[2];

        ctx.state.data = {
            title: 'Serv00 - Account Number Monitor',
            link: url,
            item: [
                {
                    title: `Current Accounts: ${currentAccounts}`,
                    description: `Current number of accounts: ${currentAccounts} out of ${maxAccounts}`,
                    link: url,
                    guid: `${url}#${currentAccounts}-${new Date().getTime()}`,
                },
            ],
        };
    } else {
        ctx.state.data = {
            title: 'Serv00 - Account Number Monitor',
            link: url,
            item: [
                {
                    title: 'Account Number Not Found',
                    description: 'Could not find account number on the page',
                    link: url,
                    guid: `${url}#error-${new Date().getTime()}`,
                },
            ],
        };
    }
};
