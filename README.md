# Prototype BoGL Explorer

An application of the technique to [structure teachable knowledge through program-concept classifications](https://github.com/montymxb/ProgramConceptClassifier) for guiding the presentation order of [BoGL](https://github.com/The-Code-In-Sheep-s-Clothing/bogl) programs.

This approach was designed to demonstrate the efficacy of this technique with new CS teachers who were learning to use BoGL. It was specifically deployed to guide instructors by allowing them to put in known and goal programs to generate a series of next programs to learn. This tool directly implements the ProgramConceptClassifier developed around the same time to classify programs and concepts together into a complete lattice.

## Example

The tool itself is hosted at [bogl.research.uphouseworks.com/](https://bogl.research.uphouseworks.com/), and is currently hosted with OSU's resources. In the event that this link is no longer accessible, I've added a pair of gifs below to demonstrate the core functionality. Programs are written in, a search is performed, and the resulting lattice & fringe of programs can be inspected. The results can be re-computed by modifying either or both programs to guide exploration.

![The initial state of the tool, followed by a single query](https://github.com/montymxb/proto-bogl-explorer/blob/master/g0.gif "Image demonstrating the initial state of the tool, followed by a single query")

![Subsequent query modifying the initial lattice](https://github.com/montymxb/proto-bogl-explorer/blob/master/g1.gif "Subsequent query modifying the initial lattice")

## Running

This project has two parts. The first, being the server that handles requests, can be booted locally by running `stack ghci` followed by `main`. This should setup the server and allow it to listen, without any issues. Similarly, running `stack build`, `stack install`, followed by `proto-bogl-explorer-exe` will run the server as well if you prefer the binary.

The interface to interact with the local server can be setup by running `npm start`. This will boot up a small testing server that will present the web interface and proxy requests to the core server.

Keep in mind that the setup outlined here is for *testing*. Please do not use this setup for anything other than a local demonstrational setup. It is assumed that if you wish to set this up to scale, you would want to look into using NGINX, Apache, or another service to properly serve this.
