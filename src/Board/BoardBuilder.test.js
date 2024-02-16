/* eslint-disable no-undef */
import BoardBuilder, { RELATIVE_POSITIONS } from './BoardBuilder';
import Ship, { GRAPHICAL_TYPES, INTERNAL_TYPES, PLAY_TYPES } from './Ship';
import { act } from 'react-dom/test-utils';

test('board dimensions', () => {
    expect(new BoardBuilder(8, 8).width).toEqual(8);
    expect(new BoardBuilder(8, 8).height).toEqual(8);
});

test('pre-existing ships', () => {
    const preset = new BoardBuilder(4, 4).setShip([2, 3], new Ship(PLAY_TYPES.SHIP)).setShip([1, 1], new Ship(PLAY_TYPES.WATER));
    expect(new BoardBuilder(4, 4, preset).boardState[0]).toStrictEqual(new Ship(PLAY_TYPES.WATER));
    expect(new BoardBuilder(4, 4, preset).boardState[9]).toStrictEqual(new Ship(PLAY_TYPES.SHIP));
});

test('coordinatesToIndex', () => {
    expect(() => { new BoardBuilder().coordinatesToIndex([5, 7]); }).toThrow('Invalid input');
    expect(() => { new BoardBuilder(8, 8).coordinatesToIndex([5, 7.2]); }).toThrow('Invalid input');
    expect(() => { new BoardBuilder(8, 8).coordinatesToIndex([5.6, 7.2]); }).toThrow('Invalid input');
    expect(() => { new BoardBuilder(8, 8).coordinatesToIndex([5.6, 7]); }).toThrow('Invalid input');
    expect(new BoardBuilder(8, 8).coordinatesToIndex([5, 7])).toBe(52);
    expect(new BoardBuilder(4, 4).coordinatesToIndex([1, 2])).toBe(4);
});

test('setShip', async () => {
    const board = new BoardBuilder(8, 8);
    const ship = new Ship(PLAY_TYPES.WATER);

    await act(async () => {
        await board.setShip([1, 4], ship);
    });

    expect(board.boardState[board.coordinatesToIndex([1, 4])]).toEqual(ship);
});

test('getShip', () => {
    const board = new BoardBuilder(4, 4);
    const ship = new Ship(PLAY_TYPES.UKNOWN);

    expect(board.getShip([1, 2])).toEqual(ship);
    expect(board.getShip(0)).toEqual(ship);

    expect(() => { board.getShip(-1); }).toThrow('index');
    expect(() => { board.getShip([5, 4]); }).toThrow('coordinates');
});

test('relativePositionToIndex', () => {
    const board = new BoardBuilder(4, 4);

    expect(board.relativePositionToIndex([2, 3], RELATIVE_POSITIONS.RIGHT)).toBe(10);
    expect(board.relativePositionToIndex([2, 3], RELATIVE_POSITIONS.TOP_LEFT)).toBe(4);
    expect(board.relativePositionToIndex([2, 3], RELATIVE_POSITIONS.BOTTOM)).toBe(13);
});

test('setRelativeShip', () => {
    const board = new BoardBuilder(4, 4);
    const ship = new Ship(PLAY_TYPES.SHIP);

    expect(board.setRelativeShip([2, 3], RELATIVE_POSITIONS.TOP_LEFT, ship).getShip([1, 2])).toEqual(ship);
    expect(board.setRelativeShip([2, 3], RELATIVE_POSITIONS.RIGHT, ship).getShip([3, 3])).toEqual(ship);
    expect(board.setRelativeShip([2, 3], RELATIVE_POSITIONS.BOTTOM, ship).getShip([2, 4])).toEqual(ship);
});

test('getRelativeShip', () => {
    const board1 = new BoardBuilder(4, 4);
    const board2 = new BoardBuilder(4, 4);
    const ship1 = new Ship(PLAY_TYPES.SHIP);
    const ship2 = new Ship(PLAY_TYPES.WATER);

    board1.setShip([3, 1], ship1);
    board2.setShip([3, 3], ship2);

    expect(board1.getRelativeShip([2, 2], RELATIVE_POSITIONS.TOP_RIGHT)).toBe(ship1);
    expect(board2.getRelativeShip([2, 2], RELATIVE_POSITIONS.BOTTOM_RIGHT)).toBe(ship2);

    expect(board1.getRelativeShip([1, 1], RELATIVE_POSITIONS.TOP)).toBeNull();
    expect(board1.getRelativeShip([1, 4], RELATIVE_POSITIONS.BOTTOM)).toBeNull();
});

test('pinned ships', () => {
    const preset = new BoardBuilder(4, 4).setShip([2, 2], GRAPHICAL_TYPES.SINGLE, true);
    const board = new BoardBuilder(4, 4, preset)
    board.computeGraphicalTypes(); 

    expect(board.boardState).toEqual(preset.boardState);
})