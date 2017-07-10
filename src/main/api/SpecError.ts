
export default class SpecError {
    private message: string
    private shortMessage: string
    private path: string

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