declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.svg';

// Extend NodeJS ProcessEnv if needed
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL?: string;
  }
}
