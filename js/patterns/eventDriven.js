class EventEmitter {
  constructor() {
    // Map to store event names and their associated listener functions
    this.events = new Map();
  }

  /**
   * Register an event listener
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @param {boolean} once - Whether this listener should be called only once
   * @returns {EventEmitter} - Returns this for chaining
   */
  on(event, listener, once = false) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push({ listener, once });
    return this;
  }

  /**
   * Register a one-time event listener
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @returns {EventEmitter} - Returns this for chaining
   */
  once(event, listener) {
    return this.on(event, listener, true);
  }

  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} listenerToRemove - Callback function to remove
   * @returns {EventEmitter} - Returns this for chaining
   */
  off(event, listenerToRemove) {
    if (!this.events.has(event)) {
      return this;
    }

    const listeners = this.events.get(event).filter(
      ({ listener }) => listener !== listenerToRemove
    );

    if (listeners.length > 0) {
      this.events.set(event, listeners);
    } else {
      this.events.delete(event);
    }

    return this;
  }

  /**
   * Emit an event with data
   * @param {string} event - Event name
   * @param {...any} args - Data to pass to listeners
   * @returns {boolean} - True if event had listeners, false otherwise
   */
  emit(event, ...args) {
    if (!this.events.has(event)) {
      return false;
    }

    const listeners = this.events.get(event);

    // Create a new array for the listeners that should remain
    // (all except for once listeners that will be called)
    const remainingListeners = [];

    // Call all listeners
    listeners.forEach(({ listener, once }) => {
      listener(...args);

      // Keep listeners that aren't "once"
      if (!once) {
        remainingListeners.push({ listener, once });
      }
    });

    // Update the listeners array or remove the event if no listeners remain
    if (remainingListeners.length > 0) {
      this.events.set(event, remainingListeners);
    } else {
      this.events.delete(event);
    }

    return true;
  }
}

// Usage example
class UserService extends EventEmitter {
  constructor() {
    super();
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
    // Emit an event when a user is added
    this.emit('user-added', user);
  }

  removeUser(userId) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index !== -1) {
      const removedUser = this.users.splice(index, 1)[0];
      // Emit an event when a user is removed
      this.emit('user-removed', removedUser);
      return true;
    }
    return false;
  }
}

// Demo
const userService = new UserService();

// Register listeners
userService.on('user-added', user => {
  console.log(`User added: ${user.name} (ID: ${user.id})`);
});

userService.on('user-removed', user => {
  console.log(`User removed: ${user.name} (ID: ${user.id})`);
});

// One-time listener
userService.once('user-added', () => {
  console.log('First user added! This message appears only once.');
});

// Add users (triggers events)
userService.addUser({ id: 1, name: 'John Doe' });
userService.addUser({ id: 2, name: 'Jane Smith' });

// Remove a user (triggers event)
userService.removeUser(1);