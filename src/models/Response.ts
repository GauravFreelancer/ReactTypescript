export default interface Response<T> {
    data: T[],
    totalRecord: number,
    success: boolean,
    message: string
}