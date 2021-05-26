var Imap = require('imap')
var MailParser = require("mailparser").MailParser
var fs = require("fs")

var imap = new Imap({
    user: '1244051258@qq.com', //你的邮箱账号
    password: 'cbgnjnkchogbgcfi', //你的邮箱密码
    host: 'imap.qq.com', //邮箱服务器的主机地址
    port: 993, //邮箱服务器的端口地址
    tls: true, //使用安全传输协议
    tlsOptions: { rejectUnauthorized: false } //禁用对证书有效性的检查
});

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {

    openInbox(function(err, box) {

        console.log("打开邮箱")

        if (err) throw err;

        imap.search(['UNSEEN', ['SINCE', 'May 20, 2017']], function(err, results) {//搜寻2017-05-20以后未读的邮件

            if (err) throw err;

            var f = imap.fetch(results, { bodies: '' });//抓取邮件（默认情况下邮件服务器的邮件是未读状态）

            f.on('message', function(msg, seqno) {

                var mailparser = new MailParser();

                msg.on('body', function(stream, info) {

                    stream.pipe(mailparser);//将为解析的数据流pipe到mailparser

                    //邮件头内容
                    mailparser.on("headers", function(headers) {
                        console.log("邮件头信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                        console.log("邮件主题: " + headers.get('subject'));
                        console.log("发件人: " + headers.get('from').text);
                        console.log("收件人: " + headers.get('to').text);
                    });

                    //邮件内容
                    
                    mailparser.on("data", function(data) {
                        if (data.type === 'text') {//邮件正文
                            console.log("邮件内容信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                            console.log("邮件内容: " + data.html);
                        }
                        if (data.type === 'attachment') {//附件
                            console.log("邮件附件信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                            console.log("附件名称:"+data.filename);//打印附件的名称
                            data.content.pipe(fs.createWriteStream(data.filename));//保存附件到当前目录下
                            data.release();
                        }
                    });

                });
                msg.once('end', function() {
                    console.log(seqno + '完成');
                });
            });
            f.once('error', function(err) {
                console.log('抓取出现错误: ' + err);
            });
            f.once('end', function() {
                console.log('所有邮件抓取完成!');
                imap.end();
            });
        });
    });
});

imap.once('error', function(err) {
    console.log(err);
});

imap.once('end', function() {
    console.log('关闭邮箱');
});

imap.connect();

