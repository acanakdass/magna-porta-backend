import {Injectable} from "@nestjs/common";
import {AirwallexClient} from "../client";
import {AwAccountCreationRequest} from "../dtos/aw-account-dtos/aw-account-creation-request";
import {AwAccountCreationResponse} from "../dtos/aw-account-dtos/aw-account-creation-response";
import axios from "axios";
import {airwallexConfig} from "../config";
import {AwAuthService} from "./aw-auth.service";

/**
 * Service for creating and managing Airwallex accounts
 */
@Injectable()
export class AwAccountService {

    private client: AirwallexClient;

    constructor(private awAuthService: AwAuthService) {
        this.client = new AirwallexClient();
    }

    // /**
    //  * Save account information to the database
    //  *
    //  * @param email - User's email address
    //  * @param password - User's password (will be hashed)
    //  * @param businessName - Business name
    //  * @param airwallexAccountId - Account ID returned from Airwallex
    //  * @returns The created account record ID
    //  */
    // async saveAccount(
    //     email: string,
    //     password: string,
    //     businessName: string,
    //     airwallexAccountId: string
    // ): Promise<number> {
    //     try {
    //         console.log('Starting database operation: Creating simplified account record...');
    //
    //         // Hash the password for secure storage
    //         const hashedPassword = await bcrypt.hash(password, 10);
    //
    //         // Current timestamp
    //         const createdAt = new Date();
    //
    //
    //         // SQL query to insert account data with only the required fields
    //         const query = `
    //     INSERT INTO connected_accounts (
    //       email,
    //       password,
    //       business_name,
    //       airwallex_account_id,
    //       created_at,
    //       sca_setup
    //     ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    //
    //         // Define the values to be inserted
    //         const values = [
    //             email,               // email
    //             hashedPassword,       // password
    //             businessName,        // business_name
    //             airwallexAccountId,   // airwallex_account_id
    //             createdAt,           // created_at
    //             false                // sca_setup
    //         ];
    //
    //         console.log('Executing database query to save simplified account...');
    //
    //         // Execute the query
    //         const result = await pool.query(query, values);
    //
    //         console.log(`Database operation successful: Account saved with ID: ${result.rows[0].id}`);
    //
    //         return result.rows[0].id;
    //     } catch (error: any) {
    //         console.error('Database operation failed: Error saving account:', error);
    //         console.error('Error details:', {
    //             message: error.message,
    //             code: error.code,
    //             detail: error.detail
    //         });
    //         throw error;
    //     }
    // }

    /**
     * Create a new account with Airwallex
     * @param accountData - The account creation data
     * @returns Account creation response from Airwallex API
     */
    async createAccount(accountData: AwAccountCreationRequest): Promise<AwAccountCreationResponse> {
        try {
            // Get a fresh authentication token to ensure it's valid
            const token = await this.awAuthService.getAuthToken({onBehalfOf: undefined,forceNew: true});

            console.log('Creating Airwallex account with data:', accountData);

            // Add service_agreement_type if not provided
            if (!accountData.customer_agreements?.terms_and_conditions?.service_agreement_type) {
                accountData.customer_agreements.terms_and_conditions.service_agreement_type = 'FULL';
            }

            // Create a direct API call with the token
            const response = await  axios.request({
                url: `${airwallexConfig.baseUrl}/api/v1/accounts/create`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                data: accountData,
            });

            console.log('Account created successfully:', {
                id: response.data.id,
                status: response.data.status
            });

            return response.data;
        } catch (error: any) {
            console.error('Error creating Airwallex account:', error.response?.data || error.message);
            throw error;
        }
    }

    async getAccount(accountId: string): Promise<any> {
        try {
            return await this.client.get<any>(`/api/v1/accounts/${accountId}`);
        } catch (error: any) {
            console.error('Error retrieving Airwallex account:', error.response?.data || error.message);
            throw error;
        }
    }

}



