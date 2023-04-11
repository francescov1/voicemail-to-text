// voicemail breakdown (rogers)

// dialog: "welcome to rogers wireless voicemail. Please enter your password"
// action: send password digits
// dialog (if new messages): "you have _ new wireless voice messages."
// dialog (if saved messages and no new): "you have _ saved wireless voice messages."
// dialog (if saved messages and new messages): "you have _ saved messages."

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

interface ParcedMessages {
  messages: string[];
  n: number;
}

  // TODO: Rewrite this func. See dialog outlined above. Heres examples of text: 
  // You have to have wireless voice messages 1st saved message. Hello francesco. It's saggy from Dr terabytes office. You can please give me a call at 587-317-6559. Thank you. Bye bye. To erase this message, press 7. To save it, press 9 Next saved message.
  // You have 2 new wireless voice messages. First your message. Hello, francesco. It's saggy from Dr terabytes office. You can please give me a call at 587-317-6559. Thank you. Bye bye. To erase this message, press 7. To save it, press 9 Next message.
const parseMessages = (text: string, type: "saved" | "new"): ParcedMessages => {
  
  let parsedMessages: ParcedMessages = { messages: [], n: 0 };

  // split into [everything before, n, messages]
  let allMessages = text.split(
    new RegExp(`([0-9]+)\/?[0-9]? ${type === "saved" ? "saved" : "new wireless voice"} messages?`)
  );

  // if there are no new messages, saved line will be different. Check if this exists
  if (allMessages.length === 1 && type === "saved") {
    console.log('message only has saved')
    allMessages = text.split(
      new RegExp(`([0-9]+)\/?[0-9]? saved wireless voice messages?`)
    );
  }

  if (allMessages.length === 1) {
    console.log(`no ${type} messages`)
    return parsedMessages;
  }
  else {
    parsedMessages.n = Number(allMessages[1]);
  }

  if (type === "saved") {
    text = text.replace(/.*1st saved (a )?message/, '');
  }
  else {
    text = text.replace(/.*1st new (a )?message/, '');
    text = text.replace(/1st saved (a )?message.*/, '');
  }

  // split messages into array of voicemails
  let messages = text.split(/next saved message\.?/)

  parsedMessages.messages = messages.map(msg => {
    msg = msg.replace('to erase this message press 7 ', '')
    msg = msg.replace('to reply to it press 8 ', '')
    msg = msg.replace('to save it press 9 ', '');
    msg = msg.trim();
    return msg === '' ? '(Empty message)' : msg;
  })

  return parsedMessages;
}

interface VoicemailData {
  new: ParcedMessages;
  saved: ParcedMessages;
}
export const parseVoicemail = (text: string): VoicemailData => {
  text = text.toLowerCase();

  // remove anything after messages
  text = text.replace(/end of messages.*/, '')
  const savedMessages = parseMessages(text, "saved")
  const newMessages = parseMessages(text, "new");

  return {
    new: newMessages,
    saved: savedMessages
  };
}
