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

        // 获取当前时间并转换为北京时间
        const updateTime = new Date();
        const beijingTime = new Date(updateTime.getTime() + 8 * 60 * 60 * 1000).toUTCString();

        // 设置 RSS 数据
        ctx.state.data = {
            title: 'CT8 - Account Number Monitoring',
            link: url,
            item: [{
                title: `CT8 Account Number: ${currentAccounts} / ${maxAccounts}`,
                description: `
                    <p>当前账户数量为： <strong>${currentAccounts}</strong>.</p>
                    <p>最大账户数量为： <strong>${maxAccounts}</strong>.</p>
                    <p>更新时间：</p>
					<p>${beijingTime}</p>
                `,
                link: url,
                guid: `${url}#${currentAccounts}`,
                pubDate: beijingTime,
            }],
        };
    }
};
