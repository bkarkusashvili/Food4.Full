const path = require('path'),
    fs = require('fs-extra'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    consola = require('consola'),
    ejs = require('ejs');

const mailer = {
    async setup(config) {
        if (config.ethereal) {
            mailer.ethereal = true;
            config.auth = await nodemailer.createTestAccount();
            config.host = 'smtp.ethereal.email';
            config.port = 587;
            config.secure = false;
        }

        mailer.transporter = nodemailer.createTransport(config, config.defaults);

        mailer.transporter.verify(function (error, success) {
            if (error) {
                consola.error("Mailer error:", error);
            } else {
                consola.info("Mailer setup successful");
            }
        });

        return mailer.transporter;
    },
    sendMail(params) {
        return this.transporter.sendMail(params).then(function (result) {
            if (mailer.ethereal) {
                consola.info('Ethereal message sent: %s', nodemailer.getTestMessageUrl(result));
            }

            return result;
        });
    },
    async sendTemplated(templateName, templateParams, params) {
        let template = await fs.readFile(path.resolve(__dirname, `../emails/${templateName}.html`));
        let settings = await mongoose.model('Settings').findOne({ name: "default" });
        templateParams.settings = settings;
        let body = await ejs.render(template.toString('utf-8'), templateParams, { async: true });
        params.html = body;
        return this.sendMail(params);
    }
};

module.exports = mailer;