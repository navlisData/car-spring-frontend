// declare namespace NodeJS {
//     interface ProcessEnv {
//         BACKEND_HOST?: string;
//     }
// }

interface ImportMetaEnv {
    readonly VITE_BACKEND_HOST: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}