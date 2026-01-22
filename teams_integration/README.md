# Teams Integration

In order to integrate the AI agent deployed in GCP, it is required to use an [Agent development tool](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-custom-engine-agent#agent-development-tool-comparison).

In this project, the Agents SDK is used due to it can be published in many Microsoft channels, such as MS Teams, MS 365 Copilit, custom websites, among others. Moreover, it can be implemented with any orchestrator and LLM desired (In this case, LangGraph and Gemini, respectively).

The basic structure of this folder was directly adapted from the [Quickstart: Create and test a basic agent](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/quickstart?tabs=csharp&pivots=python), from the Microsoft official documentation.

# Connect the Agent Deployed in GCP with Azure Bot Services

## 1 Create an instance of the Azure Bot Service

In the Azure Console, go to "Azure Bot" and create a new instance

## 2 Get the Azure Bot configuration values

In the Azure Console, inside Azure Bot, in the left menu, click in the **Configuration** option, and copy the values in:

- ***Microsoft App ID***
- ***Tenant ID***

## 3 Create a ClientSecret

In the same page where the configuration values were obtaned, click on "Manage passwords" (next to the Microsoft App ID), and create a Client Secret, and copy its value.

## 4 Make the copied values available as environment variables in the GCP instance

In order to the Microsoft 365 Agent SDK could retrieve those values, it is required to set this values as environment variables with the following names:

- CONNECTIONS__SERVICE_CONNECTION__SETTINGS__CLIENTID = < Microsoft App ID >
- CONNECTIONS__SERVICE_CONNECTION__SETTINGS__TENANTID = < Tenant ID >
- CONNECTIONS__SERVICE_CONNECTION__SETTINGS__CLIENTSECRET = < Client Secret >

To know more about the authentication, see the [official documentation](https://github.com/microsoft/Agents-for-python/blob/6019cac2c0dca6fb952acd6a4ab0b5bf3afc9d86/libraries/microsoft-agents-authentication-msal/readme.md#L56-L129)