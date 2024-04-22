from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        if b'cookie' in headers:
            cookies = headers[b'cookie'].decode()
            token_name = settings.SIMPLE_JWT['AUTH_COOKIE'] + '='
            if token_name in cookies:
                start = cookies.index(token_name) + len(token_name)
                token = cookies[start:].split(';')[0]
                scope['user'] = await self.get_user(token)
        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token):
        try:
            UntypedToken(token)
        except (InvalidToken, TokenError) as e:
            return AnonymousUser()
        else:
            decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return User.objects.get(id=decoded_data['user_id'])
