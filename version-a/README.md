# Inworld test - version A - Carlos Zanella

This is an implementation of Inworld's "version A" exercise - creating a cooking assistant app that uses AI, allowing the user to load recipes from any URL, ask for instructions, add notes to recipes and making changes to them (which are persisted in a DB).

## Tech stack

* NextJS + React for frontend and backend
* OpenAI for all AI-related tasks (text-to-speech, chat, speech-to-text, recipe parsing)
* Silero VAD (through https://www.vad.ricky0123.com/) for Voice Activity Detection

## Setup

The project has a `docker-compose.yml` and a `Dockerfile` to easily set up a development environment. Follow these steps:

* Copy the `.env.template` file, rename it as `.env`, and add an OpenAI API key in it
* At the `version-A/` folder, run `docker compose up`. This will build the project images and containers (one for NextJS and one for Postgres), set everything up, and start the development server. At this point, you can access the app at http://localhost:3000 .
