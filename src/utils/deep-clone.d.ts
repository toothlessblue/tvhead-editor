// included module 'deep-clone' doesn't appear to have a declarations module :T
// this is just here to make the error go away

declare module 'deep-clone' {
    export default function<T extends Object | Array> (input: T): T;
}
