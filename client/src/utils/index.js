export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const calculateTime = (commentDate) => {
  const currentDate = new Date();
  const commentTime = new Date(commentDate);
  const timeDiff = currentDate.getTime() - commentTime.getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return seconds === 1 ? "1 second ago" : seconds + " seconds ago";
  } else if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : minutes + " minutes ago";
  } else if (hours < 24) {
    return hours === 1 ? "1 hour ago" : hours + " hours ago";
  } else if (days < 7) {
    return days === 1 ? "1 day ago" : days + " days ago";
  } else if (weeks < 4) {
    return weeks === 1 ? "1 week ago" : weeks + " weeks ago";
  } else if (months < 12) {
    return months === 1 ? "1 month ago" : months + " months ago";
  } else {
    return years === 1 ? "1 year ago" : years + " years ago";
  }
};

export const calculatePercentage = (count, pollSum) => {
  if (pollSum === 0) {
    return 0;
  }
  return Math.round((count / pollSum) * 100);
};

export const profileImages = [
  "profile1",
  "profile2",
  "profile3",
  "profile4",
  "profile5",
  "profile6",
  "profile7",
  "profile8",
  "profile9",
  "profile10",
  "profile11",
  "profile12",
  "profile13",
  "profile14",
  "profile15",
  "profile16",
  "profile17",
  "profile18",
  "profile19",
  "profile20",
];
