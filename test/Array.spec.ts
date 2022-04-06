import { deepEqual, equal, ok } from 'assert';
import { deleteItem, isUnique } from '../src';

describe('Array', () =>
{
    it('equal', () =>
    {
        ok(Array.equal([1, 2, 3], [1, 2, 3]));

        ok(!Array.equal([{}, 2, 3], [{}, 2, 3]));

        const obj = {};
        ok(Array.equal([obj, 2, 3], [obj, 2, 3]));
    });

    it('isUnique', () =>
    {
        deepEqual(isUnique([1, 2, 3]), true);
        deepEqual(isUnique([1, 2, 2]), false);
    });

    it('concatToSelf', () =>
    {
        const arr = [0];
        Array.concatToSelf(arr, 1, 2, 3, [4, 5, 6], 7, 8, 9);

        const arr1 = Array(10).fill(0).map((_v, i) => i);

        ok(Array.equal(arr, arr1));
    });

    it('unique', () =>
    {
        const arr1 = Array(10000).fill(0).map((_v, _i) => (Math.random() < 0.1 ? null : Math.floor(10 * Math.random())));
        Array.unique(arr1);
        ok(arr1.length === 11);

        const arrObj = Array(10).fill(0).map((_v) => ({}));
        const arr2 = Array(10000).fill(0).map((_v, _i) => (arrObj[Math.floor(10 * Math.random())]));
        Array.unique(arr2);
        ok(arr2.length === 10);
    });

    it('delete', () =>
    {
        const arr1 = Array(10).fill(0).map((_v, i) => i);
        deleteItem(arr1, arr1[Math.floor(10 * Math.random())]);
        ok(arr1.length === 9);

        const arr2 = Array(10).fill(0).map((_v) => ({}));
        deleteItem(arr2, arr2[Math.floor(10 * Math.random())]);
        ok(arr2.length === 9);
    });

    it('replace', () =>
    {
        const arr1 = Array(10).fill(0).map((_v, i) => i);
        Array.replace(arr1, 5, 50);
        ok(arr1[5] === 50);

        Array.replace(arr1, 555, 999);
        ok(arr1[arr1.length - 1] === 999);
    });

    it('create', () =>
    {
        const arr = Array.create(100, (i) => i);
        for (let i = 0; i < arr.length; i++)
        {
            deepEqual(i, arr[i]);
        }
    });

    it('binarySearch', () =>
    {
        const arr = Array.create(100, () => Math.floor(Math.random() * 100));
        const compareFn = (a, b) => a - b;
        arr.sort(compareFn);
        const index = Math.floor(arr.length * Math.random());
        const find = Array.binarySearch(arr, arr[index], compareFn);
        deepEqual(find <= index, true);

        deepEqual(arr[index], arr[find]);
        if (find > 0)
        {
            equal(arr[find] - arr[find - 1] > 0, true);
        }
        if (find < arr.length - 1)
        {
            equal(arr[find] - arr[find + 1] <= 0, true);
        }

        deepEqual(-1, Array.binarySearch(arr, -1, compareFn));
    });

    it('binarySearchInsert', () =>
    {
        const arr = Array.create(100, () => Math.floor(Math.random() * 100));
        const compareFn = (a, b) => a - b;
        arr.sort(compareFn);

        const index = Math.floor(arr.length * Math.random());
        const find = Array.binarySearchInsert(arr, arr[index], compareFn);
        deepEqual(find <= index, true);

        deepEqual(0, Array.binarySearchInsert(arr, -1, compareFn));

        deepEqual(100, Array.binarySearchInsert(arr, 10000, compareFn));
    });
});
