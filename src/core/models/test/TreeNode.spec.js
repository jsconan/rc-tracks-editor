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

import { TreeNode } from '../TreeNode.js';

const ordered = [0, 1, 2, 3, 4, 5, 6];
const random = [4, 1, 5, 3, 0, 6, 2];
class Comparable {
    constructor(key) {
        this.key = key;
    }

    compare(other) {
        return this.key - other.key;
    }
}

describe('TreeNode', () => {
    it('is a class', () => {
        expect(TreeNode).toEqual(expect.any(Function));
    });

    it('creates a tree node', () => {
        expect(TreeNode.create()).toBe(TreeNode.NIL);
        expect(TreeNode.create(null, 'foo')).toBe(TreeNode.NIL);

        const node = TreeNode.create('foo', 'bar');
        expect(node.key).toBe('foo');
        expect(node.value).toBe('bar');
        expect(node.level).toBe(1);
        expect(node.left).toBe(TreeNode.NIL);
        expect(node.right).toBe(TreeNode.NIL);
    });

    it('implements the iteration protocol', () => {
        let tree = TreeNode.create();
        random.forEach(node => (tree = tree.insert(node, node)));

        expect(tree[Symbol.iterator]).toEqual(expect.any(Function));
        expect(tree[Symbol.iterator]()).not.toBe(tree[Symbol.iterator]());
        expect([...tree]).toMatchSnapshot();
    });

    it('produces an iterator to loop over the keys', () => {
        let tree = TreeNode.create();
        random.forEach(node => (tree = tree.insert(node)));

        expect(tree.keys).toEqual(expect.any(Function));
        expect(tree.keys()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(tree.keys()).not.toBe(tree.keys());
        expect([...tree.keys()]).toStrictEqual(ordered);
    });

    it('produces an iterator to loop over the values', () => {
        let tree = TreeNode.create();
        random.forEach(node => (tree = tree.insert(node, node)));

        expect(tree.values).toEqual(expect.any(Function));
        expect(tree.values()[Symbol.iterator]).toEqual(expect.any(Function));

        expect(tree.values()).not.toBe(tree.values());
        expect([...tree.values()]).toStrictEqual(ordered);
    });

    it('visits each node in order', () => {
        let tree = TreeNode.create();
        random.forEach(node => (tree = tree.insert(node, node)));

        expect(tree.forEach).toEqual(expect.any(Function));

        const iterator = ordered[Symbol.iterator]();
        const callback = jest.fn().mockImplementation(function (node) {
            expect(this).toBe(node);
            expect(node).toBeInstanceOf(TreeNode);
            expect(node).not.toBe(TreeNode.NIL);
            expect(node.key).toBe(iterator.next().value);
        });

        expect(tree.forEach(callback)).toBe(tree);
        expect(callback).toHaveBeenCalledTimes(ordered.length);
    });

    it('needs a valid callback to visit nodes', () => {
        expect(() => TreeNode.create().forEach()).toThrow('A callback function is expected!');
    });

    it('maps each node in order', () => {
        let tree = TreeNode.create();
        random.forEach(node => (tree = tree.insert(node, node)));

        expect(tree.map).toEqual(expect.any(Function));

        const iterator = ordered[Symbol.iterator]();
        const callback = jest.fn().mockImplementation(function (node) {
            expect(this).toBe(node);
            expect(node).toBeInstanceOf(TreeNode);
            expect(node).not.toBe(TreeNode.NIL);
            expect(node.key).toBe(iterator.next().value);
            return node.key;
        });

        expect(tree.map(callback)).toEqual(ordered);
        expect(callback).toHaveBeenCalledTimes(ordered.length);
    });

    it('needs a valid callback to map nodes', () => {
        expect(() => TreeNode.create().map()).toThrow('A callback function is expected!');
    });

    it('searches for a node in the subtree', () => {
        let tree = TreeNode.create();
        expect(tree.search(node => TreeNode.compare(1, node.key))).toBe(TreeNode.NIL);

        tree = tree.insert(0);
        expect(tree.search(node => TreeNode.compare(0, node.key))).toMatchSnapshot();
        expect(tree.search(node => TreeNode.compare(1, node.key))).toBe(TreeNode.NIL);

        random.forEach(node => (tree = tree.insert(node)));
        random.forEach(value => expect(tree.search(node => TreeNode.compare(value, node.key))).toMatchSnapshot());

        expect(tree.search(node => TreeNode.compare(-10, node.key))).toBe(TreeNode.NIL);
        expect(tree.search(node => TreeNode.compare(10, node.key))).toBe(TreeNode.NIL);
    });

    it('needs a valid callback for searching a node', () => {
        expect(() => TreeNode.create().search()).toThrow('A callback function is expected!');
    });

    it('lookups for a node in the subtree', () => {
        let tree = TreeNode.create();
        expect(tree.lookup(1)).toBe(TreeNode.NIL);

        tree = tree.insert(0);
        expect(tree.lookup(0)).toMatchSnapshot();
        expect(tree.lookup(1)).toBe(TreeNode.NIL);

        random.forEach(node => (tree = tree.insert(node)));
        random.forEach(value => expect(tree.lookup(value)).toMatchSnapshot());

        expect(tree.lookup(-10)).toBe(TreeNode.NIL);
        expect(tree.lookup(10)).toBe(TreeNode.NIL);
    });

    it('tells if a key exists in the subtree', () => {
        let tree = TreeNode.create();
        expect(tree.has(1)).toBeFalsy();

        tree = tree.insert(0);
        expect(tree.has(0)).toBeTruthy();
        expect(tree.has(1)).toBeFalsy();

        random.forEach(node => (tree = tree.insert(node)));
        random.forEach(value => expect(tree.has(value)).toBeTruthy());

        expect(tree.has(-10)).toBeFalsy();
        expect(tree.has(10)).toBeFalsy();
    });

    it('gets the value of a node', () => {
        let tree = TreeNode.create();
        expect(tree.get(1)).toBeUndefined();

        tree = tree.insert(0, 0);
        expect(tree.get(0)).toBe(0);
        expect(tree.get(1)).toBeUndefined();

        random.forEach(node => (tree = tree.insert(node, node)));
        random.forEach(value => expect(tree.get(value)).toBe(value));

        expect(tree.get(-10)).toBeUndefined();
        expect(tree.get(10)).toBeUndefined();
    });

    it('gets the next node in the subtree', () => {
        let tree = TreeNode.create();
        expect(tree.next()).toBe(TreeNode.NIL);

        tree = tree.insert('A');
        expect(tree.next()).toBe(TreeNode.NIL);

        tree = tree.insert('B');
        expect(tree.next()).toMatchSnapshot();

        tree = tree.insert('C');
        expect(tree.next()).toMatchSnapshot();

        tree = tree.insert('D').insert('E').insert('F').insert('G');
        expect(tree.next()).toMatchSnapshot();
    });

    it('gets the previous node in the subtree', () => {
        let tree = TreeNode.create();
        expect(tree.previous()).toBe(TreeNode.NIL);

        tree = tree.insert('A');
        expect(tree.previous()).toBe(TreeNode.NIL);

        tree = tree.insert('B');
        expect(tree.previous()).toBe(TreeNode.NIL);

        tree = tree.insert('C');
        expect(tree.previous()).toMatchSnapshot();

        tree = tree.insert('D');
        expect(tree.previous()).toMatchSnapshot();

        tree = tree.insert('E').insert('F').insert('G');
        expect(tree.previous()).toMatchSnapshot();
    });

    describe('exports a subtree to JSON', () => {
        it('from a terminator', () => {
            expect(TreeNode.NIL.toJSON()).toBeNull();
        });

        it('from a single node', () => {
            const tree = new TreeNode('A');
            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('from a single node having a value', () => {
            const tree = new TreeNode('A', 'a');
            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('from a single branch', () => {
            const tree = TreeNode.create('B').insert('A');
            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('from a single branch having values', () => {
            const tree = TreeNode.create('B', 'b').insert('A', 'a');
            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('from a subtree', () => {
            const tree = TreeNode.create('A').insert('B').insert('C');
            expect(tree.toJSON()).toMatchSnapshot();
        });

        it('from a subtree with values', () => {
            const tree = TreeNode.create('A', 'a').insert('B', 'b').insert('C', 'c');
            expect(tree.toJSON()).toMatchSnapshot();
        });
    });

    describe('balances a subtree', () => {
        describe('applying a skew', () => {
            it('on the terminator', () => {
                expect(TreeNode.NIL.skew()).toBe(TreeNode.NIL);
            });

            it('on a leaf', () => {
                const node = new TreeNode('A');
                expect(node.skew()).toBe(node);
            });

            it('on a balanced pair', () => {
                const a = new TreeNode('A');
                const b = new TreeNode('B');
                a.right = b;

                expect(a.skew()).toBe(a);
                expect(a.left).toBe(TreeNode.NIL);
                expect(a.right).toBe(b);
                expect(b.left).toBe(TreeNode.NIL);
                expect(b.right).toBe(TreeNode.NIL);
            });

            it('on an unbalanced pair', () => {
                const a = new TreeNode('A');
                const b = new TreeNode('B');
                a.left = b;

                expect(a.skew()).toBe(b);
                expect(a.left).toBe(TreeNode.NIL);
                expect(a.right).toBe(TreeNode.NIL);
                expect(b.left).toBe(TreeNode.NIL);
                expect(b.right).toBe(a);
            });

            it('on a balanced subtree', () => {
                const a = new TreeNode('A', null, 1);
                const b = new TreeNode('B', null, 1);
                const c = new TreeNode('C', null, 2);
                const d = new TreeNode('D', null, 2);
                const e = new TreeNode('E', null, 1);
                c.left = a;
                c.right = d;
                d.left = b;
                d.right = e;

                expect(c.skew()).toBe(c);
                expect(a.left).toBe(TreeNode.NIL);
                expect(a.right).toBe(TreeNode.NIL);
                expect(b.left).toBe(TreeNode.NIL);
                expect(b.right).toBe(TreeNode.NIL);
                expect(c.left).toBe(a);
                expect(c.right).toBe(d);
                expect(d.left).toBe(b);
                expect(d.right).toBe(e);
                expect(e.left).toBe(TreeNode.NIL);
                expect(e.right).toBe(TreeNode.NIL);
            });

            it('on an unbalanced subtree', () => {
                const a = new TreeNode('A', null, 1);
                const b = new TreeNode('B', null, 1);
                const c = new TreeNode('C', null, 2);
                const d = new TreeNode('D', null, 2);
                const e = new TreeNode('E', null, 1);
                c.left = a;
                c.right = b;
                d.left = c;
                d.right = e;

                expect(d.skew()).toBe(c);
                expect(a.left).toBe(TreeNode.NIL);
                expect(a.right).toBe(TreeNode.NIL);
                expect(b.left).toBe(TreeNode.NIL);
                expect(b.right).toBe(TreeNode.NIL);
                expect(c.left).toBe(a);
                expect(c.right).toBe(d);
                expect(d.left).toBe(b);
                expect(d.right).toBe(e);
                expect(e.left).toBe(TreeNode.NIL);
                expect(e.right).toBe(TreeNode.NIL);
            });
        });

        describe('applying a split', () => {
            it('on the terminator', () => {
                expect(TreeNode.NIL.split()).toBe(TreeNode.NIL);
            });

            it('on a leaf', () => {
                const node = new TreeNode('A');
                expect(node.split()).toBe(node);
            });

            it('on a balanced pair', () => {
                const a = new TreeNode('A');
                const b = new TreeNode('B');
                a.right = b;

                expect(a.split()).toBe(a);
                expect(a.left).toBe(TreeNode.NIL);
                expect(a.right).toBe(b);
                expect(b.left).toBe(TreeNode.NIL);
                expect(b.right).toBe(TreeNode.NIL);
            });

            it('on an unbalanced pair', () => {
                const a = new TreeNode('A');
                const b = new TreeNode('B');
                a.left = b;

                expect(a.split()).toBe(a);
                expect(a.left).toBe(b);
                expect(a.right).toBe(TreeNode.NIL);
                expect(b.left).toBe(TreeNode.NIL);
                expect(b.right).toBe(TreeNode.NIL);
            });

            it('on a balanced subtree', () => {
                const a = new TreeNode('A', null, 1);
                const b = new TreeNode('B', null, 1);
                const c = new TreeNode('C', null, 2);
                const d = new TreeNode('D', null, 3);
                const e = new TreeNode('E', null, 2);
                c.left = a;
                c.right = b;
                d.left = c;
                d.right = e;

                expect(d.split()).toBe(d);
                expect(a.left).toBe(TreeNode.NIL);
                expect(a.right).toBe(TreeNode.NIL);
                expect(a.level).toBe(1);
                expect(b.left).toBe(TreeNode.NIL);
                expect(b.right).toBe(TreeNode.NIL);
                expect(b.level).toBe(1);
                expect(c.left).toBe(a);
                expect(c.right).toBe(b);
                expect(c.level).toBe(2);
                expect(d.left).toBe(c);
                expect(d.right).toBe(e);
                expect(d.level).toBe(3);
                expect(e.left).toBe(TreeNode.NIL);
                expect(e.right).toBe(TreeNode.NIL);
                expect(e.level).toBe(2);
            });

            it('on an unbalanced subtree', () => {
                const a = new TreeNode('A', null, 1);
                const b = new TreeNode('B', null, 1);
                const c = new TreeNode('C', null, 2);
                const d = new TreeNode('D', null, 2);
                const e = new TreeNode('E', null, 2);
                c.left = a;
                c.right = d;
                d.left = b;
                d.right = e;

                expect(c.split()).toBe(d);
                expect(a.left).toBe(TreeNode.NIL);
                expect(a.right).toBe(TreeNode.NIL);
                expect(a.level).toBe(1);
                expect(b.left).toBe(TreeNode.NIL);
                expect(b.right).toBe(TreeNode.NIL);
                expect(b.level).toBe(1);
                expect(c.left).toBe(a);
                expect(c.right).toBe(b);
                expect(c.level).toBe(2);
                expect(d.left).toBe(c);
                expect(d.right).toBe(e);
                expect(d.level).toBe(3);
                expect(e.left).toBe(TreeNode.NIL);
                expect(e.right).toBe(TreeNode.NIL);
                expect(e.level).toBe(2);
            });
        });
    });

    describe('inserts nodes', () => {
        it('on the terminator', () => {
            expect(TreeNode.NIL.insert(1)).toMatchSnapshot();
        });

        it.each([
            ['an ordered list', ordered],
            ['a random list', random]
        ])('from %s', (type, nodes) => {
            let tree = TreeNode.create();
            nodes.forEach(node => {
                tree = tree.insert(node);
                expect(tree).toMatchSnapshot();
            });
        });

        it('having keys implementing the compare method', () => {
            let tree = TreeNode.create();
            random.forEach(node => {
                tree = tree.insert(new Comparable(node));
                expect(tree).toMatchSnapshot();
            });
        });

        it('replacing existing keys', () => {
            const node = new TreeNode('foo', 'bar');

            expect(node.key).toBe('foo');
            expect(node.value).toBe('bar');

            node.insert('foo', 'baz');

            expect(node.key).toBe('foo');
            expect(node.value).toBe('baz');
        });

        it('returning a feedback', () => {
            const node = new TreeNode(1);
            const feedback = {};

            node.insert(2, null, feedback);
            expect(feedback.added).toBeTruthy();

            node.insert(2, '2', feedback);
            expect(feedback.added).toBeFalsy();
        });
    });

    describe('deletes nodes', () => {
        it('from the terminator', () => {
            expect(TreeNode.NIL.delete(null)).toBe(TreeNode.NIL);
        });

        it('from a leaf', () => {
            const node = new TreeNode('A');
            expect(node.delete('B')).toBe(node);
            expect(node.delete('A')).toBe(TreeNode.NIL);
        });

        it('from a branch', () => {
            const tree = TreeNode.create('A').insert('B');
            expect(tree.delete('C')).toBe(tree);
            expect(tree.delete('A')).toBe(tree);
            expect(tree.delete('B')).toBe(TreeNode.NIL);
        });

        it('from a subtree', () => {
            const tree = TreeNode.create('A').insert('B').insert('C');
            expect(tree.delete('D')).toBe(tree);
            expect(tree.delete('A')).toBe(tree);
            expect(tree.delete('B')).toBe(tree);
            expect(tree.delete('C')).toBe(TreeNode.NIL);
        });

        it.each(ordered)('from a subtree removing the key %s', key => {
            let tree = TreeNode.create();
            random.forEach(node => (tree = tree.insert(node, node)));
            tree = tree.delete(key);
            tree = tree.delete(key);
            expect(tree).toMatchSnapshot();
        });

        it('having keys implementing the compare method', () => {
            let tree = new TreeNode(new Comparable(0));
            random.forEach(key => (tree = tree.insert(new Comparable(key))));

            tree = tree.delete(new Comparable(3));
            tree = tree.delete(new Comparable(3));

            expect(tree).toMatchSnapshot();
        });

        it('returning a feedback', () => {
            let tree = new TreeNode(0);
            const feedback = {};
            ordered.forEach(key => (tree = tree.insert(key)));

            tree = tree.delete(3, feedback);
            expect(feedback.deleted).toBeTruthy();

            tree = tree.delete(3, feedback);
            expect(feedback.deleted).toBeFalsy();
        });
    });

    describe('has a static property', () => {
        describe('compare', () => {
            it('which compares values', () => {
                expect(TreeNode.compare(1, 2)).toBe(-1);
                expect(TreeNode.compare(2, 1)).toBe(1);
                expect(TreeNode.compare(3, 3)).toBe(0);
            });

            it('which compares object implementing a compare method', () => {
                expect(TreeNode.compare(new Comparable(1), new Comparable(2))).toBe(-1);
                expect(TreeNode.compare(new Comparable(2), new Comparable(1))).toBe(1);
                expect(TreeNode.compare(new Comparable(3), new Comparable(3))).toBe(0);
            });
        });
    });
});
