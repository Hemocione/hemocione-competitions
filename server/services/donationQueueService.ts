import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import type { Donation } from "./hemocioneId";

const config = useRuntimeConfig();
const sqsClient = new SQSClient();
const queueUrl = config.donationsQueueUrl;

interface User {
  hemocioneId?: string | null;
  email?: string | null;
  phone?: string;
  document?: string;
}

interface DonationQueueMessage {
  secret: string;
  donation: Donation;
  user: User;
}

export async function sendMessage(message: DonationQueueMessage) {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
  });

  await sqsClient.send(command);
}
