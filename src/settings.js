require('dotenv').config();

const settings = {
  port: process.env.PORT || 8080,
  gcp_identity_api_key: process.env.GCP_IDENTITY_API_KEY,
  gcp_identity_default_tenant_id: process.env.GCP_IDENTITY_DEFAULT_TENANT_ID,
  gcp_project_id: process.env.GCP_PROJECT_ID,
  gcp_sa_client_email: process.env.GCP_SA_CLIENT_EMAIL,
  gcp_sa_private_key: process.env.GCP_SA_PRIVATE_KEY,
};

module.exports = settings;
