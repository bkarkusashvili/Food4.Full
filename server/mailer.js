const nodemailer = require('nodemailer');

const mailer = {
    async setup(config) {
        if (config.ethereal) {
            mailer.ethereal = true;
            mailer.auth = await nodemailer.createTestAccount();
            config.host = 'smtp.ethereal.email';
            config.port = 587;
            config.secure = false;
        } else {
            mailer.auth = config.auth;
        }

        mailer.transporter = nodemailer.createTransport({
            pool: config.pool,
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: mailer.auth
        }, config.defaults);

        mailer.transporter.verify(function (error, success) {
            if (error) {
                console.error("Mailer error:", error);
            }
        });

        return mailer.transporter;
    },
    sendMail(params) {
        return this.transporter.sendMail(params).then(function(result) {
            if(mailer.ethereal) {
                console.log('Message sent: %s', result.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(result));
            }
            
            return result;
        });
    }
};
module.exports = mailer;


