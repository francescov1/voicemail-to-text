import config from '../config/index';
import twilioClient from '../config/twilio'

export const initiateVoicemailCall = (number: string, message: string) => {
  // initiate the call
  return twilioClient.calls.create({
    url: `${config.base_url}/call/initialCallHandler?message=${message}&number=${number}`,
    // to: config.rogers_provider_number as string,
    to: number,
    from: config.twilio.sender_id as string,
    //machineDetection: "DetectMessageEnd",
  //  machineDetection: "Enable",
  //  machineDetectionSpeechEndThreshold: 5000,
  //  machineDetectionSpeechThreshold: 6000,
  //  machineDetectionSilenceTimeout: 10000
  });
}
