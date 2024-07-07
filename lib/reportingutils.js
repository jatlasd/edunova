export const  calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000/01/01 ${startTime}`);
    const end = new Date(`2000/01/01 ${endTime}`);
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    const diff = end - start;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  }