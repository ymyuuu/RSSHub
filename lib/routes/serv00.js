const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.serv00.com/';
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
            title: 'Serv00 - 账户数量监控',
            link: url,
            item: [{
                title: `Serv00账户数量: ${currentAccounts} / ${maxAccounts}`,
                description: `
                    <h2>Serv00账户数量监控</h2>
                    <p>当前账户数量为 <strong>${currentAccounts}</strong>，最大账户数量为 <strong>${maxAccounts}</strong>。</p>
                    <p>数据更新时间：${updateTime}</p>
                `,
                link: url,
                guid: `${url}#${currentAccounts}`,
                pubDate: updateTime,
            }],
        };
    }
};
