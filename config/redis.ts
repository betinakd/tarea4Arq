import { createClient } from "redis";
import { Queue, Worker } from "bullmq";
import { productionOrderJob } from "../services/bullQueueService.js";

const client = await createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

await client.connect();

export const productionQueue = new Queue("production_queue", {
  connection: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
});

export const productionWorker = new Worker(
  "production_queue",
  productionOrderJob,
  { connection: { url: process.env.REDIS_URL || "redis://localhost:6379" } }
);

client.on("error", (err) => console.error("Redis Client Error", err));

export default client;

