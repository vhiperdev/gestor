import cron from 'node-cron';
import { schedulerToday } from './schedulerToday';
import { schedulerAfterOne } from './schedulerAfterOne';
import { schedulerAfterFive } from './schedulerAfterFive';
import { schedulerAfterThree } from './schedulerAfterThree';
import { schedulerBeforeOne } from './schedulerBeforeOne';
import { schedulerBeforeTwo } from './schedulerBeforeTwo';
import { schedulerBeforeThree } from './schedulerBeforeThree';

export const startDailyJob = () => {
  cron.schedule('0 9 * * *', () => {
    
    // Today Notification
    schedulerToday()

    // After Day One Expired Notification
    schedulerAfterOne()

    // After Day Three Expired Notification
    schedulerAfterThree()

    // After Day Five Expired Notification
    schedulerAfterFive()

    // Before Day One Expired Notification
    schedulerBeforeOne()

    // Before Day Two Expired Notification
    schedulerBeforeTwo()

    // Before Day Three Expired Notification
    schedulerBeforeThree()
  });
};