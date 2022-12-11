# Frontend

Built with react, docker and love.

## TODO
 - Add production settings, will add asap

# Q&A

### Q: How do I get this thing up and running on my machine?
### A: Install Node, Docker, clone this git. Then create a .env file and fill in the values using the envTemplate file. Run `docker-compose up -d` in Powershell or your terminal of choice.

### Q: Great, how do I close this thing down?
### A: Run `docker-compose down`.

### Q: But wait, what if I added new React components or new enviornment variables?
### A: Docker will cache a lot of the work, if you need to rebuild use `docker-compose up -d --build`.

### Q: How do I view the webpage locally once I get it running?
### A: Enter `localhost:3000` in a web browser. If it doesn't live-update with changes to Javascript and HTML, pester Arthur.