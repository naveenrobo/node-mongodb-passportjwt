var AWS = require('aws-sdk');
var fs = require('fs');
var ejs = require('ejs');

AWS.config.update({
    region: 'us-east-1'
});



module.exports = {
    sendResetMail: (email, password) => {
       
        const msg = ejs.render(
            fs.readFileSync(__dirname + '/templates/reset.ejs', 'utf8'), {
                password: password
            }
        );       
        var params = {
            Destination: {
                ToAddresses: [
                    email,'naveenrobotics@live.in'
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: msg
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Your Password is ${password}. Change password on first login`
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Password Reset Notification'
                }
            },
            Source: 'hello@naveens.co.in',
            ReplyToAddresses: [
                'naveenrobotics@live.in',
            ],
        };
       
        return new AWS.SES({
            apiVersion: '2010-12-01'
        }).sendEmail(params).promise();

    }
}