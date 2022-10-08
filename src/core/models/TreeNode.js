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

import { getCompare, validateCallback } from '../helpers';

/**
 * Represents a node in an auto-balanced tree.
 */
export class TreeNode {
    /**
     * Creates a tree node having the given key and value.
     * @param {*} key - The key of the node.
     * @param {*} value - The value carried by the node.
     * @param {number} level - The balance level of the tree.
     */
    constructor(key, value = null, level = 1) {
        this.key = key;
        this.value = value;
        this.level = level;
        this.left = TreeNode.NIL;
        this.right = TreeNode.NIL;
    }

    /**
     * Lookups for a key in the subtree and tells whether it exists or not.
     * @param {*} key - The searched key.
     * @returns {boolean} - Returns `true` if the key exists in the subtree.
     */
    has(key) {
        if (this.lookup(key) !== TreeNode.NIL) {
            return true;
        }
        return false;
    }

    /**
     * Lookups for a key in the subtree.
     * @param {*} key - The searched key.
     * @returns {*} - Returns the value for the searched key, or `undefined` if not found.
     */
    get(key) {
        const found = this.lookup(key);

        if (found !== TreeNode.NIL) {
            return found.value;
        }
    }

    /**
     * Lookups for a node in a subtree.
     * @param {*} key - The key of the searched node.
     * @returns {TreeNode} - Returns the node corresponding to the searched key, or NIL if not found.
     */
    lookup(key) {
        const compare = getCompare(key);
        return this.search(node => compare(key, node.key));
    }

    /**
     * Visits each node of a subtree in order.
     * @param {eachCallback} callback - A function called on each node of the subtree.
     * @returns {TreeNode} - Returns the root of the subtree.
     * @throws {TypeError} - If the callback is not supplied or is not a function.
     */
    forEach(callback) {
        validateCallback(callback);

        for (const node of this) {
            callback.call(node, node);
        }

        return this;
    }

    /**
     * Creates an array, visiting each node of a subtree in order and mapping it.
     * @param {eachCallback} callback - A function called on each node of the subtree.
     * @returns {Array} - Returns a array produced from the visit of each node in order.
     * @throws {TypeError} - If the callback is not supplied or is not a function.
     */
    map(callback) {
        validateCallback(callback);

        const result = [];
        for (const node of this) {
            result.push(callback.call(node, node));
        }

        return result;
    }

    /**
     * Visits each key of a subtree in order.
     * @yields {*} - The next key in th subtree.
     * @generator
     */
    *keys() {
        for (const { key } of this) {
            yield key;
        }
    }

    /**
     * Visits each value of a subtree in order.
     * @yields {*} - The next key in th subtree.
     * @generator
     */
    *values() {
        for (const { value } of this) {
            yield value;
        }
    }

    /**
     * Visits each node of a subtree in order.
     * @yields {TreeNode} - The next node in the subtree.
     * @generator
     */
    *[Symbol.iterator]() {
        // eslint-disable-next-line
        let node = this;
        const stack = [];
        while (stack.length || node !== TreeNode.NIL) {
            if (node !== TreeNode.NIL) {
                stack.push(node);
                node = node.left;
            } else {
                node = stack.pop();
                yield node;
                node = node.right;
            }
        }
    }

    /**
     * Searches for a node in a subtree.
     * @param {lookupCallback} compare - A function called to search for a node in the subtree.
     * @returns {TreeNode} - Returns the node corresponding to the search, or NIL if not found.
     * @throws {TypeError} - If the callback is not supplied or is not a function.
     */
    search(compare) {
        validateCallback(compare);

        // eslint-disable-next-line
        let node = this;
        let comparison;
        while (node !== TreeNode.NIL && (comparison = compare(node))) {
            if (comparison < 0) {
                node = node.left;
            } else {
                node = node.right;
            }
        }

        return node;
    }

    /**
     * Exports the subtree to JSON.
     * @returns {object} - A JSON representation of the subtree.
     */
    toJSON() {
        if (this === TreeNode.NIL) {
            return null;
        }

        const { key, value } = this;
        const json = { key };

        if (value !== null) {
            json.value = value;
        }

        if (this.left !== TreeNode.NIL) {
            json.left = this.left.toJSON();
        }

        if (this.right !== TreeNode.NIL) {
            json.right = this.right.toJSON();
        }

        return json;
    }

    /**
     * Inserts a node into a subtree.
     * @param {*} key - The key of the new node.
     * @param {*} value - The value carried by the new node.
     * @param {object} feedback - A feedback object that will receive the insertion flag:
     * `added=true` for an addition or `added=false` for a replace.
     * @returns {TreeNode} - The new root of the balanced tree.
     */
    insert(key, value = null, feedback = {}) {
        const compare = getCompare(key);
        feedback.added = false;

        /**
         * @param {TreeNode} node
         * @returns {TreeNode}
         * @private
         */
        function insertNode(node) {
            // We reached a leaf, we can add a new node.
            if (node === TreeNode.NIL) {
                feedback.added = true;
                return new node.constructor(key, value);
            }

            const comparison = compare(key, node.key);

            if (!comparison) {
                // We found a node with the same key, we update it.
                node.key = key;
                node.value = value;
                return node;
            }

            if (comparison < 0) {
                node.left = node.left.insert(key, value, feedback);
            } else {
                node.right = node.right.insert(key, value, feedback);
            }

            // Balance the tree
            return node.skew().split();
        }

        return insertNode(this);
    }

    /**
     * Removes a node from a subtree.
     * @param {string} key - The key of the node to remove.
     * @param {object} feedback - A feedback object that will receive the deletion flag:
     * `deleted=true` if a node was actually removed or `deleted=false` for a miss.
     * @returns {TreeNode} - The new root of the balanced tree.
     */
    delete(key, feedback = {}) {
        const compare = getCompare(key);
        let last = TreeNode.NIL;
        let deleted = TreeNode.NIL;
        feedback.deleted = false;

        /**
         * @param {TreeNode} node
         * @returns {TreeNode}
         * @private
         */
        function deleteNode(node) {
            if (node === TreeNode.NIL) {
                return node;
            }

            // Search down the tree.
            last = node;
            if (compare(key, node.key) < 0) {
                node.left = deleteNode(node.left);
            } else {
                deleted = node;
                node.right = deleteNode(node.right);
            }

            // At the bottom of the tree, we remove the node if it exists.
            if (node === last && deleted !== TreeNode.NIL && !compare(key, deleted.key)) {
                deleted.key = node.key;
                deleted.value = node.value;
                deleted = TreeNode.NIL;
                node = node.right;
                feedback.deleted = true;
                return node;
            }

            // On the way back, we balance the tree.
            const level = node.level - 1;
            if (node.left.level < level || node.right.level < level) {
                node.level = level;
                if (node.right.level > level) {
                    node.right.level = level;
                }

                node = node.skew();
                node.right = node.right.skew();
                node.right.right = node.right.right.skew();
                node = node.split();
                node.right = node.right.split();
            }

            return node;
        }

        return deleteNode(this);
    }

    /**
     * Gets the next node in the subtree.
     * @returns {TreeNode} - The next node in the subtree.
     */
    next() {
        if (this === TreeNode.NIL) {
            return this;
        }

        let node = this.right;

        if (node !== TreeNode.NIL) {
            while (node.left !== TreeNode.NIL) {
                node = node.left;
            }
        }

        return node;
    }

    /**
     * Gets the previous node in the subtree.
     * @returns {TreeNode} - The previous node in the subtree.
     */
    previous() {
        if (this === TreeNode.NIL) {
            return this;
        }

        let node = this.left;

        if (node !== TreeNode.NIL) {
            while (node.right !== TreeNode.NIL) {
                node = node.right;
            }
        }

        return node;
    }

    /**
     * Performs a right rotation to replace a subtree containing a left
     * horizontal link with one containing a right horizontal link instead.
     * @returns {TreeNode} - The new root of the balanced tree.
     */
    skew() {
        if (this === TreeNode.NIL) {
            return this;
        }

        if (this.left !== TreeNode.NIL && this.left.level === this.level) {
            const left = this.left;
            this.left = left.right;
            left.right = this;
            return left;
        }

        return this;
    }

    /**
     * Performs a left rotation and level increase to replace a subtree
     * containing two or more consecutive right horizontal links with one
     * containing two fewer consecutive right horizontal links.
     * @returns {TreeNode} - The new root of the balanced tree.
     */
    split() {
        if (this === TreeNode.NIL) {
            return this;
        }

        if (this.right !== TreeNode.NIL && this.right.right.level === this.level) {
            const right = this.right;
            this.right = right.left;
            right.left = this;
            right.level++;
            return right;
        }

        return this;
    }

    /**
     * Creates a node.
     * @param {*} key - The key of the new node.
     * @param {*} value - The value carried by the new node.
     * @returns {TreeNode} - The new node.
     */
    static create(key = null, value = null) {
        if (key === null) {
            return TreeNode.NIL;
        }

        return new this(key, value);
    }
}

/**
 * Represents a node terminator.
 * @constant {TreeNode} TreeNode.NIL
 */
TreeNode.NIL = null;
Object.defineProperty(TreeNode, 'NIL', {
    value: Object.freeze(new TreeNode(null, null, 0)),
    writable: false,
    enumerable: true,
    configurable: true
});

/**
 * Callback called when looking up for a node in a subtree.
 * Depending on its return, the search will stop with the current node (0),
 * or it will either explore the left (-1) or the right (1) branch.
 * @param {TreeNode} node - The current node being traversed.
 * @returns {number} - Must return 0 if the searched node has been found, or -1 to explore the left branch, or 1 to explore the right branch.
 * @callback lookupCallback
 */

/**
 * Callback called when visiting each node in a subtree.
 * It may return a value that will impact the result of the visit.
 * @param {TreeNode} node - The current node being traversed.
 * @returns {*} - It may return a value that will impact the result of the visit.
 * @callback eachCallback
 */
