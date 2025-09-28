import { BUILD_ENV } from "@mocanetwork/airkit";
import { 
  MOCA_PARTNER_ID, 
  TICKET_CREDENTIAL_PROGRAM_ID, 
  FAN_CREDENTIAL_PROGRAM_ID,
  TICKET_SCHEMA_ID,
  FAN_CREDENTIAL_SCHEMA_ID,
  ISSUER_DID 
} from './constants';

export interface EnvironmentConfig {
  widgetUrl: string;
  apiUrl: string;
}

export interface MocaConfig {
  partnerId: string;
  issuerDid: string;
  credentials: {
    ticket: {
      programId: string;
      schemaId: string;
    };
    fan: {
      programId: string;
      schemaId: string;
    };
  };
  environment: 'development' | 'production';
}

export const ENVIRONMENT_CONFIGS: Record<string, EnvironmentConfig> = {
  [BUILD_ENV.STAGING]: {
    widgetUrl: "https://credential-widget.test.air3.com",
    apiUrl: "https://credential.api.test.air3.com",
  },
  [BUILD_ENV.SANDBOX]: {
    widgetUrl: "https://credential-widget.sandbox.air3.com",
    apiUrl: "https://credential.api.sandbox.air3.com",
  },
};

export const getEnvironmentConfig = (env: string): EnvironmentConfig => {
  return ENVIRONMENT_CONFIGS[env] || ENVIRONMENT_CONFIGS[BUILD_ENV.SANDBOX];
};

export const getMocaConfig = (): MocaConfig => {
  // Validate required environment variables
  if (!MOCA_PARTNER_ID) {
    throw new Error('MOCA_PARTNER_ID is not configured');
  }

  if (!ISSUER_DID) {
    throw new Error('ISSUER_DID is not configured');
  }

  return {
    partnerId: MOCA_PARTNER_ID,
    issuerDid: ISSUER_DID,
    credentials: {
      ticket: {
        programId: TICKET_CREDENTIAL_PROGRAM_ID,
        schemaId: TICKET_SCHEMA_ID,
      },
      fan: {
        programId: FAN_CREDENTIAL_PROGRAM_ID,
        schemaId: FAN_CREDENTIAL_SCHEMA_ID,
      },
    },
    environment: import.meta.env.NODE_ENV === 'production' ? 'production' : 'development',
  };
};

export const isMocaConfigurationValid = (): boolean => {
  try {
    getMocaConfig();
    return true;
  } catch {
    return false;
  }
};

// Helper functions for credential issuance
export const getTicketCredentialConfig = () => {
  const config = getMocaConfig();
  return {
    credentialId: config.credentials.ticket.programId,
    issuerDid: config.issuerDid,
    partnerId: config.partnerId,
  };
};

export const getFanCredentialConfig = () => {
  const config = getMocaConfig();
  return {
    credentialId: config.credentials.fan.programId,
    issuerDid: config.issuerDid,
    partnerId: config.partnerId,
  };
};
