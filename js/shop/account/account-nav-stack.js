/** In-memory navigation stack for account settings-style drill-down */

/** @typedef {'forward' | 'back' | 'none'} StackDirection */

export function createAccountNavStack() {
  /** @type {string[]} */
  let stack = ["root"];
  /** @type {StackDirection} */
  let direction = "none";

  return {
    /** @returns {string} */
    current() {
      return stack[stack.length - 1];
    },

    /** @returns {boolean} */
    isRoot() {
      return stack.length <= 1;
    },

    /** @returns {StackDirection} */
    consumeDirection() {
      const d = direction;
      direction = "none";
      return d;
    },

    /** @param {string} id */
    push(id) {
      if (stack[stack.length - 1] === id) return false;
      direction = "forward";
      stack.push(id);
      return true;
    },

    pop() {
      if (stack.length <= 1) return false;
      direction = "back";
      stack.pop();
      return true;
    },

    reset() {
      stack = ["root"];
      direction = "none";
    },
  };
}

/** @param {StackDirection} direction */
export function stackScreenClass(direction) {
  if (direction === "forward") return "shop-acct-stack-screen--enter-forward";
  if (direction === "back") return "shop-acct-stack-screen--enter-back";
  return "";
}
