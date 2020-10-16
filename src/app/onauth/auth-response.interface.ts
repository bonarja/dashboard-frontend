export interface AuthResponse {
    at_hash: string;
    aud: Array<string>;
    auth_time: number;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    nombre: string;
    nonce: string;
    rat: number;
    sid: string;
    sub: string;
    tienda: string;
    privileges: Array<string>;
}
