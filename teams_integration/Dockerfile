FROM python:3.12-slim
ARG UV_VERSION=0.5.4

# Upgrade pip and install the required uv version
RUN pip install --upgrade pip &&\
    pip install uv==${UV_VERSION}

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Export dependencies from the 'agent' group to requirements.txt
RUN uv export --group ms-integration --no-hashes --format requirements-txt > requirements.txt

# Install dependencies using pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the agent code
COPY teams_integration ./teams_integration

EXPOSE 3978

CMD ["python", "-m", "teams_integration.app"]