import { startDailyJob } from "../../services/startScheduler";
import { startSession } from "../../services/startSession";

// Starting Whatsapp Session
startSession();

// Starting Cron Job
startDailyJob()

// Create Pool Database