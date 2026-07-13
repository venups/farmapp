from app.utils.helpers import generate_id, sanitize_filename, validate_image_file, format_file_size


class TestHelpers:
    def test_generate_id(self):
        id1 = generate_id()
        id2 = generate_id()
        assert isinstance(id1, str)
        assert len(id1) == 12
        assert id1 != id2

    def test_sanitize_filename(self):
        result = sanitize_filename("my file (1).jpg")
        assert result is not None
        assert ".." not in sanitize_filename("../../../etc/passwd")

    def test_validate_image_file(self):
        assert validate_image_file("photo.jpg") is True
        assert validate_image_file("photo.jpeg") is True
        assert validate_image_file("photo.png") is True
        assert validate_image_file("photo.gif") is True
        assert validate_image_file("photo.webp") is True
        assert validate_image_file("document.pdf") is False
        assert validate_image_file("script.py") is False

    def test_format_file_size(self):
        result = format_file_size(500)
        assert "bytes" in result.lower()
        result = format_file_size(1024)
        assert "KB" in result
        result = format_file_size(1024 * 1024)
        assert "MB" in result
