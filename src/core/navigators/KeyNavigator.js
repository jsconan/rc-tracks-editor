/**
 * RC Tracks Editor
 * Copyright (c) 2022 Jean-Sébastien CONAN
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { eventEmitterMixin } from '../mixins';

/**
 * The identifier for a move up keystroke.
 * @type {string}
 * @private
 */
const KEYSTROKE_UP = 'up';

/**
 * The identifier for a move down keystroke.
 * @type {string}
 * @private
 */
const KEYSTROKE_DOWN = 'down';

/**
 * The identifier for a move left keystroke.
 * @type {string}
 * @private
 */
const KEYSTROKE_LEFT = 'left';

/**
 * The identifier for a move right keystroke.
 * @type {string}
 * @private
 */
const KEYSTROKE_RIGHT = 'right';

/**
 * The identifier for a spacebar keystroke.
 * @type {string}
 * @private
 */
const KEYSTROKE_SPACEBAR = 'spacebar';

/**
 * The identifier for an enter keystroke.
 * @type {string}
 * @private
 */
const KEYSTROKE_ENTER = 'enter';

/**
 * The identifier for an escape keystroke.
 * @type {string}
 * @private
 */
const KEYSTROKE_ESCAPE = 'escape';

/**
 * The identifier for a delete keystroke.
 * @type {string}
 * @private
 */
const KEYSTROKE_DELETE = 'delete';

/**
 * The identifier for a backspace keystroke.
 * @type {string}
 * @private
 */
const KEYSTROKE_BACKSPACE = 'backspace';

/**
 * The type for a move action.
 * @type {string}
 * @private
 */
const TYPE_MOVE = 'move';

/**
 * The type for a control action.
 * @type {string}
 * @private
 */
const TYPE_CONTROL = 'control';

/**
 * Horizontal navigation (left/right).
 * @type {string}
 * @private
 */
const MODE_HORIZONTAL = 'horizontal';

/**
 * Vertical navigation (up/down).
 * @type {string}
 * @private
 */
const MODE_VERTICAL = 'vertical';

/**
 * All directions navigation.
 * @type {string}
 * @private
 */
const MODE_BOTH = 'both';

/**
 * Navigation to the next element.
 * @type {string}
 * @private
 */
const ACTION_NEXT = 'next';

/**
 * Navigation to the previous element.
 * @type {string}
 * @private
 */
const ACTION_PREVIOUS = 'previous';

/**
 * Validates from the current element.
 * @type {string}
 * @private
 */
const ACTION_VALIDATE = 'validate';

/**
 * Cancels from the current element.
 * @type {string}
 * @private
 */
const ACTION_CANCEL = 'cancel';

/**
 * Deletes from the current element.
 * @type {string}
 * @private
 */
const ACTION_DELETE = 'delete';

/**
 * A mapping for identifying keystrokes from a key identifier.
 * @type {object}
 * @private
 */
const keystrokes = {
    Up: KEYSTROKE_UP,
    ArrowUp: KEYSTROKE_UP,

    Down: KEYSTROKE_DOWN,
    ArrowDown: KEYSTROKE_DOWN,

    Left: KEYSTROKE_LEFT,
    ArrowLeft: KEYSTROKE_LEFT,

    Right: KEYSTROKE_RIGHT,
    ArrowRight: KEYSTROKE_RIGHT,

    ' ': KEYSTROKE_SPACEBAR,
    Spacebar: KEYSTROKE_SPACEBAR,

    Enter: KEYSTROKE_ENTER,

    Esc: KEYSTROKE_ESCAPE,
    Escape: KEYSTROKE_ESCAPE,

    Del: KEYSTROKE_DELETE,
    Delete: KEYSTROKE_DELETE,

    Backspace: KEYSTROKE_BACKSPACE
};

/**
 * A mapping for identifying actions from a keystroke.
 * @type {object}
 * @private
 */
const actions = {
    [KEYSTROKE_UP]: { type: TYPE_MOVE, mode: MODE_VERTICAL, action: ACTION_PREVIOUS },
    [KEYSTROKE_DOWN]: { type: TYPE_MOVE, mode: MODE_VERTICAL, action: ACTION_NEXT },
    [KEYSTROKE_LEFT]: { type: TYPE_MOVE, mode: MODE_HORIZONTAL, action: ACTION_PREVIOUS },
    [KEYSTROKE_RIGHT]: { type: TYPE_MOVE, mode: MODE_HORIZONTAL, action: ACTION_NEXT },
    [KEYSTROKE_SPACEBAR]: { type: TYPE_CONTROL, mode: MODE_BOTH, action: ACTION_VALIDATE },
    [KEYSTROKE_ENTER]: { type: TYPE_CONTROL, mode: MODE_BOTH, action: ACTION_VALIDATE },
    [KEYSTROKE_ESCAPE]: { type: TYPE_CONTROL, mode: MODE_BOTH, action: ACTION_CANCEL },
    [KEYSTROKE_DELETE]: { type: TYPE_CONTROL, mode: MODE_BOTH, action: ACTION_DELETE },
    [KEYSTROKE_BACKSPACE]: { type: TYPE_CONTROL, mode: MODE_BOTH, action: ACTION_DELETE }
};

/**
 * The list of allowed modes.
 * @type {string[]}
 * @private
 */
const allowedModes = [MODE_BOTH, MODE_HORIZONTAL, MODE_VERTICAL];

/**
 * Keyboard navigation schemes.
 */
export class KeyNavigator {
    /**
     * Navigation mode.
     * @type {string}
     * @private
     */
    #mode = KeyNavigator.MODE_BOTH;

    /**
     * Creates a keyboard navigation scheme with respect to the given mode.
     * @param {string} mode - The navigation mode.
     */
    constructor(mode = KeyNavigator.MODE_BOTH) {
        eventEmitterMixin(this);

        this.mode = mode;
    }

    /**
     * Gets the navigation mode.
     * @type {string}
     */
    get mode() {
        return this.#mode;
    }

    /**
     * Sets the navigation mode.
     * @param {string} mode - The navigation mode.
     */
    set mode(mode) {
        if (allowedModes.includes(mode)) {
            this.#mode = mode;
        }
    }

    /**
     * Identifies a keystroke with respect to the selected mode.
     * If the keystroke is not valid for the selected mode, it will not be identified.
     * When the allowed type is specified, the keystroke will be identified only if its type matches.
     * @param {string} key - The key to identify.
     * @param {string} allowedType - The allowed type of action.
     * @returns {managedKeystroke} - The descriptor of the managed keystroke, or `null`.
     */
    identify(key, allowedType = null) {
        const managedKeystroke = KeyNavigator.identify(key, allowedType);
        if (!managedKeystroke) {
            return null;
        }

        const { type, mode } = managedKeystroke;
        if (this.#mode !== MODE_BOTH && type === TYPE_MOVE && mode !== this.#mode) {
            return null;
        }

        return managedKeystroke;
    }

    /**
     * Processes a keystroke with respect to the selected mode.
     * When the allowed type is specified, the keystroke will be processed only if its type matches.
     * @param {string} key - The key identifier to process.
     * @param {string} allowedType - The allowed type of action.
     * @returns {boolean} - Returns `true` if the keystroke was managed; otherwise returns `false`.
     * @fires action
     * @fires next
     * @fires previous
     * @fires validate
     * @fires cancel
     * @fires delete
     */
    process(key, allowedType = null) {
        const managedKeystroke = this.identify(key, allowedType);
        if (!managedKeystroke) {
            return false;
        }

        const { keystroke, action } = managedKeystroke;

        this.emit('action', action, keystroke, key);
        this.emit(action, keystroke, key);

        return true;
    }

    /**
     * Processes a keyboard event with respect to the selected mode.
     * When the allowed type is specified, the keystroke will be processed only if its type matches.
     * @param {KeyboardEvent} event - The event to process.
     * @param {string} allowedType - The allowed type of action.
     * @returns {boolean} - Returns `true` if the keystroke was managed; otherwise returns `false`.
     * @fires action
     * @fires next
     * @fires previous
     * @fires validate
     * @fires cancel
     * @fires delete
     */
    processEvent(event, allowedType = null) {
        if (!this.process(event && event.key, allowedType)) {
            return false;
        }

        event.preventDefault();

        return true;
    }

    /**
     * Horizontal navigation (left/right).
     * @type {string}
     */
    static MODE_HORIZONTAL = MODE_HORIZONTAL;

    /**
     * Vertical navigation (up/down).
     * @type {string}
     */
    static MODE_VERTICAL = MODE_VERTICAL;

    /**
     * All directions navigation.
     * @type {string}
     */
    static MODE_BOTH = MODE_BOTH;

    /**
     * The type for a move action.
     * @type {string}
     */
    static TYPE_MOVE = TYPE_MOVE;

    /**
     * The type for a control action.
     * @type {string}
     */
    static TYPE_CONTROL = TYPE_CONTROL;

    /**
     * Navigation to the next element.
     * @type {string}
     */
    static ACTION_NEXT = ACTION_NEXT;

    /**
     * Navigation to the previous element.
     * @type {string}
     */
    static ACTION_PREVIOUS = ACTION_PREVIOUS;

    /**
     * Validates from the current element.
     * @type {string}
     */
    static ACTION_VALIDATE = ACTION_VALIDATE;

    /**
     * Cancels from the current element.
     * @type {string}
     */
    static ACTION_CANCEL = ACTION_CANCEL;

    /**
     * Deletes from the current element.
     * @type {string}
     */
    static ACTION_DELETE = ACTION_DELETE;

    /**
     * The identifier for a move up keystroke.
     * @type {string}
     */
    static KEYSTROKE_UP = KEYSTROKE_UP;

    /**
     * The identifier for a move down keystroke.
     * @type {string}
     */
    static KEYSTROKE_DOWN = KEYSTROKE_DOWN;

    /**
     * The identifier for a move left keystroke.
     * @type {string}
     */
    static KEYSTROKE_LEFT = KEYSTROKE_LEFT;

    /**
     * The identifier for a move right keystroke.
     * @type {string}
     */
    static KEYSTROKE_RIGHT = KEYSTROKE_RIGHT;

    /**
     * The identifier for a spacebar keystroke.
     * @type {string}
     */
    static KEYSTROKE_SPACEBAR = KEYSTROKE_SPACEBAR;

    /**
     * The identifier for an enter keystroke.
     * @type {string}
     */
    static KEYSTROKE_ENTER = KEYSTROKE_ENTER;

    /**
     * The identifier for an escape keystroke.
     * @type {string}
     */
    static KEYSTROKE_ESCAPE = KEYSTROKE_ESCAPE;

    /**
     * The identifier for a delete keystroke.
     * @type {string}
     */
    static KEYSTROKE_DELETE = KEYSTROKE_DELETE;

    /**
     * The identifier for a backspace keystroke.
     * @type {string}
     */
    static KEYSTROKE_BACKSPACE = KEYSTROKE_BACKSPACE;

    /**
     * Identifies a keystroke.
     * When the allowed type is specified, the keystroke will be identified only if its type matches.
     * @param {string} key - The key to identify.
     * @param {string} allowedType - The allowed type of action.
     * @returns {managedKeystroke} - The descriptor of the managed keystroke, or `null`.
     */
    static identify(key, allowedType) {
        const keystroke = this.keystroke(key);
        if (!keystroke) {
            return null;
        }

        const { type, mode, action } = actions[keystroke];

        if (allowedType && type !== allowedType) {
            return null;
        }

        return { keystroke, type, mode, action };
    }

    /**
     * Gets the keystroke from a key identifier.
     * @param {string} key - The key identifier to check.
     * @returns {string} - Returns the keystroke of the key, or `undefined`.
     */
    static keystroke(key) {
        return keystrokes[key];
    }
}

/**
 * Notifies an action.
 * @event action
 * @param {string} action - The action identifier.
 * @param {string} keystroke - The keystroke identifier.
 * @param {string} key - The key that triggered the action.
 */

/**
 * Notifies a move next action.
 * @event next
 * @param {string} keystroke - The keystroke identifier.
 * @param {string} key - The key that triggered the action.
 */

/**
 * Notifies a move back action.
 * @event previous
 * @param {string} keystroke - The keystroke identifier.
 * @param {string} key - The key that triggered the action.
 */

/**
 * Notifies a validation action.
 * @event validate
 * @param {string} keystroke - The keystroke identifier.
 * @param {string} key - The key that triggered the action.
 */

/**
 * Notifies a cancellation action.
 * @event cancel
 * @param {string} keystroke - The keystroke identifier.
 * @param {string} key - The key that triggered the action.
 */

/**
 * Notifies a deletion action.
 * @event delete
 * @param {string} keystroke - The keystroke identifier.
 * @param {string} key - The key that triggered the action.
 */

/**
 * Represents a managed keystroke.
 * @typedef {object} managedKeystroke
 * @property {string} keystroke - The keystroke
 * @property {string} type - The type of action
 * @property {string} mode - The mode related to the keystroke
 * @property {string} action - The action identifier
 */
