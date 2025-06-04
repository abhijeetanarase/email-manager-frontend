export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  // If it's from the current year, show the month and day
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  // If it's from a different year, show the date with the year
  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatDate = (date: string | Date): string => {
  const messageDate = new Date(date);
  
  return messageDate.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};