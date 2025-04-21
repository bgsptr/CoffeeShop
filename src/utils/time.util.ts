import * as dayjs from "dayjs";

export class TimeUtil {
    static parseTimeString(timeString: string): Date {
        const [hours, minutes, seconds] = timeString.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds, 0);
        return date;
    }

    static convertToLocalTimeAnd24HourFormat(time: string): string {
        const [hours, flag] = time.split(" ");
        console.log(`data: ${hours} and ${flag}`);
        const hourValue = parseInt(hours.split(":")[0], 10);
        const hourInUTC = flag === "PM" ? hourValue + 12 : hourValue;
        const date = new Date();
        date.setHours(hourInUTC, 0, 0);
        return date.toTimeString().split(" ")[0];
    }

    static capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static parseStringTime(time: Date): number {
        const times = time.getTime() - (8 * 3600 * 1000);
        return times;
        // const timeconvert = new Date(times);
        // return timeconvert.toTimeString().split(" ")[0];
    }

    static generateStartTimeAndEndTime(time: number): { startTime: string; endTime: string } {
        const startTime = new Date(time);
        const endTime = new Date(time + 10 * 60 * 1000);
    
        return {
            startTime: startTime.toTimeString().split(" ")[0],
            endTime: endTime.toTimeString().split(" ")[0],
        };
    }
    
    static parseStringToTimeDayJS(dateString: string) {
        return dayjs(dateString).toDate();
    }

    static parseTimeToStringDayJS(date: Date) {
        const dateString = dayjs(date).toISOString();
        return dateString.replace("T", "");
    }

    static parseTimeToStringExact(date: Date) {
        return dayjs(date).toISOString();
    }
}