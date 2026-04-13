interface Notification {
  id: string
  type: 'warning' | 'success' | 'info'
  message: string
  time: string
  timestamp: number
}

export function addNotification(type: 'warning' | 'success' | 'info', message: string) {
  const notification: Notification = {
    id: Date.now().toString(),
    type,
    message,
    time: 'Just now',
    timestamp: Date.now()
  }

  // Get existing notifications
  const stored = localStorage.getItem('ghost_shell_notifications')
  const existing: Notification[] = stored ? JSON.parse(stored) : []

  // Add new notification at the beginning
  const updated = [notification, ...existing].slice(0, 10) // Keep only last 10

  // Save to localStorage
  localStorage.setItem('ghost_shell_notifications', JSON.stringify(updated))

  // Dispatch custom event to update navbar
  window.dispatchEvent(new CustomEvent('ghost_shell_notification'))
}

export function clearNotifications() {
  localStorage.removeItem('ghost_shell_notifications')
  window.dispatchEvent(new CustomEvent('ghost_shell_notification'))
}

export function getNotifications(): Notification[] {
  const stored = localStorage.getItem('ghost_shell_notifications')
  return stored ? JSON.parse(stored) : []
}
