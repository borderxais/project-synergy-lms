interface CredentialResponse {
  credential: string;
  select_by: string;
  error?: string;
}

interface Google {
  accounts: {
    id: {
      initialize: (input: IdConfiguration) => void;
      renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
      prompt: () => void;
    };
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (response: CredentialResponse) => void;
      }) => {
        requestAccessToken: () => void;
      };
    };
  };
}

interface Window {
  google: Google;
}
