import json

from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from accounts.serializers import UserSerializer
from core.authenticate import CustomAuthentication
from core.models import ChatRoom, Message
from core.serializers import MessageSerializer


# async def message_to_json(message):
#     user = await sync_to_async(getattr)(message, 'user')
#     serializer = MessageSerializer(message)
#     data = serializer.data
#     return data
@database_sync_to_async
def message_to_json(message):
    serializer = MessageSerializer(message)
    data = serializer.data
    return data

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        cookie_header = dict(self.scope['headers']).get(b'cookie', b'').decode('utf-8')
        print("COOKIE_HEADER >>>", cookie_header)

        cookies = cookie_header.split('; ')
        print("Individual cookies:", cookies)

        raw_token = None

        for cookie in cookies:
            if cookie.startswith('access_token='):
                raw_token = cookie[len('access_token='):]
                break

        if raw_token is not None:
            try:
                user, _ = await CustomAuthentication().authenticate_with_token(raw_token)
                user_id = user.id if user else None
            except Exception as e:
                print("Authentication error:", e)
                await self.close()
                return

            if user_id is None:
                print("User not authenticated or token is invalid.")
                await self.accept()
                await self.send(text_data=json.dumps({"error": "User not authenticated or token is invalid."}))
                await self.close()
                return

            # Join room group
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = 'chat_%s' % self.room_name
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
        else:
            print("No access token found in cookies.")
            await self.accept()
            await self.send(text_data=json.dumps({"error": "No access token found in cookies"}))
            await self.close()


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_text = text_data_json['message']
    
        # Extract token from cookie header
        cookie_header = dict(self.scope['headers']).get(b'cookie', b'').decode('utf-8')
        cookies = cookie_header.split('; ')
        raw_token = None
        for cookie in cookies:
            if cookie.startswith('access_token='):
                raw_token = cookie[len('access_token='):]
                break
            
        user, token = await CustomAuthentication().authenticate_with_token(raw_token)
        user_id = user.id if user else None
    
        if user_id is None:
            await self.send(text_data=json.dumps({"error": "User not authenticated or token is invalid."}))
            return
    
        participant_ids = [int(id_str) for id_str in self.room_name.split('_')[1:]]
    
        chat_room, _ = await sync_to_async(ChatRoom.objects.get_or_create)(name=self.room_name)
        message = await sync_to_async(Message.objects.create)(room=chat_room, user_id=user_id, message=message_text)
    
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': await message_to_json(message),
                'user_id': user_id
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))
