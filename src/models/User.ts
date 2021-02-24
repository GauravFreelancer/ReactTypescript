
export default interface IUser {
    _id: string,
    FirstName: string,
    LastName: string,
    Email: string,
    MobileNumber: string,
    Address: string,
    gender: string,
    hobby: { [key: string] : boolean },
    image:any,
    createdAt: Date,
    updatedAt: Date
}