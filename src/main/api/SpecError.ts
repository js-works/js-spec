
export default class SpecError {
    public message: string
    public shortMessage: string
    public path: string

    constructor(message: string, shortMessage: string = null, path: string = null) {
        this.message = message;
        this.shortMessage = shortMessage;
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