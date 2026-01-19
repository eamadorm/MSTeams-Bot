GCP_PROJECT_ID=p-dev-gce-60pf

gcloud-auth:
	gcloud auth login
	gcloud config set project ${GCP_PROJECT_ID}
	gcloud auth application-default login
	gcloud auth application-default set-quota-project ${GCP_PROJECT_ID}

run-agent-server:
	uv run -m teams_integration.app

run-teams-dev:
	teamsapptester