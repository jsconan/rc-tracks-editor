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

import { SVGPathCommand } from '../SVGPathCommand.js';
import { Vector2D } from '../Vector2D.js';

describe('SVGPathCommand', () => {
    it('is a class', () => {
        expect(SVGPathCommand).toEqual(expect.any(Function));
    });

    it('represents a command', () => {
        const command = new SVGPathCommand('C');
        expect(command.name).toEqual('C');
    });

    it('accepts to not have parameters', () => {
        const command = new SVGPathCommand('Z');
        expect(command.parameters).toStrictEqual([]);
    });

    it('accepts parameters', () => {
        const parameters = [1, 2, new Vector2D(3, 4)];
        const command = new SVGPathCommand('C', ...parameters);
        expect(command.parameters).toStrictEqual(parameters);
    });

    it('renders a command without parameters', () => {
        const command = new SVGPathCommand('Z');
        expect(command.toString()).toEqual('Z');
    });

    it('renders a command with its parameters', () => {
        const command = new SVGPathCommand('C', 1, 2, new Vector2D(3, 4));
        expect(command.toString()).toEqual('C 1 2 3,4');
    });
});
