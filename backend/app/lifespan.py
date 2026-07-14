from app.database import client


def shutdown_db():
    client.close()
