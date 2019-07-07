# Voicemail to text

## Project

This application gives users the ability to view and manage voicemail messages through SMS rather than needing to call their voicemail service.

## Motivation

We found various annoyances with managing our voicemail inbox due to the need to call our respective voicemail services. There is no way to see a list of voicemails or easily save, share or delete voicemails without paying for an additional addon from our mobile service providers.

## Technologies

* Language: Node.js
* SMS and call functionality: Twilio
* Speech-to-text transcription: Twilio (see next steps)

## Next Steps

* Using Google Speech for speech-to-text transcription. We have found that Twilio's transcriptions are not as accurate as we would like, and Google Speech seems to work much better
* Cron job to automate voicemail listings at specified intervals (ie. once per day)
* Delete voicemails by replying to voicemail listing
* Easily deployable for others, transcription parsing compatible with more mobile service providers (right now it only parses Rogers voicemails)

## Contributors

* Francesco Virga - [GitHub](https://github.com/francescov1)
* Peter Wright - [GitHub](https://github.com/peteraw77)
