import os
import time
from redis.asyncio import Redis, ConnectionPool


class RedisClient:
    """Управление соединения с redis."""
    _instance = None
    _pool = None

    def __new__(cls):
        """Реализация singleton"""
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    @classmethod
    async def get_client(cls) -> Redis:
        """Получение коннекта."""
        if not cls._pool:
            cls._pool = ConnectionPool(
                host=os.environ.get("REDIS_HOST"),
                port=os.environ.get("REDIS_PORT"),
                db=0,
                decode_responses=True,
                max_connections=10
            )
        
        return cls._pool
    

class RedisBlacklist:
    """Методы для работы с blacklist в redis."""
    redis_set_name = "blacklist"

    @classmethod
    async def add_token(cls, token: str) -> None:
        """Добавление токена в blacklist."""
        redis_client: Redis = await RedisClient.get_client()

        await cls.delete_token(redis_client)

        expire_at = time.time() + 3600 # 1 час
        await redis_client.zadd(cls.redis_set_name, {token: expire_at})
    

    @classmethod
    async def check_token(cls, token: str) -> bool:
        """Есть ли токен в blacklist."""
        redis_client: Redis = await RedisClient.get_client()

        await cls.delete_token(redis_client)

        is_active = await redis_client.zscore(cls.redis_set_name, token)

        if is_active:
            return True
        return False
    
    @classmethod
    async def delete_token(cls, redis_client: Redis) -> None:
        """Удалит все просроченные токены."""
        await redis_client.zremrangebyscore(cls.redis_set_name, 0, time.time())
