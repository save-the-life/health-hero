// Fallback type definitions for Deno environment
// This file helps VS Code recognize Deno types if the extension is not active

declare namespace Deno {
    export var env: {
        get(key: string): string | undefined;
        toObject(): { [key: string]: string };
    };

    export interface HttpClient {
        close(): void;
    }

    export interface CreateHttpClientOptions {
        caCerts?: string[];
        cert?: string;
        key?: string;
    }

    export function createHttpClient(options: CreateHttpClientOptions): HttpClient;

    export function serve(handler: (req: Request) => Response | Promise<Response>, options?: any): void;
}
