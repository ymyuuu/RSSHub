const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.serv00.com/';
    const response = await got.get(url);
    const $ = cheerio.load(response.data);

    // 假设账户数量在页面上的某个特定的选择器中，例如 .account-number
    const accountNumberText = $('.account-number').text();
    const accountNumberMatch = accountNumberText.match(/(\d+)\s*\/\s*(\d+)/);
    
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
                }
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
                }
            ],
        };
    }
};
