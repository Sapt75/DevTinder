authRouter
- POST / signup
- POST /login
- POST /Logout
7
profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password


connectionRequestRouter
- POST / request/send/:status/:userId
- POST /request/review/:status/:requestId


userRouter
GET /user/connections
GET /user/requests
GET /user/feed - Gets you the profiles of other users on platform