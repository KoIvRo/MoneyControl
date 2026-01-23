import requests


class TestInternetConnection:
    """Класс для проверки соединения с интернетом."""

    def test_internet(self) -> None:
        """Тест интернет соединения."""
        assert requests.get("https://example.com").status_code == 200

    # def test_frontend_proxy_configuration(self):
    #     """Тест, может ли фронтенд подключиться к бекенду."""
    #     response = requests.get("http://localhost:3000/login", timeout=5)
    #     if response.status_code == 500:
    #         assert "proxy" in response.text.lower() or "ECONNREFUSED" in response.text
    #     elif response.status_code == 200:
    #         assert True
    #     else:
    #         assert False
