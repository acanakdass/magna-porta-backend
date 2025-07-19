import { Injectable } from '@nestjs/common';
import {AwAuthRequest} from "../dtos/aw-auth-dtos/aw-auth-request";
import {AirwallexClient} from "../client";



// Server-side token cache
let cachedToken: string | null = null;
let tokenExpiry: Date | null = null;

@Injectable()
export class AwAuthService {

    private client: AirwallexClient;

    constructor() {
        this.client = new AirwallexClient();
    }
    /**
     * Get an authentication token from Airwallex API
     * The token is valid for 30 minutes and can be used for multiple API calls
     */
    async getAuthToken(authRequest:AwAuthRequest): Promise<string> {
        // Check if we have a valid cached token
        if (!authRequest.forceNew && cachedToken && tokenExpiry && new Date() < tokenExpiry) {
            console.log('Using cached token, valid until:', tokenExpiry);
            return cachedToken;
        }

        // Check if cached token is about to expire
        if (!authRequest.forceNew && cachedToken && tokenExpiry) {
            const now = new Date();
            const expiresIn = Math.floor((tokenExpiry.getTime() - now.getTime()) / 1000 / 60);

            if (expiresIn > 5) {
                console.log(`Cached token still valid for ${expiresIn} minutes.`);
                return cachedToken;
            }
            console.log('Token is about to expire, refreshing...');
        }

        console.log('Obtaining new Airwallex token...');
        try {
            const data =await this.client.getToken();

            if (!data || !data.token) {
                throw new Error('Invalid or missing token in Airwallex API response.');
            }

            // Cache the token and expiry date
            cachedToken = data.token;
            tokenExpiry = new Date(data.expires_at);

            console.log('New token obtained, valid until:', tokenExpiry);
            return data.token;
        } catch (error) {
            console.error('Error obtaining Airwallex authentication token:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });

            // Clear cache in case of failure
            cachedToken = null;
            tokenExpiry = null;

            throw new Error('Failed to authenticate with Airwallex API');
        }
    }



    /**
     * Clear the server-side token cache
     */
    clearTokenCache(): void {
        cachedToken = null;
        tokenExpiry = null;
        console.log('Token cache cleared.');
    }

    /**
     * Check if a specific token or an expiry date string is expired or about to expire
     * @param expiryDateString Expiry date as a string
     */
    isTokenExpiredOrExpiring(expiryDateString: string): boolean {
        const expiryDate = new Date(expiryDateString);
        const now = new Date();

        // Add a 5-minute buffer
        now.setMinutes(now.getMinutes() + 5);

        return now >= expiryDate;
    }
}