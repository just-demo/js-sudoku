class Utils {
    /**
     * Modifies current array instead of creating a copy, which is important in some cases
     */
    static remove(array, value) {
        const index = array.indexOf(value);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    static asSimpleString(matrix: number[][]): String {
        return matrix.map(line => line.join('')).join('').replace(/0/g, '.');
    }

    static parseSimpleString(flat: String): number[][] {
        const size = Math.sqrt(flat.length);
        const values = flat.replace(/\./g, '0').split('');
        const matrix = [];
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                matrix[row] = matrix[row] || [];
                matrix[row][col] = parseInt(values[row * size + col]);
            }
        }
        return matrix;
    }
}

export default Utils;