import bcrypt from "bcrypt";

export interface ICryptography {
  encrypt: (value: string) => Promise<string>;
}

export interface IDecryptography {
  decrypt: (value: string, compary: string) => Promise<Boolean>;
}

export class BcryptAdapter implements ICryptography {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hashSync(value, this.salt);
    return hash;
  }
}

export class DcryptAdapter implements IDecryptography {
  async decrypt(value: string, compareSync: string): Promise<Boolean> {
    const comparyHash = await bcrypt.compareSync(value, compareSync);
    return comparyHash;
  }
}
