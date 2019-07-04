'use strict';

// voicemail breakdown (rogers)

// dialog: "welcome to rogers wireless voicemail. Please enter your password"
// action: send password digits
// dialog (if new messages): "you have _ new wireless voice messages."
// dialog (if saved message): "you have _ saved messages."

// if new messages
// dialog : "First new message:"
// dialog: "{message}"
// dialog: "to erase this message, press 7, to reply to it, press 8, to save it, press 9"
// dialog: "next message"
// dialog: "{message}"
// dialog: "to erase this message, press 7, to reply to it, press 8, to save it, press 9"

// if saved messages
// dialog: "First saved message:"
// dialog: "{message}"
// dialog: "to erase this message, press 7, to reply to it, press 8, to save it, press 9"
// dialog: "next saved message"
// dialog: "{message}"
// dialog: "to erase this message, press 7, to reply to it, press 8, to save it, press 9"

// dialog (after messages play): "end of messages."
// dialog (replays 3 times if no response): "main menu. to check your wireless voice messages,
//    press 1, to send a voice message press 3, to change your personal options, press 4,
//    to exit, press star"

// dialog: "thank you for calling, goodbye."

// if deleting messages:
// action: send digit "7" right after message starts
// dialog: "message erased, next message"
// dialog: "{message}"
// continue same flow as above

// type can be "new" or "saved"
const parseMessages = (text, type) => {

  let parsedMessages = { messages: [], n: 0 };

  // split into [everything before, n, all messages]
  let allMessages = text.split(
    new RegExp(`([0-9]+) ${type === "saved" ? "saved" : "new wireless voice"} messages?`)
  );

  if (allMessages.length === 1) {
    console.log(`no ${type} messages`)
    return parsedMessages;
  }
  else {
    parsedMessages.n = allMessages[1];
  }

  if (type === "saved") {
    text = text.replace(/.*first saved message/, '');
  }
  else {
    text = text.replace(/.*first new message/, '');
    text = text.replace(/first saved message.*/, '');
  }

  // split messages into array of voicemails
  let messages = text.split('next saved message')

  parsedMessages.messages = messages.map(msg => {
    return msg.replace('to erase this message, press 7, to reply to it, press 8, to save it, press 9', '');
  })

  return parsedMessages;
}

exports.parseVoicemail = (text) => {
  // TODO: double check if need to lowercase text
  let voicemails = {};

  // remove anything after messages
  text = text.replace(/end of messages.*/, '')
  voicemails.saved = parseMessages(text, "saved")
  voicemails.new = parseMessages(text, "new");

  return voicemails;
}
