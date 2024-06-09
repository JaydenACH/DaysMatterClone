from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
origins = ["http://localhost:3000", "http://192.168.0.87:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "data": [
            {
                "event": "Nathaniel Birthday",
                "start_date": "2024-05-27",
                "end_date": "",
                "on-going": True,
            },
            {
                "event": "Ellysia Birthday",
                "start_date": "1995-08-23",
                "end_date": "",
                "on-going": True,
            },
        ]
    }

@app.post("/api/newevent")
async def new_event():
    return {
        "status": 200,
        "message": "OK"
    }