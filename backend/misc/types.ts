export type ErrorCode = readonly [code: string, message: string];

export interface Response {
    success: boolean;
    code: string;
    data: any;
    message: string;
}