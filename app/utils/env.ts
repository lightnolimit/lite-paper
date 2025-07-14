/**
 * Environment variable utility
 *
 * Provides a centralized way to access environment variables with proper validation
 * and default values. This ensures all environment variables are documented and
 * used consistently across the application.
 */

import logger from './logger';

// Logger for environment-related logs
const envLogger = logger;

/**
 * Get a required environment variable
 *
 * @param name - The name of the environment variable
 * @param defaultValue - Optional default value if the variable doesn't exist
 * @returns The value of the environment variable
 * @throws Error if the variable is required and not set
 */
export const getEnv = (name: string, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;

  if (value === undefined) {
    const error = `Environment variable ${name} is required but not set`;
    envLogger.error(error);
    throw new Error(error);
  }

  return value;
};

/**
 * Get a boolean environment variable
 *
 * @param name - The name of the environment variable
 * @param defaultValue - Optional default value if the variable doesn't exist
 * @returns The boolean value of the environment variable
 */
export const getBoolEnv = (name: string, defaultValue?: boolean): boolean => {
  const value = process.env[name];

  if (value === undefined) {
    return defaultValue ?? false;
  }

  return value.toLowerCase() === 'true';
};

/**
 * Get a numeric environment variable
 *
 * @param name - The name of the environment variable
 * @param defaultValue - Optional default value if the variable doesn't exist
 * @returns The numeric value of the environment variable
 */
export const getNumEnv = (name: string, defaultValue?: number): number => {
  const value = process.env[name];

  if (value === undefined) {
    return defaultValue ?? 0;
  }

  const num = Number(value);
  if (isNaN(num)) {
    envLogger.warn(`Environment variable ${name} is not a valid number: ${value}`);
    return defaultValue ?? 0;
  }

  return num;
};

/**
 * Environment variables used in the application
 */
export const env = {
  // Application mode
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  IS_PRODUCTION: getEnv('NODE_ENV', 'development') === 'production',
  IS_DEVELOPMENT: getEnv('NODE_ENV', 'development') === 'development',

  // Debugging
  DEBUG_MODE: getBoolEnv('NEXT_PUBLIC_DEBUG_MODE', false),

  // Add more environment variables here as needed
};

export default env;
