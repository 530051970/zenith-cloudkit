from fastapi import APIRouter, WebSocket, WebSocketDisconnect


router = APIRouter(prefix="/bot", tags=["bot"])

@router.websocket("ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"message text was:{data}")
    except WebSocketDisconnect:
        print("Connection closed!")
        await websocket.close()