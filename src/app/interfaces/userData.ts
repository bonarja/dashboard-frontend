export interface UserData {
    id?: string;
    active?: boolean;
    email: string;
    lastname: string;
    firstname: string;
    internalId?: string;
    legalId?: string;
    notes?: string;
    pass?: string;
    privileges: { [codeApp: string]: Array<string> };
}
