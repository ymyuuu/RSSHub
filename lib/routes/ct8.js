const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.ct8.pl/';
    const response = await got.get(url);
    const $ = cheerio.load(response.data);

    // 获取账户数量的文本
    const accountText = $('span.button.is-large.is-flexible').text().trim();
    // 匹配账户数量
    const match = accountText.match(/(\d+)\s*\/\s*(\d+)/);

    if (match) {
        // 提取当前账户数量和最大账户数量
        const currentAccounts = match[1];
        const maxAccounts = match[2];
        const updateTime = new Date().toUTCString();

        // 设置 RSS 数据
        ctx.state.data = {
            title: 'CT8 - Account Number Monitoring',
            link: url,
            item: [{
                title: `CT8 Account Number: ${currentAccounts} / ${maxAccounts}`,
                description: `
                    <h2>CT8 Account Number Monitoring</h2>
                    <p>Current account number is <strong>${currentAccounts}</strong>, the maximum account number is <strong>${maxAccounts}</strong>.</p>
                    <p>Data update time: ${updateTime}</p>
                `，
                link: url,
                guid: `${url}#${currentAccounts}`,
                pubDate: updateTime,
            }],
        };
    }
};
