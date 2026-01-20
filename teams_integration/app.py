# app.py

# Code adapted from: https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/quickstart?tabs=csharp&pivots=python
from microsoft_agents.hosting.core import (
   AgentApplication,
   TurnState,
   TurnContext,
   MemoryStorage,
)
from microsoft_agents.activity import Activity
from microsoft_agents.hosting.aiohttp import CloudAdapter
from .start_server import start_server
# from agent.main import agent
import json
import asyncio
import aiohttp

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

# Function to keep sending typing activities
async def keep_typing(context: TurnContext, stop_event: asyncio.Event):
    while not stop_event.is_set():
        # Send a typing activity
        await context.send_activity(Activity(type="typing"))
        # Wait 3 seconds before sending another (less than the visual effect duration)
        try:
            await asyncio.wait_for(stop_event.wait(), timeout=3.0)
        except asyncio.TimeoutError:
            continue # If time passes and no stop, repeat the loop


@AGENT_APP.activity("message")
async def on_message(context: TurnContext, _):

    stop_typing = asyncio.Event()

    # Start the typing indicator task
    typing_task = asyncio.create_task(keep_typing(context, stop_typing))

    typing_activity = Activity(type="typing")
    await context.send_activity(typing_activity)

    payload = {
        "message": context.activity.text,
        "user_id": context.activity.from_property.id,
        "conversation_id": context.activity.conversation.id
    }
    
    try:
        async with aiohttp.ClientSession() as session:
                async with session.post(url="https://lawyer-agent-api-214571216460.us-central1.run.app/chat", json=payload) as response:
                    
                    # Stop the typing indicator immediately
                    stop_typing.set()
                    await typing_task # Wait for the typing task to finish

                    if response.status != 200:
                        await context.send_activity("Error connecting to the agent service.")
                        return

                    data = await response.json()
                    agent_response = data.get("response")
                    
                    await context.send_activity(agent_response)

    except Exception as e:
        # Stop the typing indicator in case of error
        stop_typing.set()
        await typing_task # Wait for the typing task to finish

        await context.send_activity(f"An error occurred: {str(e)}")


if __name__ == "__main__":
    try:
        start_server(AGENT_APP, None)
    except Exception as error:
        raise error