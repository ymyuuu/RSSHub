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
        const options = { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const beijingTime = updateTime.toLocaleString('zh-CN', options).replace(/\//g, '-');

        // 设置 RSS 数据
        ctx.state.data = {
            title: 'CT8 - Account Number Monitoring',
            link: url,
            item: [{
                title: `CT8 : ${currentAccounts} / ${maxAccounts}`,
                description: `
                    <p>当前账户数量为： <strong>${currentAccounts}</strong>.</p>
                    <p>最大账户数量为： <strong>${maxAccounts}</strong>.</p>
                    <p>${beijingTime}</p>
                `,
                link: url,
                guid: `${url}#${currentAccounts}`,
                pubDate: beijingTime,
            }],
        };
    }
};
