import cron from 'node-cron';
import { schedulerToday } from './schedulerToday';

export const startDailyJob = () => {
  cron.schedule('0 9 * * *', () => {
    console.log('Tugas harian dijalankan pada:', new Date());

    // Today Notification
    // schedulerToday()
    
  });
};