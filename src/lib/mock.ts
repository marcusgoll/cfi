import { useState, useEffect } from 'react';

// Simple hook to check the environment variable
export function useIsMock(): boolean {
    // Use NEXT_PUBLIC_ prefix for client-side accessible env vars
    return process.env.NEXT_PUBLIC_USE_MOCK === '1';
}

// Simulate network delay
const delay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

// Generic function to fetch mock data by entity name
export async function fetchMock<T>(entity: string): Promise<T> {
    const isTest = process.env.NODE_ENV === 'test';
    const mockEnabled = process.env.NEXT_PUBLIC_USE_MOCK === '1';

    if (!mockEnabled) {
        // In a real scenario, you might fetch from the actual API here
        // or throw an error if mock mode is expected but not enabled.
        console.warn(`fetchMock called for '${entity}' but NEXT_PUBLIC_USE_MOCK is not '1'. Returning empty data.`);
        // Return type-compatible empty data or handle appropriately
        return [] as T; // Assuming array data for simplicity, adjust as needed
    }

    console.log(`Fetching mock data for: ${entity}`);

    try {
        // Dynamically import the JSON file using Node.js compatible syntax
        // Note: For this to work optimally in Next.js build, ensure Node version supports JSON imports
        // Requires Node v17.5+ or specific experimental flags in older versions.
        // The `assert { type: 'json' }` helps Next.js optimize this during build.
        const dataModule = await import(`../../mocks/${entity}.json`, {
            assert: { type: 'json' },
        });

        const data: T = dataModule.default;

        // Add artificial delay unless in test environment
        if (!isTest) {
            await delay(300);
        }

        return data;
    } catch (error) {
        console.error(`Failed to fetch mock data for ${entity}:`, error);
        // Return empty/default data or re-throw, depending on desired handling
        // throw new Error(`Mock data file not found for ${entity}`);
        return [] as T; // Assuming array data for simplicity
    }
} 