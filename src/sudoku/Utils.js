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
}

export default Utils;