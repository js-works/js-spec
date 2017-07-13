
export default class SpecError {
    public message: string
    public hint: string
    public path: string

    constructor(message: string, hint: string = null, path: string = null) {
        this.message = message;
        this.hint = hint;
        this.path = path;
        Object.freeze(this);
    }

    /**
     * @hidden
     */
    toString() {
        return 'SpecError: '
            + this.message
            + (this.path ? `(path: ${this.path})` : '');
    }
}