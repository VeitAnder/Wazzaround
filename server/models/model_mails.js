var mongoose = require('mongoose-q')();

var mailSchema = new mongoose.Schema({
  "from": {type: String, required: true},
  "to": {type: String, required: true},
  "cc": {type: String},
  "bcc": {type: String},
  "subject": {type: String, required: true},
  "tag": {type: String},
  "htmlbody": {type: String},
  "textbody": {type: String},
  "replyto": {type: String, required: true},
  "headers": {
    "name": {type: String},
    "value": {type: String}
  },
  "attachments": [
    {
      "name": {type: String},
      "content": {type: String},
      "contenttype": {type: String},
      "contentid": {type: String}
    }
  ]
});

module.exports = mongoose.model('mails', mailSchema);
/* POSTMARK MAILAPI
 {
 From" : "sender@example.com",
 "To" : "receiver@example.com",
 "Cc" : "copied@example.com",
 "Bcc": "blank-copied@example.com",
 "Subject" : "Test",
 "Tag" : "Invitation",
 "HtmlBody" : "<b>Hello</b>",
 "TextBody" : "Hello",
 "ReplyTo" : "reply@example.com",
 "Headers" : [{ "Name" : "CUSTOM-HEADER", "Value" : "value" }]
 "Attachments": [
 {
 "Name": "bacon.jpg",
 "Content": "/9j/4AAQSkZJRgABAgEAAAAAAAD/4",
 "ContentType": "image/jpeg",
 "ContentID": "cid:part1.01030607.06070005@gmail.com"
 },
 {
 "Name": "bacon.jpg",
 "Content": "/9j/4AAQSkZJRgABAgEAAAAAAAD/4",
 "ContentType": "image/jpeg",
 "ContentID": "cid:part1.01030607.06070005@gmail.com"
 }
 ]}
 */