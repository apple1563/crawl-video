const superagent = require("superagent");
const {delay} = require("./helper");
const cheerio = require('cheerio');
const fs = require("fs")

// 在获取的HTML中选择元素
const superagentPromise = (url) => {
    return new Promise((resolve, reject) => {
        superagent
            .get(url)
            .timeout(60000)
            // .proxy(proxyUrl)
            .set(
                "Cookie",
                `msToken=XTbS9RgUJwykwS4AllFw1-OzxobeOTOuvIa0eSdlwiCguAVU6_Jm3WOYFC6VzzTSS2fgTY17kLohEnEb_tG1AkkolcqTumlqMSo0pCLgqXIJoaYDIB6u; expires=Fri, 10 Nov 2023 03:07:13 GMT; domain=bytedance.com; path=/; secure; SameSite=None`,
            )
            .set("Accept", "text/html")
            .set("Referer", new URL(url).host)
            .set(
                "User-Agent",
                "Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
            )
            .end((err, res) => {
                resolve([err, res]);
            });
    });
};

async function query(url) {
    try {
        superagentPromise(url).then(
            (arr) => {
                if (arr[0]) {
                    console.log("err", arr[0]);
                    return;
                }
                const $ = cheerio.load(arr[1].text);
                console.log(arr[1]);
                fs.writeFile('index.html', arr[1].text, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('文本已成功保存到文件中！');
                });
            },
        );
    } catch (e) {
        console.log(e);
    }
}

query(`https://www.iesdouyin.com/share/video/7288928764279508280/?region=PH&mid=7288928815085079355&u_code=0&did=MS4wLjABAAAAEx6LEX4_LoJvs8e-uPE5XZsA3wpFf2mbne45o1fvmsosGzF9rOtdNXkOUd3U1D6J&iid=MS4wLjABAAAANwkJuWIRFOzg5uCpDRpMj4OX-QryoDgn-yYlXQnRwQQ&with_sec_did=1&titleType=title&share_sign=VHA5GYNbw_dDr3GgUpNzFZKteN5A5CqhUGz1oJDWzvk-&share_version=170400&ts=1698979732&from_ssr=1&from=web_code_link`);
// query(`https://v.douyin.com/iRJAes5v/`);
