// EmailService.js
const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const config = require("config/config");

// Configure transport options
const mailgunOptions = {
    auth: config.mailgun
};

const transport = mailgunTransport(mailgunOptions);
class EmailService {
    constructor() {
        this.emailClient = nodemailer.createTransport(transport)
    }
    sendText(to, subject, text) {
        return new Promise((resolve, reject) => {
            this.emailClient.sendMail({
                from: '"Your Name" <youremail@yourdomain.com>',
                to,
                subject,
                text,
            }, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        })
    }
}
module.exports = new EmailService();