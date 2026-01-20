# app.py

# Code adapted from: https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/quickstart?tabs=csharp&pivots=python
from microsoft_agents.hosting.core import (
   AgentApplication,
   TurnState,
   TurnContext,
   MemoryStorage,
)
from microsoft_agents.hosting.aiohttp import CloudAdapter
from .start_server import start_server
# from agent.main import agent
import requests
import json
from loguru import logger

AGENT_APP = AgentApplication[TurnState](
    storage=MemoryStorage(), adapter=CloudAdapter()
)

async def _help(context: TurnContext, _: TurnState):
    await context.send_activity(
        "Welcome to the Echo Agent sample 🚀. "
        "Type /help for help or send a message to see the echo feature in action."
    )

AGENT_APP.conversation_update("membersAdded")(_help)

AGENT_APP.message("/help")(_help)


@AGENT_APP.activity("message")
async def on_message(context: TurnContext, _):
    payload = json.dumps({
        "message": context.activity.text,
        "user_id": context.activity.from_property.id,
        "conversation_id": context.activity.conversation.id
    })
    response = requests.post(url="https://lawyer-agent-api-214571216460.us-central1.run.app/chat", data=payload)
    if response.status_code != 200: 
        logger.error(f"Error in sending the requests: status_code = {response.status_code}, response = {response.text}")

    agent_response = response.json()["response"]
    await context.send_activity(agent_response)

if __name__ == "__main__":
    try:
        start_server(AGENT_APP, None)
    except Exception as error:
        raise error