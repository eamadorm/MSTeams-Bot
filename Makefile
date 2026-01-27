GCP_PROJECT_ID=p-dev-gce-60pf
GCP_REGION=us-central1
RESOURCE_GROUP=servicenow_ai_agent
REGISTRY_NAME=teams-bot
TEAMS_BOT_IMAGE=${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REGISTRY_NAME}/basic_agent:1.0.0

gcloud-auth:
	gcloud auth login
	gcloud config set project ${GCP_PROJECT_ID}
	gcloud auth application-default login
	gcloud auth application-default set-quota-project ${GCP_PROJECT_ID}

run-agent-server:
	uv run -m teams_integration.app

run-teams-dev:
	npm install -g @microsoft/teams-app-test-tool
	sudo apt-get update && sudo apt-get install -y xdg-utils
	teamsapptester

build-teams-image:
	docker build -f teams_integration/Dockerfile \
	-t ${TEAMS_BOT_IMAGE} .

run-teams-image:
	docker run -p 3978:3978 ${TEAMS_BOT_IMAGE}

push-teams-image:
	docker push ${TEAMS_BOT_IMAGE}

deploy-teams-image:
	gcloud run deploy teams-bot-api \
	--image=$(TEAMS_BOT_IMAGE) \
	--region=$(GCP_REGION) \
	--min-instances=0 \
	--allow-unauthenticated \
	--port=3978

build-deploy-agent:
	make build-teams-image
	make push-teams-image
	make deploy-teams-image


########## SENTINEL AI - AUTONOMOUS RISK ASSURANCE ##########
build-sentinel-image:
	cd sentinel-ai_-autonomous-risk-assurance && \
	docker build -t northamerica-south1-docker.pkg.dev/p-dev-stemilt-0sjp-1/gcp-demos/sentinel-ai-autonomous-risk-assurance:1.0.0 .

push-sentinel-image:
	docker push northamerica-south1-docker.pkg.dev/p-dev-stemilt-0sjp-1/gcp-demos/sentinel-ai-autonomous-risk-assurance:1.0.0

deploy-sentinel-image:
	gcloud run deploy sentinel-ai-autonomous-risk-assurance \
	--image=northamerica-south1-docker.pkg.dev/p-dev-stemilt-0sjp-1/gcp-demos/sentinel-ai-autonomous-risk-assurance:1.0.0 \
	--region=northamerica-south1 \
	--min-instances=0 \
	--allow-unauthenticated \
	--port=80

build-deploy-sentinel:
	make build-sentinel-image
	make push-sentinel-image
	make deploy-sentinel-image

########## CONTRACT INTELLIGENCE PLATFORM ##########
build-contract-image:
	cd contract-intelligence-platform && \
	docker build -t northamerica-south1-docker.pkg.dev/p-dev-stemilt-0sjp-1/gcp-demos/contract-intelligence-platform:1.0.0 .

push-contract-image:
	docker push northamerica-south1-docker.pkg.dev/p-dev-stemilt-0sjp-1/gcp-demos/contract-intelligence-platform:1.0.0

deploy-contract-image:
	gcloud run deploy contract-intelligence-platform \
	--image=northamerica-south1-docker.pkg.dev/p-dev-stemilt-0sjp-1/gcp-demos/contract-intelligence-platform:1.0.0 \
	--region=northamerica-south1 \
	--min-instances=0 \
	--allow-unauthenticated \
	--port=80

build-deploy-contract:
	make build-contract-image
	make push-contract-image
	make deploy-contract-image