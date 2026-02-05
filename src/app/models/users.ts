export type Gender = 'male' | 'female';

export class User {
  constructor(
    public id: number | null,
    public email: string,
    public password: string,
    public fullName: string,
    public birthDate: string,
    public gender: Gender,
    public imageUrl: string
  ) {}
}